import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'storyNode',
  title: 'Story Node',
  type: 'document',
  fields: [
    defineField({
      name: 'order',
      title: 'Order (replaces numeric id)',
      type: 'number',
      validation: (r) => r.required(),
      description: 'Controls display order on the timeline. Keep unique.',
    }),
    defineField({name: 'year', title: 'Year', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'title', title: 'Title (DE)', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'titleEn', title: 'Title (EN)', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'text', title: 'Text (DE)', type: 'text', validation: (r) => r.required()}),
    defineField({name: 'textEn', title: 'Text (EN)', type: 'text', validation: (r) => r.required()}),
    defineField({name: 'tagline', title: 'Tagline (DE)', type: 'string'}),
    defineField({name: 'taglineEn', title: 'Tagline (EN)', type: 'string'}),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      description: 'Recommended: 1200×800px landscape.',
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
    }),
  ],
  orderings: [
    {title: 'Timeline order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'title', subtitle: 'year', media: 'image'},
  },
})
