import { defineField, defineType } from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
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
      ],
    }),
    defineField({
      name: 'story',
      title: 'Story Section',
      type: 'object',
      fields: [
        { name: 'image', title: 'Photo Path', type: 'string' },
        { name: 'imageAlt', title: 'Photo Alt Text', type: 'string' },
        { name: 'title', title: 'Section Title', type: 'string' },
        {
          name: 'paragraphs',
          title: 'Story Paragraphs',
          type: 'array',
          of: [{ type: 'text' }],
          description: 'Each item is one paragraph.',
        },
      ],
    }),
    defineField({
      name: 'credentials',
      title: 'Education & Credentials',
      type: 'object',
      fields: [
        { name: 'tag', title: 'Tag', type: 'string' },
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 },
        {
          name: 'timeline',
          title: 'Timeline Items',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'years', title: 'Years', type: 'string' },
              { name: 'title', title: 'Degree / Credential', type: 'string' },
              { name: 'institution', title: 'Institution', type: 'string' },
              { name: 'description', title: 'Description', type: 'text', rows: 2 },
            ],
          }],
        },
      ],
    }),
    defineField({
      name: 'approach',
      title: 'My Approach Section',
      type: 'object',
      fields: [
        { name: 'tag', title: 'Tag', type: 'string' },
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 },
        {
          name: 'items',
          title: 'Approach Items',
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
      name: 'cta',
      title: 'Call to Action Section',
      type: 'object',
      fields: [
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'description', title: 'Description', type: 'text', rows: 2 },
        {
          name: 'links',
          title: 'CTA Links',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'title', title: 'Link Title', type: 'string' },
              { name: 'description', title: 'Link Description', type: 'text', rows: 2 },
              { name: 'href', title: 'Link URL', type: 'string' },
            ],
          }],
        },
      ],
    }),
  ],
})
