import { defineField, defineType } from 'sanity'

export const calendarEvent = defineType({
  name: 'calendarEvent',
  title: 'Calendar & Events',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Event Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eventType',
      title: 'Event Type',
      type: 'string',
      options: {
        list: [
          { title: 'Diabetes Reversal Cohort', value: 'diabetes-cohort' },
          { title: 'Speaking Engagement', value: 'speaking' },
          { title: 'Workshop / CME', value: 'workshop' },
          { title: 'Announcement', value: 'announcement' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date (optional)',
      type: 'datetime',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g. "Greenville, SC" or "Virtual / Zoom"',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'registrationUrl',
      title: 'Registration / Info Link',
      type: 'url',
    }),
    defineField({
      name: 'published',
      title: 'Published (visible on site)',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'startDate' },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle
          ? new Date(subtitle).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : 'No date set',
      }
    },
  },
  orderings: [
    {
      title: 'Upcoming First',
      name: 'startDateAsc',
      by: [{ field: 'startDate', direction: 'asc' }],
    },
  ],
})
