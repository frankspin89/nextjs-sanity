"use client";

import { useParams } from 'next/navigation'
import type { SanityDocument } from "@sanity/client";
import { useLiveQuery } from "next-sanity/preview";
import { postQuery } from '@/sanity/lib/queries';
import Post from "@/app/_components/Post";

export default function PreviewPost({ post }: { post: SanityDocument }) {
  const params = useParams();

  console.log('post with correct initial draft', post)
  const [data] = useLiveQuery(post, postQuery, { slug: params.slug, language: params.lang });

  console.log('Live query returns non draft content', data)

  // gives correct initial draft content, but of course doesn't update
  //return <Post post={post} />;

  // flashes correct initial draft content, but then updates to non draft content
  return <Post post={data} />;
}
