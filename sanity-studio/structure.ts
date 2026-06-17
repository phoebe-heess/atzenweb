import type {StructureResolver} from 'sanity/structure'

// Pins beerProfile / brandHub as singletons (no "create new", always edits doc id "main").
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Atzengold Content')
    .items([
      S.listItem()
        .title('Beer Profile')
        .child(S.document().schemaType('beerProfile').documentId('beerProfile-main')),
      S.listItem()
        .title('Brand Hub')
        .child(S.document().schemaType('brandHub').documentId('brandHub-main')),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !['beerProfile', 'brandHub'].includes(item.getId() ?? ''),
      ),
    ])
