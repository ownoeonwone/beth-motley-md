import { defineField, defineType } from 'sanity'

export const mediaPage = defineType({
  name: 'mediaPage',
  title: 'Media Page',
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
      name: 'featuredLogos',
      title: '"As Featured In" Logos',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'src', title: 'Image Path', type: 'string' },
          { name: 'alt', title: 'Organization Name (alt text)', type: 'string' },
        ],
      }],
    }),
    defineField({
      name: 'pressHighlight',
      title: 'Press Highlight Feature',
      type: 'object',
      fields: [
        { name: 'tag', title: 'Tag', type: 'string' },
        { name: 'image', title: 'Image Path', type: 'string' },
        { name: 'imageAlt', title: 'Image Alt Text', type: 'string' },
        { name: 'title', title: 'Article Title', type: 'string' },
        { name: 'pullQuote', title: 'Pull Quote', type: 'text', rows: 2 },
        { name: 'description', title: 'Description', type: 'text', rows: 3 },
        { name: 'linkText', title: 'Link Text', type: 'string' },
        { name: 'linkHref', title: 'Link URL', type: 'string' },
      ],
    }),
    defineField({
      name: 'allMedia',
      title: 'All Media Section Header',
      type: 'object',
      description: 'Individual media items are managed under "Media Appearances" in the sidebar.',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'string' },
      ],
    }),
    defineField({
      name: 'podcastCta',
      title: 'Podcast Invite CTA',
      type: 'object',
      fields: [
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 },
        { name: 'ctaText', title: 'Button Text', type: 'string' },
        { name: 'ctaHref', title: 'Button Link', type: 'string' },
      ],
    }),
  ],
})
