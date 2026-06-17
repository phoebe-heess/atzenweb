import {defineField, defineType} from 'sanity'

// Singleton document — pin id to "brandHub" in the Studio's structure builder.
export default defineType({
  name: 'brandHub',
  title: 'Brand Hub',
  type: 'document',
  fields: [
    defineField({
      name: 'colors',
      title: 'Colors',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'brandColor',
          fields: [
            defineField({name: 'name', title: 'Name', type: 'string'}),
            defineField({name: 'role', title: 'Role', type: 'string'}),
            defineField({name: 'hex', title: 'Hex / OKLCH', type: 'string'}),
            defineField({name: 'rgb', title: 'RGB', type: 'string'}),
            defineField({name: 'cmyk', title: 'CMYK', type: 'string'}),
            defineField({name: 'usage', title: 'Usage', type: 'text'}),
            defineField({name: 'textColor', title: 'Text Color Class', type: 'string'}),
            defineField({name: 'bgColor', title: 'Background Color Class', type: 'string'}),
          ],
          preview: {select: {title: 'name', subtitle: 'role'}},
        },
      ],
    }),
    defineField({
      name: 'values',
      title: 'Brand Values',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'brandValue',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'text'}),
          ],
        },
      ],
    }),
    defineField({
      name: 'coreValues',
      title: 'Core Values',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'coreValue',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'text'}),
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Brand Hub (singleton)'}
    },
  },
})
