// ./nextjs-app/sanity/lib/queries.ts

import { groq } from "next-sanity";

// Get all posts
export const postsQuery = groq`*[_type == "post" && defined(slug.current) && language == $language]{
    _id, title, slug, language
  }`;

// Get a single post by its slug
export const postQuery = groq`*[_type == "post" && slug.current == $slug && language == $language][0]{ 
    title, mainImage, body, language, "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
    title,
    slug,
    language
  },
  }`;

// Get all post slugs
// export const postPathsQuery = groq`*[_type == "post" && defined(slug.current)][]{
//     "params": { "slug": slug.current }
//   }`;


export const postPathsQuery = groq`*[_type == "post" && defined(slug)]{
  "post": slug
}.post`