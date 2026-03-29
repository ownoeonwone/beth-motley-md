import { defineField, defineType } from 'sanity'

export const mediaItem = defineType({
  name: 'mediaItem',
  title: 'Media Appearances',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Podcast', value: 'podcast' },
          { title: 'Video', value: 'video' },
          { title: 'Article / Press', value: 'article' },
          { title: 'Press Feature', value: 'press' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'source',
      title: 'Source / Show Name',
      type: 'string',
      description: 'e.g. "PLANTSTRONG Podcast", "Woman\'s World Magazine"',
    }),
    defineField({
      name: 'date',
      title: 'Date (displayed as text)',
      type: 'string',
      description: 'e.g. "February 2025" or "2024"',
    }),
    defineField({
      name: 'href',
      title: 'Link URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'embedId',
      title: 'YouTube Video ID',
      type: 'string',
      description: 'Only for YouTube videos — the ID from the URL (e.g. "Ts1LKLXqvCo")',
    }),
    defineField({
      name: 'image',
      title: 'Thumbnail Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'featured',
      title: 'Featured (show prominently)',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'source', media: 'image' },
  },
  orderings: [
    {
      title: 'Date (newest first)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
})
