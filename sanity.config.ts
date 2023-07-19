/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...index]]/page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import { documentInternationalization } from '@sanity/document-internationalization'
import {i18n} from './languages'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './sanity/env'
import {schema} from './sanity/schema'
//import { defaultDocumentNode } from './sanity/desk/defaultDocumentNode'
import { structure, defaultDocumentNode } from './sanity/structure'


export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schema' folder
  schema: {
    types: schema.types,
    templates: (prev) => {
      const prevFiltered = prev.filter((template) => template.id !== 'post')

      return [
        ...prevFiltered,
        {
          id: 'post-language',
          title: 'post with Language',
          schemaType: 'post',
          parameters: [{name: 'language', type: 'string'}],
          value: (params: {language: string}) => ({
            language: params.language,
          }),
        },
      ]
    },
  },
  plugins: [
    deskTool({ structure, defaultDocumentNode }),
    // Vision is a tool that lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
    documentInternationalization({
      // Required configuration
      supportedLanguages: i18n.languages,
      schemaTypes: ['post'],
      languageField: `language`
    })
  ],
})
