import { SanityDocument } from "@sanity/client";
import { draftMode } from "next/headers";
import Post from "@/app/_components/Post";
import PreviewProvider from "@/app/_components/PreviewProvider";
import PreviewPost from "@/app/_components/PreviewPost";
import { postPathsQuery, postQuery } from "@/sanity/lib/queries";
import { cachedClientFetch } from "@/sanity/lib/getClient";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from 'next';
import { LanguageObject } from "@/lib/types";
import Header from "@/app/_components/Header";
import { getPostsWithSlugs } from '@/sanity/lib/loaders'
import {i18n} from '@/languages'
import { ExitPreview } from "@/app/_components/ExitPreview";

export async function generateStaticParams() {
  const posts = await getPostsWithSlugs()

  const params: {language: string; post: string}[] = posts
    .map((post: { [x: string]: { current: any; }; }) =>
      i18n.languages
        .map((language) =>
          post?.[language.id]?.current
            ? {post: post[language.id].current, language: language.id}
            : null
        )
        .filter(Boolean)
    )
    .flat()

  return params
}

export async function generateMetadata({params}: {params: {lang: string, slug: string}}): Promise<Metadata> {
  const post = await cachedClientFetch()<SanityDocument>(postPathsQuery, { slug: params.slug, language: params.lang });

  if (!post) {
    return {}
  }

  // TODO: return correct metadata when aren't translations
  if (!post._translations) {
    return {}
  }

  const languages: LanguageObject = {};
  post._translations.forEach((translation: { language: string; slug: { current: any; }; }) => {
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
  
  const post = await cachedClientFetch(preview)<SanityDocument>(postQuery, { slug: params.slug, language: params.lang });

  const translations = post?._translations.map((translation: { language: string; slug: { current: any; }; }) => ({
    language: translation.language,
    path: `/${translation.language}/${translation.slug.current}`,
    title: translation?.language, //@TODO FIX
  }));

  // don't throw 404 if preview mode is on
  if (!post && !preview) {
    notFound();
  }
  
  if (preview?.token) {
    return (
      <PreviewProvider token={preview.token}>
        <ExitPreview />
        <Header translations={translations} currentLanguage={params.lang} />
        <PreviewPost post={post} />
      </PreviewProvider>
    ) 
  }

  return (
    <>
      <Header translations={translations} currentLanguage={params.lang} />
      <Post post={post} />;
    </>
    )
}