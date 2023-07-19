import {SanityClient} from '@sanity/client'
import {SanityDocument} from 'sanity'

import {getSecret, SECRET_ID} from './getSecret'

export default async function resolvePreviewUrl(doc: SanityDocument, client: SanityClient) {
  let baseUrl = `http://localhost:3000`

  // Use public vars because Studio is all client-side
  if (process.env.VERCEL) {
    // This is the URL of the Studio deployment, not the web deployment
    baseUrl =
      process.env.VERCEL_ENV 
        ? `${process.env.NEXT_PUBLIC_SANITY_STUDIO_URL}`
        : // This should work, but doesn't
          // the env seems to be `undefined` in vercel
          // : process.env.SANITY_STUDIO_VERCEL_BRANCH_URL
          // So I'm DIY-ing a branch URL for the web deployment
          ``
  }

  const {_id} = doc

  const previewUrl = new URL(`/api/preview`, baseUrl)

  if (_id) {
    previewUrl.searchParams.set(`id`, _id.replace(`drafts.`, ``))
  }

  const secret = await getSecret(client, SECRET_ID, true)

  if (secret) {
    previewUrl.searchParams.set('secret', secret)
  }

  return previewUrl.toString()
}
