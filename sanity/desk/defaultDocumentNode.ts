import {DefaultDocumentNodeResolver} from 'sanity/desk'
import Iframe from 'sanity-plugin-iframe-pane'
import { SanityDocument } from 'sanity'

// function getPreviewUrl(doc: SanityDocument) {
//   return doc?.slug?.current
//     ? `http://${window.location.host}/${doc.slug.current}`
//     : `http://${window.location.host}/this-is-my-blog-post`
// }

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, {schemaType}) => {
  switch (schemaType) {
    case `post`:
      return S.document().views([
        S.view.form(),
        S.view
          .component(Iframe)
          .options({
    
            url: (doc: SanityDocument) => {
              return doc?.slug?.current
              ? `${window.location.origin}/api/preview?slug=${doc.slug.current}&lang=${doc.language}&id=${doc._id}`
              : `${window.location.origin}/api/preview`
            },
           })
          .title('Preview Mode'),
      ])
    default:
      return S.document().views([S.view.form()])
  }
}