import { draftMode } from "next/headers";
import { cachedClientFetch } from "@/sanity/lib/getClient";
import { postsQuery } from "@/sanity/lib/queries";
import Posts from "@/app/_components/Posts";
import PreviewPosts from "@/app/_components/PreviewPosts";
import PreviewProvider from "@/app/_components/PreviewProvider";
import Header from "@/app/_components/Header";
import { i18n } from "@/languages";

export default async function Home({params}: {params: {lang: string}}) {
  const preview = draftMode().isEnabled
    ? { token: process.env.SANITY_API_READ_TOKEN }
    : undefined;
  
  const posts = await cachedClientFetch(preview)(postsQuery, { language: params.lang });

  const translations = i18n.languages.map((lang) => {
    return {
      language: lang.id,
      path: `/${lang.id}`,
      title: lang.title,
    }
  })

  if (preview && preview.token) {
    return (
      <>
        <PreviewProvider token={preview.token}>
          <div className="bg-red-200 py-4 text-center px-4">Draft/preview mode on</div>
          <Header translations={translations} currentLanguage={params.lang} />
          <div className="max-w-3xl mx-auto">
            <PreviewPosts posts={posts} />
          </div>
        </PreviewProvider>
      </>
    );
  }

  return (
    <>
      <Header translations={translations} currentLanguage={params.lang} />
      <div className="max-w-3xl mx-auto">
        <Posts posts={posts} />
      </div>
    </>
  )
}
