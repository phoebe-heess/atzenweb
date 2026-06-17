import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'merchItem',
  title: 'Merch Item',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'price', title: 'Price (€)', type: 'number', validation: (r) => r.required().positive()}),
    defineField({name: 'promoPrice', title: 'Promo Price (€)', type: 'number'}),
    defineField({name: 'description', title: 'Description', type: 'text', validation: (r) => r.required()}),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      validation: (r) => r.required(),
      options: {
        list: [
          {title: 'Apparel', value: 'Apparel'},
          {title: 'Drinkware', value: 'Drinkware'},
          {title: 'Accessory', value: 'Accessory'},
        ],
      },
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      description: 'First image is used as the primary/cover image. Recommended: 800×800px.',
    }),
    defineField({
      name: 'sizes',
      title: 'Sizes',
      type: 'array',
      of: [{type: 'string'}],
      description: 'e.g. S, M, L, XL',
    }),
    defineField({
      name: 'options',
      title: 'Additional Options',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'merchOption',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'values', title: 'Values', type: 'array', of: [{type: 'string'}]}),
          ],
        },
      ],
    }),
    defineField({name: 'inStock', title: 'In Stock?', type: 'boolean', initialValue: true}),
    defineField({
      name: 'stock',
      title: 'Stock per Variant',
      type: 'array',
      description: 'Optional: stock count per size/variant key.',
      of: [
        {
          type: 'object',
          name: 'stockEntry',
          fields: [
            defineField({name: 'variant', title: 'Variant (e.g. size)', type: 'string'}),
            defineField({name: 'count', title: 'Count', type: 'number'}),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'category', media: 'images.0'},
  },
})
