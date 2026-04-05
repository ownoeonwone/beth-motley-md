import { defineField, defineType } from 'sanity'

export const diabetesReversalPage = defineType({
  name: 'diabetesReversalPage',
  title: 'Diabetes Reversal Program Page',
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
        {
          name: 'image',
          title: 'Hero Image',
          type: 'image',
          description: 'Optional photo shown beside the headline (e.g. Dr. Motley with patients). Displays in a split layout on larger screens.',
          options: { hotspot: true },
          fields: [{ name: 'alt', title: 'Alt Text', type: 'string' }],
        },
      ],
    }),
    defineField({
      name: 'about',
      title: 'About This Program',
      type: 'object',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 },
        { name: 'intro', title: 'Intro Paragraph', type: 'text', rows: 4 },
        { name: 'body', title: 'Body Paragraph', type: 'text', rows: 4 },
        { name: 'groupVisitHeading', title: 'Group Visit Sub-heading', type: 'string' },
        {
          name: 'groupVisitParagraphs',
          title: 'Group Visit Paragraphs',
          type: 'array',
          of: [{ type: 'text' }],
        },
      ],
    }),
    defineField({
      name: 'whoIsThisFor',
      title: 'Who Is This For?',
      type: 'object',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 },
        {
          name: 'items',
          title: 'Patient Types',
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
      name: 'format',
      title: 'Program Format',
      type: 'object',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 },
        {
          name: 'stats',
          title: 'Stats (shown as cards)',
          description: 'e.g. "6 sessions", "75 min each", "10 patients"',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'value', title: 'Value', type: 'string', description: 'e.g. "6"' },
              { name: 'label', title: 'Label', type: 'string', description: 'e.g. "Sessions"' },
            ],
          }],
        },
        { name: 'description', title: 'Description', type: 'text', rows: 4 },
      ],
    }),
    defineField({
      name: 'schedule',
      title: 'Schedule',
      description: 'Update this section when new cohort dates are available.',
      type: 'object',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'string' },
        {
          name: 'dates',
          title: 'Next Cohort Dates',
          type: 'string',
          description: 'e.g. "Starting March 15, 2025" or "Next cohort dates pending"',
        },
        { name: 'classTimes', title: 'Class Times', type: 'string' },
      ],
    }),
    defineField({
      name: 'curriculum',
      title: 'Curriculum / Sessions',
      type: 'object',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 },
        {
          name: 'sessions',
          title: 'Sessions',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'session', title: 'Session Label (e.g. "SMA 1")', type: 'string' },
              { name: 'title', title: 'Session Title', type: 'string' },
            ],
          }],
        },
      ],
    }),
    defineField({
      name: 'eligibility',
      title: 'Eligibility',
      type: 'object',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'string' },
        { name: 'items', title: 'Requirements', type: 'array', of: [{ type: 'text' }] },
      ],
    }),
    defineField({
      name: 'billing',
      title: 'Billing',
      type: 'object',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'string' },
        { name: 'description', title: 'Description', type: 'text', rows: 3 },
      ],
    }),
    defineField({
      name: 'results',
      title: 'Research Results',
      type: 'object',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 },
        {
          name: 'stats',
          title: 'Statistics',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'value', title: 'Statistic Value', type: 'string' },
              { name: 'label', title: 'Label', type: 'string' },
              { name: 'description', title: 'Description', type: 'text', rows: 3 },
            ],
          }],
        },
      ],
    }),
    defineField({
      name: 'video',
      title: 'Video Section',
      type: 'object',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 },
        { name: 'embedId', title: 'YouTube Video ID', type: 'string' },
        { name: 'caption', title: 'Caption', type: 'string' },
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
