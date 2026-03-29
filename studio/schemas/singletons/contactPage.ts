import { defineField, defineType } from 'sanity'

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
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
      name: 'form',
      title: 'Form Section',
      type: 'object',
      fields: [
        { name: 'title', title: 'Form Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 },
      ],
    }),
    defineField({
      name: 'location',
      title: 'Location Info',
      type: 'object',
      fields: [
        { name: 'title', title: 'Label', type: 'string' },
        { name: 'name', title: 'City / Area', type: 'string' },
        { name: 'detail', title: 'Detail', type: 'string' },
      ],
    }),
    defineField({
      name: 'responseTime',
      title: 'Response Time',
      type: 'object',
      fields: [
        { name: 'title', title: 'Label', type: 'string' },
        { name: 'time', title: 'Response Time', type: 'string' },
        { name: 'detail', title: 'Detail', type: 'text', rows: 2 },
      ],
    }),
    defineField({
      name: 'social',
      title: 'Social Links',
      type: 'object',
      fields: [
        { name: 'title', title: 'Section Label', type: 'string' },
        {
          name: 'links',
          title: 'Links',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'platform', title: 'Platform', type: 'string' },
              { name: 'href', title: 'URL', type: 'string' },
            ],
          }],
        },
      ],
    }),
    defineField({
      name: 'quickLinks',
      title: 'Quick Links',
      type: 'object',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string' },
        {
          name: 'items',
          title: 'Links',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'title', title: 'Link Title', type: 'string' },
              { name: 'description', title: 'Description', type: 'text', rows: 2 },
              { name: 'href', title: 'URL', type: 'string' },
            ],
          }],
        },
      ],
    }),
  ],
})
