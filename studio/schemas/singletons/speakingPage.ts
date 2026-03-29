import { defineField, defineType } from 'sanity'

export const speakingPage = defineType({
  name: 'speakingPage',
  title: 'Speaking Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'title', title: 'Page Title', type: 'string' },
        { name: 'description', title: 'Meta Description', type: 'text', rows: 2 },
      ],
    }),
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        { name: 'badge', title: 'Badge', type: 'string' },
        { name: 'headline', title: 'Headline', type: 'string' },
        { name: 'subheadline', title: 'Subheadline', type: 'text', rows: 2 },
        { name: 'ctaText', title: 'Button Text', type: 'string' },
        { name: 'ctaHref', title: 'Button Link', type: 'string' },
      ],
    }),
    defineField({
      name: 'keynoteHighlight',
      title: 'Keynote Highlight',
      type: 'object',
      fields: [
        { name: 'image', title: 'Photo Path', type: 'string' },
        { name: 'imageAlt', title: 'Photo Alt Text', type: 'string' },
        { name: 'tag', title: 'Tag', type: 'string' },
        { name: 'title', title: 'Event Title', type: 'string' },
        { name: 'location', title: 'Location', type: 'string' },
        { name: 'talkTitle', title: 'Talk Title', type: 'string' },
        { name: 'description', title: 'Description', type: 'text', rows: 3 },
      ],
    }),
    defineField({
      name: 'topics',
      title: 'Speaking Topics',
      type: 'object',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 },
        { name: 'intro', title: 'Intro Text', type: 'string' },
        {
          name: 'items',
          title: 'Topics',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'Add each speaking topic as a separate item.',
        },
      ],
    }),
    defineField({
      name: 'audiences',
      title: 'Audiences Section',
      type: 'object',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 },
        { name: 'items', title: 'Audience Types', type: 'array', of: [{ type: 'string' }] },
      ],
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'object',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 },
        {
          name: 'headlineQuotes',
          title: 'Headline Quotes (short pull-quotes)',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'text', title: 'Quote', type: 'string' },
              { name: 'note', title: 'Note (optional)', type: 'string' },
            ],
          }],
        },
        {
          name: 'items',
          title: 'Full Testimonials',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'quote', title: 'Quote', type: 'text', rows: 4 },
              { name: 'name', title: 'Name', type: 'string' },
              { name: 'role', title: 'Role / Affiliation', type: 'string' },
              { name: 'event', title: 'Event', type: 'string' },
            ],
          }],
        },
      ],
    }),
    defineField({
      name: 'videos',
      title: 'Videos Section',
      type: 'object',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 },
        {
          name: 'primary',
          title: 'Primary Video',
          type: 'object',
          fields: [
            { name: 'embedId', title: 'YouTube Video ID', type: 'string' },
            { name: 'title', title: 'Video Title', type: 'string' },
            { name: 'caption', title: 'Caption', type: 'text', rows: 2 },
          ],
        },
        {
          name: 'secondary',
          title: 'Secondary Videos',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'embedId', title: 'YouTube Video ID', type: 'string' },
              { name: 'title', title: 'Video Title', type: 'string' },
              { name: 'caption', title: 'Caption', type: 'text', rows: 2 },
            ],
          }],
        },
      ],
    }),
    defineField({
      name: 'bookingForm',
      title: 'Booking Form Section',
      type: 'object',
      fields: [
        { name: 'title', title: 'Form Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 },
      ],
    }),
  ],
})
