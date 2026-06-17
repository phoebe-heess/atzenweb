import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'venue',
  title: 'Venue',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      validation: (r) => r.required(),
      options: {
        list: [
          {title: 'Supermarkt', value: 'Supermarkt'},
          {title: 'Späti', value: 'Späti'},
          {title: 'Getränkemarkt', value: 'Getränkemarkt'},
          {title: 'Biergarten', value: 'Biergarten'},
          {title: 'Kneipe', value: 'Kneipe'},
          {title: 'Bar', value: 'Bar'},
        ],
      },
    }),
    defineField({name: 'isGastronomy', title: 'Gastronomy?', type: 'boolean', initialValue: false}),
    defineField({name: 'address', title: 'Address', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'distance', title: 'Distance (km)', type: 'number', initialValue: 0}),
    defineField({name: 'rating', title: 'Rating', type: 'string'}),
    defineField({name: 'isOpen', title: 'Open Now?', type: 'boolean', initialValue: true}),
    defineField({name: 'openingHours', title: 'Opening Hours', type: 'string'}),
    defineField({name: 'hasFood', title: 'Has Food?', type: 'boolean', initialValue: false}),
    defineField({name: 'dogFriendly', title: 'Dog Friendly?', type: 'boolean', initialValue: false}),
    defineField({
      name: 'location',
      title: 'Coordinates',
      type: 'geopoint',
      description: 'lat = latitude, lng = longitude (replaces the old separate longitude/latitude fields)',
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'type'},
  },
})
