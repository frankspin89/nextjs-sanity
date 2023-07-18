// ./nextjs-app/app/[slug]/page.tsx

import { SanityDocument } from "@sanity/client";
import { draftMode } from "next/headers";
import Post from "@/app/_components/Post";
import PreviewProvider from "@/app/_components/PreviewProvider";
import PreviewPost from "@/app/_components/PreviewPost";
import { cachedClient } from "@/sanity/lib/client";
import { postPathsQuery, postQuery } from "@/sanity/lib/queries";
import { getCachedClient } from "@/sanity/lib/getClient";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from 'next';
import { headers } from 'next/headers'

// Prepare Next.js to know which routes already exist
// export async function generateStaticParams(params: { lang: string }) {
//   const posts = await cachedClient(postPathsQuery, { language: params.lang });

//   return posts;
// }

export async function generateMetadata({params}: {params: {lang: string, slug: string}}): Promise<Metadata> {
  const post = await getCachedClient()<SanityDocument>(postQuery, { slug: params.slug, language: params.lang });

  if (!post) {
    return {}
  }

  const languages = {};
  post._translations.forEach((translation) => {
    languages[`${translation.language}`] = `${translation.language}/${translation.slug.current}`;
  });


  return {
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_SITE_URL!}`),
    alternates: {
      canonical: `/${params.lang}/${params.slug}`,
      languages
    }
  }

}

export default async function Page({params}: {params: {lang: string, slug: string}}) {
  const preview = draftMode().isEnabled
    ? { token: process.env.SANITY_API_READ_TOKEN }
    : undefined;
  
  const post = await getCachedClient(preview)<SanityDocument>(postQuery, { slug: params.slug, language: params.lang });

  if (!post) {
    notFound();
  }
  
  if (preview?.token) {
    return (
      <PreviewProvider token={preview.token}>
        <PreviewPost post={post} />
      </PreviewProvider>
    ); 
  }

return <Post post={post} />;
}