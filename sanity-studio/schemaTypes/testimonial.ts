import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'role', title: 'Role', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'textDE', title: 'Text (DE)', type: 'text', validation: (r) => r.required()}),
    defineField({name: 'textEN', title: 'Text (EN)', type: 'text', validation: (r) => r.required()}),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
      description: 'Recommended: square, ≤400×400px.',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      options: {
        list: [
          {title: 'Nürnberg', value: 'nurnberg'},
          {title: 'Fürth', value: 'furth'},
          {title: 'Berlin', value: 'berlin'},
          {title: 'Erlangen', value: 'erlangen'},
        ],
      },
    }),
    defineField({
      name: 'rating',
      title: 'Rating (1–5)',
      type: 'number',
      validation: (r) => r.min(1).max(5),
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'role', media: 'image'},
  },
})
