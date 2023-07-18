import {FiAward, FiType, FiUsers} from 'react-icons/fi'
import {StructureResolver, DefaultDocumentNodeResolver} from 'sanity/desk'

import {i18n} from '../../languages'
import preview from './preview'
import references from './references'
import transifex from './transifex'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Custom document-level translation structure
      S.listItem()
        .title('Posts')
        .icon(FiAward)
        .child(
          S.list()
            .title('Post')
            .items([
              ...i18n.languages.map((language) =>
                S.listItem()
                  .title(`Posts (${language.id.toLocaleUpperCase()})`)
                  .schemaType('post')
                  .icon(FiAward)
                  .child(
                    S.documentList()
                      .id(language.id)
                      .title(`${language.title} Posts`)
                      .schemaType('post')
                      .filter('_type == "post" && language == $language')
                      .params({language: language.id})
                      .initialValueTemplates([
                        S.initialValueTemplateItem('post-language', {
                          id: 'post-language',
                          language: language.id,
                        }),
                      ])
                      .canHandleIntent((intentName, params) => {
                        // TODO: Handle **existing** documents (like search results when clicked)
                        // to return `true` on the correct language list!
                        if (intentName === 'edit') {
                          // return params?.language === language.id
                          return false
                        }

                        // Not an initial value template
                        if (!params.template) {
                          return true
                        }

                        // Template name structure example: "lesson-en"
                        const languageValue = params?.template?.split(`-`).pop()

                        return languageValue === language.id
                      })
                  )
              ),
              // I have only added this item so that search results when clicked will load this list
              // If the intent checker above could account for it, I'd remove this item
              S.divider(),
              S.listItem()
                .title(`All Posts`)
                .schemaType('post')
                .icon(FiAward)
                .child(
                  S.documentList()
                    .id(`all-posts`)
                    .title(`All posts`)
                    .schemaType('post')
                    .filter('_type == "post"')
                    // Load this pane for existing `lesson` documents
                    // or new documents that aren't using an initial value template
                    .canHandleIntent(
                      (intentName, params) => intentName === 'edit' || params.template === `post`
                    )
                ),
            ])
        ),
      S.divider(),
      // Field-level translations
      // S.documentTypeListItem('course').title('Courses'),
      // S.documentTypeListItem('presenter').title('Presenters').icon(FiUsers),
      // S.divider(),
      // // Singleton, field-level translations
      // S.documentListItem().schemaType('labelGroup').icon(FiType).id('labelGroup').title('Labels'),
      // S.divider(),
      // // Market-specific portable text example
      // S.documentTypeListItem('legal').title('Legal'),
      S.divider(),
    ])

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, {schemaType, getClient}) => {
  const client = getClient({apiVersion: `2023-01-01`})

  switch (schemaType) {
    // case 'presenter':
    //   return S.document().views([S.view.form(), preview(S, client), references(S)])
    // case 'course':
    //   return S.document().views([S.view.form(), preview(S, client), transifex(S)])
    case 'lesson':
      return S.document().views([S.view.form(), preview(S, client)])
    // case 'legal':
    //   return S.document().views([S.view.form(), preview(S, client)])
    default:
      return S.document()
  }
}
