// ./nextjs-app/app/api/preview/route.ts

import { clean } from "@/app/_components/Clean";
import { i18n } from "@/languages";
import { previewClient } from "@/sanity/lib/getClient";
import { SECRET_ID, getSecret } from "@/sanity/structure/getSecret";
import { groq } from "next-sanity";
import { draftMode } from "next/headers";

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url)
//   const slug = searchParams.get('slug')
//   draftMode().enable()
//   return new Response('Draft mode is enabled', {
//     status: 307,
//     headers: { Location: slug ? `/${slug}` : '/', }
//   })
// }

function isLinkToOurDomain(url: string) {
  let suppliedUrl = new URL(url)

  // If url is relative, the 2nd arg will act as the base domain.
  const safeOrigin = process.env.VERCEL
    ? `https://${
        process.env.VERCEL_ENV === 'production'
          ? process.env.VERCEL_URL
          : process.env.VERCEL_BRANCH_URL
      }`
    : `http://localhost:3000`
  let checkUrl = new URL(url, safeOrigin)

  // if the origins don't match we've been given a url
  // to a site that's not ours!
  return suppliedUrl.origin === checkUrl.origin
}

export async function GET(request: Request) {
  const { origin, searchParams } = new URL(request.url)

  const id = searchParams.get('id')

  if (!id) {
    return new Response('No "id" provided', {status: 401})
  } else if (id.startsWith('drafts.')) {
    return new Response('Must use a published "id"', {status: 401})
  } else if (!searchParams.get('secret')) {
    return new Response('No "secret" provided', {status: 401})
  }

  const secret = clean(await getSecret(previewClient, SECRET_ID, false))

  console.log('secret', secret)

  if (!secret) {
    return new Response('No "secret" found', {status: 401})
  } else if (searchParams.get('secret') !== secret) {
    return new Response('Invalid "secret"', {status: 401})
  }

    // Ensure this slug actually exists in the dataset
  const query = groq`*[_id == $id && defined(slug)]|order(_updatedAt desc)[0]{ _type, language, slug }`
  const doc = await previewClient.fetch(query, {id})

  if (!doc) {
    return new Response('Document not found', {status: 401})
  }

    // Create the full slug from the id
  const {_type} = doc

  let slug

    // Build full URL based on returned document
  switch (_type) {
    // case 'legal':
    //   slug = doc?.slug?.current ? `/legal/${doc.slug.current}` : ``
    //   break
    // case 'presenter':
    //   slug = doc?.slug?.current ? `/presenter/${doc.slug.current}` : ``
    //   break
    // case 'post':
    //   slug = doc?.slug?.current ? `/${doc.slug.current}` : ``
    //   break
    case 'post':
      console.log('post in case', doc)
      slug = doc?.slug?.current ? `/${doc.language}/${doc.slug.current}` : ``
      break
    default:
      break
  }

  console.log('slug', slug)

  if (!slug) {
    return new Response('Slug not found', {status: 401})
  }


  // Redirect to the newly created slug
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  const redirectUrl = new URL(slug, origin)

  if (!isLinkToOurDomain(redirectUrl.toString())) {
    return new Response(`Unsafe redirect: ${redirectUrl}`, {status: 401})
  }

  // Initialise draft mode
  draftMode().enable()

  return Response.redirect(redirectUrl.toString())

}