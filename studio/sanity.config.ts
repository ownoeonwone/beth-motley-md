import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import * as schemas from './schemas'

const singletonTypes = new Set([
  'homePage',
  'aboutPage',
  'speakingPage',
  'mediaPage',
  'resourcesPage',
  'contactPage',
  'consultingPage',
  'diabetesReversalPage',
  'executiveMdPage',
])

const singletonActions = new Set(['update', 'publish', 'unpublishAction'])

export default defineConfig({
  name: 'beth-motley-md',
  title: 'Beth Motley MD',

  projectId: '49pgcfbm',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Home Page')
              .id('homePage')
              .child(S.document().schemaType('homePage').documentId('homePage')),
            S.listItem()
              .title('About Page')
              .id('aboutPage')
              .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
            S.listItem()
              .title('Speaking Page')
              .id('speakingPage')
              .child(S.document().schemaType('speakingPage').documentId('speakingPage')),
            S.listItem()
              .title('Media Page')
              .id('mediaPage')
              .child(S.document().schemaType('mediaPage').documentId('mediaPage')),
            S.listItem()
              .title('Resources Page')
              .id('resourcesPage')
              .child(S.document().schemaType('resourcesPage').documentId('resourcesPage')),
            S.listItem()
              .title('Contact Page')
              .id('contactPage')
              .child(S.document().schemaType('contactPage').documentId('contactPage')),
            S.listItem()
              .title('Consulting Page')
              .id('consultingPage')
              .child(S.document().schemaType('consultingPage').documentId('consultingPage')),
            S.listItem()
              .title('Diabetes Reversal Program')
              .id('diabetesReversalPage')
              .child(
                S.document()
                  .schemaType('diabetesReversalPage')
                  .documentId('diabetesReversalPage'),
              ),
            S.listItem()
              .title('Executive MD Program')
              .id('executiveMdPage')
              .child(
                S.document().schemaType('executiveMdPage').documentId('executiveMdPage'),
              ),
            S.divider(),
            S.documentTypeListItem('article').title('Articles'),
            S.documentTypeListItem('mediaItem').title('Media Appearances'),
            S.documentTypeListItem('calendarEvent').title('Calendar & Events'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: Object.values(schemas),
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },

  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
})
