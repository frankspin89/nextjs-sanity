// ./nextjs-app/app/api/preview/route.ts

import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  draftMode().enable()
  return new Response('Draft mode is enabled', {
    status: 307,
    headers: { Location: slug ? `/${slug}` : '/', }
  })
}