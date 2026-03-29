import { defineField, defineType } from 'sanity'

export const executiveMdPage = defineType({
  name: 'executiveMdPage',
  title: 'Executive MD Program Page',
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
        { name: 'note', title: 'Note (e.g. "By Application Only")', type: 'string' },
      ],
    }),
    defineField({
      name: 'problem',
      title: 'Problem Section',
      type: 'object',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'intro', title: 'Intro Text', type: 'text', rows: 3 },
        { name: 'body', title: 'Body Text', type: 'text', rows: 4 },
      ],
    }),
    defineField({
      name: 'included',
      title: "What's Included",
      type: 'object',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 },
        {
          name: 'items',
          title: 'Included Items',
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
      name: 'whoThisIsFor',
      title: 'Who This Is For',
      type: 'object',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 },
        {
          name: 'paragraphs',
          title: 'Paragraphs',
          type: 'array',
          of: [{ type: 'text' }],
        },
      ],
    }),
    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'object',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'string' },
        {
          name: 'items',
          title: 'Questions',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'question', title: 'Question', type: 'string' },
              { name: 'answer', title: 'Answer', type: 'text', rows: 4 },
            ],
          }],
        },
      ],
    }),
    defineField({
      name: 'ctaForm',
      title: 'CTA Form Section',
      type: 'object',
      fields: [
        { name: 'title', title: 'Form Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 },
      ],
    }),
  ],
})
