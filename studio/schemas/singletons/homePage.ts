import { defineField, defineType } from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'title', title: 'Page Title', type: 'string', validation: (Rule) => Rule.required() },
        { name: 'description', title: 'Meta Description', type: 'text', rows: 2 },
      ],
    }),
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        { name: 'badge', title: 'Badge Text', type: 'string' },
        { name: 'headline', title: 'Headline', type: 'string' },
        { name: 'subheadline', title: 'Subheadline', type: 'text', rows: 2 },
        {
          name: 'primaryCta',
          title: 'Primary Button',
          type: 'object',
          fields: [
            { name: 'text', title: 'Button Text', type: 'string' },
            { name: 'href', title: 'Button Link', type: 'string' },
          ],
        },
        {
          name: 'secondaryCta',
          title: 'Secondary Button',
          type: 'object',
          fields: [
            { name: 'text', title: 'Button Text', type: 'string' },
            { name: 'href', title: 'Button Link', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'doctorIntro',
      title: 'Doctor Intro',
      type: 'object',
      fields: [
        { name: 'image', title: 'Photo Path', type: 'string' },
        { name: 'imageAlt', title: 'Photo Alt Text', type: 'string' },
        { name: 'name', title: 'Name & Credentials', type: 'string' },
        { name: 'bio', title: 'Short Bio', type: 'text', rows: 3 },
        { name: 'linkText', title: 'Link Text', type: 'string' },
        { name: 'linkHref', title: 'Link URL', type: 'string' },
      ],
    }),
    defineField({
      name: 'lifestyleMedicine',
      title: 'Lifestyle Medicine Section',
      type: 'object',
      fields: [
        { name: 'tag', title: 'Tag', type: 'string' },
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 },
        {
          name: 'pillars',
          title: 'Six Pillars',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'title', title: 'Pillar Name', type: 'string' },
              { name: 'description', title: 'Description', type: 'text', rows: 2 },
            ],
          }],
        },
      ],
    }),
    defineField({
      name: 'programs',
      title: 'Programs Section',
      type: 'object',
      fields: [
        { name: 'tag', title: 'Tag', type: 'string' },
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 },
        {
          name: 'items',
          title: 'Program Cards',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'title', title: 'Program Title', type: 'string' },
              { name: 'description', title: 'Description', type: 'text', rows: 3 },
              { name: 'href', title: 'Link', type: 'string' },
              { name: 'icon', title: 'Icon', type: 'string' },
              { name: 'features', title: 'Feature Bullets', type: 'array', of: [{ type: 'string' }] },
            ],
          }],
        },
      ],
    }),
    defineField({
      name: 'aboutPreview',
      title: 'About Preview Section',
      type: 'object',
      fields: [
        { name: 'tag', title: 'Tag', type: 'string' },
        { name: 'headline', title: 'Headline', type: 'string' },
        { name: 'image', title: 'Photo Path', type: 'string' },
        { name: 'imageAlt', title: 'Photo Alt Text', type: 'string' },
        { name: 'paragraphs', title: 'Paragraphs', type: 'array', of: [{ type: 'text' }] },
        { name: 'badges', title: 'Credential Badges', type: 'array', of: [{ type: 'string' }] },
        { name: 'linkText', title: 'Link Text', type: 'string' },
        { name: 'linkHref', title: 'Link URL', type: 'string' },
      ],
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials Section',
      type: 'object',
      fields: [
        { name: 'tag', title: 'Tag', type: 'string' },
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 },
        {
          name: 'items',
          title: 'Testimonials',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'quote', title: 'Quote', type: 'text', rows: 3 },
              { name: 'name', title: 'Name / Attribution', type: 'string' },
              { name: 'role', title: 'Role', type: 'string' },
            ],
          }],
        },
      ],
    }),
    defineField({
      name: 'community',
      title: 'Community Section',
      type: 'object',
      fields: [
        { name: 'tag', title: 'Tag', type: 'string' },
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'description', title: 'Description', type: 'text', rows: 3 },
        { name: 'subdescription', title: 'Sub-description', type: 'text', rows: 2 },
        { name: 'ctaText', title: 'Button Text', type: 'string' },
        { name: 'ctaHref', title: 'Button Link', type: 'string' },
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
