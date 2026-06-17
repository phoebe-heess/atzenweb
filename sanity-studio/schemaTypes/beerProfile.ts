import {defineField, defineType} from 'sanity'

// Singleton document — pin id to "beerProfile" in the Studio's structure builder
// (see sanity.config.ts / structure.ts) so editors can't create a second one.
export default defineType({
  name: 'beerProfile',
  title: 'Beer Profile',
  type: 'document',
  fields: [
    defineField({name: 'abv', title: 'ABV (%)', type: 'number'}),
    defineField({name: 'ibu', title: 'IBU', type: 'number'}),
    defineField({
      name: 'characteristics',
      title: 'Characteristics',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'characteristic',
          fields: [
            defineField({name: 'key', title: 'Key', type: 'string'}),
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'value', title: 'Value', type: 'string'}),
          ],
        },
      ],
    }),
    defineField({
      name: 'gauges',
      title: 'Flavor Gauges',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'gauge',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'targetValue', title: 'Target Value', type: 'number'}),
            defineField({name: 'colorClass', title: 'Color Class', type: 'string'}),
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Beer Profile (singleton)'}
    },
  },
})
