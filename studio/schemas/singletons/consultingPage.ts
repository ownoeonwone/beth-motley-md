import { defineField, defineType } from 'sanity'

export const consultingPage = defineType({
  name: 'consultingPage',
  title: 'Consulting Page',
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
      name: 'whoIHelp',
      title: 'Who I Help',
      type: 'object',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 },
        {
          name: 'items',
          title: 'Client Types',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'title', title: 'Title', type: 'string' },
              { name: 'description', title: 'Description', type: 'text', rows: 2 },
            ],
          }],
        },
      ],
    }),
    defineField({
      name: 'whatIOffer',
      title: 'What I Offer',
      type: 'object',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 },
        {
          name: 'items',
          title: 'Services',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'title', title: 'Service Title', type: 'string' },
              { name: 'description', title: 'Description', type: 'text', rows: 2 },
            ],
          }],
        },
      ],
    }),
    defineField({
      name: 'howItWorks',
      title: 'How It Works',
      type: 'object',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 },
        {
          name: 'steps',
          title: 'Steps',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'title', title: 'Step Title', type: 'string' },
              { name: 'description', title: 'Description', type: 'text', rows: 2 },
            ],
          }],
        },
      ],
    }),
    defineField({
      name: 'providerTools',
      title: 'Free Provider Tools',
      type: 'object',
      fields: [
        { name: 'tag', title: 'Tag', type: 'string' },
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 },
        {
          name: 'items',
          title: 'Tool Links',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'title', title: 'Title', type: 'string' },
              { name: 'description', title: 'Description', type: 'text', rows: 2 },
              { name: 'href', title: 'URL', type: 'string' },
            ],
          }],
        },
      ],
    }),
    defineField({
      name: 'contactForm',
      title: 'Contact Form Section',
      type: 'object',
      fields: [
        { name: 'title', title: 'Form Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 },
        { name: 'note', title: 'Note', type: 'text', rows: 2 },
      ],
    }),
  ],
})
