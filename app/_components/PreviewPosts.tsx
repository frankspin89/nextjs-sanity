// ./nextjs-app/app/_components/PreviewPosts.tsx

"use client";

import type { SanityDocument } from "@sanity/client";
import { useLiveQuery } from "@sanity/preview-kit";
import Posts from "@/app/_components/Posts";
import { postsQuery } from "@/sanity/lib/queries";
import { useParams } from "next/navigation";

export default function PreviewPosts({
  posts = [],
}: {
  posts: SanityDocument[];
  }) {
  const params = useParams();
  const [data] = useLiveQuery(posts, postsQuery, { language: params.lang });

  return <Posts posts={data} />;
}
