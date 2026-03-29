import { defineField, defineType } from 'sanity'

export const resourcesPage = defineType({
  name: 'resourcesPage',
  title: 'Resources Page',
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
      name: 'pillars',
      title: 'Six Pillars Resource Lists',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'id', title: 'ID (e.g. "nutrition")', type: 'string' },
          { name: 'label', title: 'Label', type: 'string' },
          { name: 'subtitle', title: 'Subtitle', type: 'string' },
          { name: 'color', title: 'Color', type: 'string' },
          {
            name: 'resources',
            title: 'Resources',
            type: 'array',
            of: [{
              type: 'object',
              fields: [
                { name: 'title', title: 'Resource Title', type: 'string' },
                { name: 'type', title: 'Type (e.g. "Starter guide")', type: 'string' },
                { name: 'href', title: 'Link URL', type: 'string' },
                { name: 'bethPick', title: "Beth's Pick", type: 'boolean' },
                { name: 'description', title: 'Description', type: 'text', rows: 2 },
              ],
            }],
          },
        ],
      }],
    }),
    defineField({
      name: 'aclm',
      title: 'ACLM Resources Section',
      type: 'object',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 },
        {
          name: 'items',
          title: 'ACLM Links',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'title', title: 'Title', type: 'string' },
              { name: 'href', title: 'URL', type: 'string' },
              { name: 'description', title: 'Description', type: 'text', rows: 2 },
            ],
          }],
        },
      ],
    }),
    defineField({
      name: 'providers',
      title: 'Provider Tools Section',
      type: 'object',
      fields: [
        { name: 'badge', title: 'Badge', type: 'string' },
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 },
        {
          name: 'items',
          title: 'Provider Tool Items',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'id', title: 'ID', type: 'string' },
              { name: 'title', title: 'Title', type: 'string' },
              { name: 'platform', title: 'Platform', type: 'string' },
              { name: 'href', title: 'URL', type: 'string' },
              { name: 'cta', title: 'Button Text', type: 'string' },
              { name: 'icon', title: 'Icon', type: 'string' },
            ],
          }],
        },
      ],
    }),
    defineField({
      name: 'newsletter',
      title: 'Newsletter Section',
      type: 'object',
      fields: [
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'description', title: 'Description', type: 'text', rows: 2 },
      ],
    }),
  ],
})
