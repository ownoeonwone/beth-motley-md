import { defineConfig } from "tinacms";

// ------------------------------------------------------------
// Reusable field snippets
// ------------------------------------------------------------
const seoFields = [
  {
    type: "object" as const,
    name: "seo",
    label: "SEO",
    fields: [
      { type: "string" as const, name: "title", label: "Page Title", required: true },
      {
        type: "string" as const,
        name: "description",
        label: "Meta Description",
        required: true,
        ui: { component: "textarea" },
      },
    ],
  },
];

const faqField = {
  type: "object" as const,
  name: "faq",
  label: "FAQ",
  fields: [
    { type: "string" as const, name: "title", label: "Section Title" },
    { type: "string" as const, name: "subtitle", label: "Section Subtitle" },
    {
      type: "object" as const,
      name: "items",
      label: "Questions",
      list: true,
      fields: [
        { type: "string" as const, name: "question", label: "Question", required: true },
        {
          type: "string" as const,
          name: "answer",
          label: "Answer",
          required: true,
          ui: { component: "textarea" },
        },
      ],
    },
  ],
};

// ------------------------------------------------------------
// Config
// ------------------------------------------------------------
export default defineConfig({
  branch:
    process.env.GITHUB_BRANCH ||
    process.env.CF_PAGES_BRANCH ||
    process.env.VERCEL_GIT_COMMIT_REF ||
    process.env.HEAD ||
    "main",

  // Your TinaCloud client ID — set this after connecting to TinaCloud
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      // ========================================================
      // ARTICLES (blog)
      // ========================================================
      {
        name: "articles",
        label: "Articles",
        path: "src/content/articles",
        format: "md",
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          {
            type: "string",
            name: "description",
            label: "Description",
            required: true,
            ui: { component: "textarea" },
          },
          { type: "datetime", name: "date", label: "Publish Date", required: true },
          { type: "image", name: "image", label: "Featured Image" },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true,
          },
          { type: "boolean", name: "draft", label: "Draft" },
          { type: "rich-text", name: "body", label: "Body", isBody: true },
        ],
      },

      // ========================================================
      // MEDIA APPEARANCES
      // ========================================================
      {
        name: "media",
        label: "Media Appearances",
        path: "src/content/media",
        format: "md",
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          {
            type: "string",
            name: "type",
            label: "Type",
            required: true,
            options: ["podcast", "video", "article", "press"],
          },
          { type: "string", name: "source", label: "Source", required: true },
          { type: "datetime", name: "date", label: "Date", required: true },
          { type: "string", name: "href", label: "Link URL", required: true },
          { type: "string", name: "embedId", label: "YouTube Embed ID" },
          { type: "image", name: "image", label: "Thumbnail Image" },
          { type: "boolean", name: "featured", label: "Featured" },
          { type: "rich-text", name: "body", label: "Body", isBody: true },
        ],
      },

      // ========================================================
      // HOME PAGE
      // ========================================================
      {
        name: "home",
        label: "Home Page",
        path: "content/pages",
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        match: { include: "home" },
        fields: [
          ...seoFields,
          {
            type: "object",
            name: "hero",
            label: "Hero Section",
            fields: [
              { type: "string", name: "badge", label: "Badge Text" },
              { type: "string", name: "headline", label: "Headline", required: true },
              {
                type: "string",
                name: "subheadline",
                label: "Subheadline",
                ui: { component: "textarea" },
              },
              {
                type: "object",
                name: "primaryCta",
                label: "Primary Button",
                fields: [
                  { type: "string", name: "text", label: "Button Text" },
                  { type: "string", name: "href", label: "Button Link" },
                ],
              },
              {
                type: "object",
                name: "secondaryCta",
                label: "Secondary Button",
                fields: [
                  { type: "string", name: "text", label: "Button Text" },
                  { type: "string", name: "href", label: "Button Link" },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "doctorIntro",
            label: "Doctor Intro",
            fields: [
              { type: "image", name: "image", label: "Photo" },
              { type: "string", name: "imageAlt", label: "Photo Alt Text" },
              { type: "string", name: "name", label: "Name" },
              { type: "string", name: "bio", label: "Bio", ui: { component: "textarea" } },
              { type: "string", name: "linkText", label: "Link Text" },
              { type: "string", name: "linkHref", label: "Link URL" },
            ],
          },
          {
            type: "object",
            name: "lifestyleMedicine",
            label: "What Is Lifestyle Medicine?",
            fields: [
              { type: "string", name: "tag", label: "Tag" },
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "subtitle", label: "Subtitle", ui: { component: "textarea" } },
              {
                type: "object",
                name: "pillars",
                label: "Pillars",
                list: true,
                fields: [
                  { type: "string", name: "title", label: "Title", required: true },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "programs",
            label: "Programs Section",
            fields: [
              { type: "string", name: "tag", label: "Tag" },
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "subtitle", label: "Subtitle", ui: { component: "textarea" } },
              {
                type: "object",
                name: "items",
                label: "Programs",
                list: true,
                fields: [
                  { type: "string", name: "title", label: "Title", required: true },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  { type: "string", name: "href", label: "Link" },
                  { type: "string", name: "icon", label: "Icon (heart or star)" },
                  { type: "string", name: "features", label: "Features", list: true },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "aboutPreview",
            label: "About Preview",
            fields: [
              { type: "string", name: "tag", label: "Tag" },
              { type: "string", name: "headline", label: "Headline" },
              { type: "image", name: "image", label: "Photo" },
              { type: "string", name: "imageAlt", label: "Photo Alt Text" },
              { type: "string", name: "paragraphs", label: "Paragraphs", list: true, ui: { component: "textarea" } },
              { type: "string", name: "badges", label: "Badges", list: true },
              { type: "string", name: "linkText", label: "Link Text" },
              { type: "string", name: "linkHref", label: "Link URL" },
            ],
          },
          {
            type: "object",
            name: "testimonials",
            label: "Testimonials",
            fields: [
              { type: "string", name: "tag", label: "Tag" },
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "subtitle", label: "Subtitle" },
              {
                type: "object",
                name: "items",
                label: "Testimonials",
                list: true,
                fields: [
                  { type: "string", name: "quote", label: "Quote", required: true, ui: { component: "textarea" } },
                  { type: "string", name: "name", label: "Name" },
                  { type: "string", name: "role", label: "Role" },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "community",
            label: "Community Section",
            fields: [
              { type: "string", name: "tag", label: "Tag" },
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
              { type: "string", name: "subdescription", label: "Sub-description", ui: { component: "textarea" } },
              { type: "string", name: "ctaText", label: "Button Text" },
              { type: "string", name: "ctaHref", label: "Button Link" },
            ],
          },
          {
            type: "object",
            name: "newsletter",
            label: "Newsletter Section",
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
            ],
          },
        ],
      },

      // ========================================================
      // ABOUT PAGE
      // ========================================================
      {
        name: "about",
        label: "About Page",
        path: "content/pages",
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        match: { include: "about" },
        fields: [
          ...seoFields,
          {
            type: "object",
            name: "hero",
            label: "Hero",
            fields: [
              { type: "string", name: "badge", label: "Badge" },
              { type: "string", name: "headline", label: "Headline" },
              { type: "string", name: "subheadline", label: "Subheadline", ui: { component: "textarea" } },
            ],
          },
          {
            type: "object",
            name: "story",
            label: "Story Section",
            fields: [
              { type: "image", name: "image", label: "Photo" },
              { type: "string", name: "imageAlt", label: "Photo Alt Text" },
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "paragraphs", label: "Paragraphs", list: true, ui: { component: "textarea" } },
            ],
          },
          {
            type: "object",
            name: "credentials",
            label: "Credentials",
            fields: [
              { type: "string", name: "tag", label: "Tag" },
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "subtitle", label: "Subtitle" },
              {
                type: "object",
                name: "timeline",
                label: "Timeline",
                list: true,
                fields: [
                  { type: "string", name: "years", label: "Years" },
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "institution", label: "Institution" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "approach",
            label: "Approach",
            fields: [
              { type: "string", name: "tag", label: "Tag" },
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "subtitle", label: "Subtitle" },
              {
                type: "object",
                name: "items",
                label: "Approaches",
                list: true,
                fields: [
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "cta",
            label: "Call to Action",
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
              {
                type: "object",
                name: "links",
                label: "Links",
                list: true,
                fields: [
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "description", label: "Description" },
                  { type: "string", name: "href", label: "URL" },
                ],
              },
            ],
          },
        ],
      },

      // ========================================================
      // SPEAKING PAGE
      // ========================================================
      {
        name: "speaking",
        label: "Speaking Page",
        path: "content/pages",
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        match: { include: "speaking" },
        fields: [
          ...seoFields,
          {
            type: "object",
            name: "hero",
            label: "Hero",
            fields: [
              { type: "string", name: "badge", label: "Badge" },
              { type: "string", name: "headline", label: "Headline" },
              { type: "string", name: "subheadline", label: "Subheadline", ui: { component: "textarea" } },
              { type: "string", name: "ctaText", label: "Button Text" },
              { type: "string", name: "ctaHref", label: "Button Link" },
            ],
          },
          {
            type: "object",
            name: "keynoteHighlight",
            label: "Keynote Highlight",
            fields: [
              { type: "image", name: "image", label: "Photo" },
              { type: "string", name: "imageAlt", label: "Photo Alt Text" },
              { type: "string", name: "tag", label: "Tag" },
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "location", label: "Location" },
              { type: "string", name: "talkTitle", label: "Talk Title" },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
            ],
          },
          {
            type: "object",
            name: "topics",
            label: "Speaking Topics",
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "subtitle", label: "Subtitle" },
              { type: "string", name: "intro", label: "Intro Text" },
              { type: "string", name: "items", label: "Topics", list: true },
            ],
          },
          {
            type: "object",
            name: "audiences",
            label: "Audiences",
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "subtitle", label: "Subtitle" },
              { type: "string", name: "items", label: "Audience Types", list: true },
            ],
          },
          {
            type: "object",
            name: "testimonials",
            label: "Testimonials",
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "subtitle", label: "Subtitle" },
              {
                type: "object",
                name: "headlineQuotes",
                label: "Headline Quotes",
                list: true,
                fields: [
                  { type: "string", name: "text", label: "Quote Text" },
                  { type: "string", name: "note", label: "Note (optional)" },
                ],
              },
              {
                type: "object",
                name: "items",
                label: "Testimonials",
                list: true,
                fields: [
                  { type: "string", name: "quote", label: "Quote", ui: { component: "textarea" } },
                  { type: "string", name: "name", label: "Name" },
                  { type: "string", name: "role", label: "Role" },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "videos",
            label: "Videos",
            fields: [
              { type: "string", name: "title", label: "Section Title" },
              { type: "string", name: "subtitle", label: "Section Subtitle" },
              {
                type: "object",
                name: "primary",
                label: "Primary Video",
                fields: [
                  { type: "string", name: "embedId", label: "YouTube Embed ID" },
                  { type: "string", name: "title", label: "Video Title" },
                  { type: "string", name: "caption", label: "Caption" },
                ],
              },
              {
                type: "object",
                name: "secondary",
                label: "Secondary Videos",
                list: true,
                fields: [
                  { type: "string", name: "embedId", label: "YouTube Embed ID" },
                  { type: "string", name: "title", label: "Video Title" },
                  { type: "string", name: "caption", label: "Caption" },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "bookingForm",
            label: "Booking Form",
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "subtitle", label: "Subtitle", ui: { component: "textarea" } },
            ],
          },
        ],
      },

      // ========================================================
      // CONSULTING PAGE
      // ========================================================
      {
        name: "consulting",
        label: "Consulting Page",
        path: "content/pages",
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        match: { include: "consulting" },
        fields: [
          ...seoFields,
          {
            type: "object",
            name: "hero",
            label: "Hero",
            fields: [
              { type: "string", name: "badge", label: "Badge" },
              { type: "string", name: "headline", label: "Headline" },
              { type: "string", name: "subheadline", label: "Subheadline", ui: { component: "textarea" } },
              { type: "string", name: "ctaText", label: "Button Text" },
              { type: "string", name: "ctaHref", label: "Button Link" },
            ],
          },
          {
            type: "object",
            name: "whoIHelp",
            label: "Who I Help",
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "subtitle", label: "Subtitle" },
              {
                type: "object",
                name: "items",
                label: "Items",
                list: true,
                fields: [
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "whatIOffer",
            label: "What I Offer",
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "subtitle", label: "Subtitle" },
              {
                type: "object",
                name: "items",
                label: "Services",
                list: true,
                fields: [
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "howItWorks",
            label: "How It Works",
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "subtitle", label: "Subtitle" },
              {
                type: "object",
                name: "steps",
                label: "Steps",
                list: true,
                fields: [
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "providerTools",
            label: "Provider Tools",
            fields: [
              { type: "string", name: "tag", label: "Tag" },
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "subtitle", label: "Subtitle" },
              {
                type: "object",
                name: "items",
                label: "Tools",
                list: true,
                fields: [
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  { type: "string", name: "href", label: "Link URL" },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "contactForm",
            label: "Contact Form",
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "subtitle", label: "Subtitle", ui: { component: "textarea" } },
              { type: "string", name: "note", label: "Note" },
            ],
          },
        ],
      },

      // ========================================================
      // DIABETES REVERSAL PAGE
      // ========================================================
      {
        name: "diabetesReversal",
        label: "Diabetes Reversal Page",
        path: "content/pages",
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        match: { include: "diabetes-reversal" },
        fields: [
          ...seoFields,
          {
            type: "object",
            name: "hero",
            label: "Hero",
            fields: [
              { type: "string", name: "badge", label: "Badge" },
              { type: "string", name: "headline", label: "Headline" },
              { type: "string", name: "subheadline", label: "Subheadline", ui: { component: "textarea" } },
            ],
          },
          {
            type: "object",
            name: "about",
            label: "About This Program",
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "subtitle", label: "Subtitle" },
              { type: "string", name: "intro", label: "Intro", ui: { component: "textarea" } },
              { type: "string", name: "body", label: "Body", ui: { component: "textarea" } },
            ],
          },
          {
            type: "object",
            name: "whoIsThisFor",
            label: "Who Is This For?",
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "subtitle", label: "Subtitle" },
              {
                type: "object",
                name: "items",
                label: "Items",
                list: true,
                fields: [
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "format",
            label: "Program Format",
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "subtitle", label: "Subtitle" },
              {
                type: "object",
                name: "stats",
                label: "Stats",
                list: true,
                fields: [
                  { type: "string", name: "value", label: "Value" },
                  { type: "string", name: "label", label: "Label" },
                ],
              },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
            ],
          },
          {
            type: "object",
            name: "schedule",
            label: "Schedule",
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "subtitle", label: "Subtitle" },
              { type: "string", name: "dates", label: "Dates" },
              { type: "string", name: "classTimes", label: "Class Times" },
            ],
          },
          {
            type: "object",
            name: "curriculum",
            label: "Curriculum",
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "subtitle", label: "Subtitle" },
              {
                type: "object",
                name: "sessions",
                label: "Sessions",
                list: true,
                fields: [
                  { type: "string", name: "session", label: "Session Label" },
                  { type: "string", name: "title", label: "Session Title" },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "eligibility",
            label: "Eligibility",
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "subtitle", label: "Subtitle" },
              { type: "string", name: "items", label: "Requirements", list: true },
            ],
          },
          {
            type: "object",
            name: "billing",
            label: "Billing",
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "subtitle", label: "Subtitle" },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
            ],
          },
          {
            type: "object",
            name: "results",
            label: "Results",
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "subtitle", label: "Subtitle", ui: { component: "textarea" } },
              {
                type: "object",
                name: "stats",
                label: "Stats",
                list: true,
                fields: [
                  { type: "string", name: "value", label: "Value" },
                  { type: "string", name: "label", label: "Label" },
                ],
              },
              { type: "string", name: "disclaimer", label: "Disclaimer", ui: { component: "textarea" } },
            ],
          },
          {
            type: "object",
            name: "video",
            label: "Featured Video",
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "subtitle", label: "Subtitle" },
              { type: "string", name: "embedId", label: "YouTube Embed ID" },
            ],
          },
          faqField,
          {
            type: "object",
            name: "ctaForm",
            label: "CTA Form",
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "subtitle", label: "Subtitle", ui: { component: "textarea" } },
              { type: "string", name: "note", label: "Note" },
            ],
          },
        ],
      },

      // ========================================================
      // EXECUTIVE MD PAGE
      // ========================================================
      {
        name: "executiveMd",
        label: "Executive MD Page",
        path: "content/pages",
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        match: { include: "executive-md" },
        fields: [
          ...seoFields,
          {
            type: "object",
            name: "hero",
            label: "Hero",
            fields: [
              { type: "string", name: "badge", label: "Badge" },
              { type: "string", name: "headline", label: "Headline" },
              { type: "string", name: "subheadline", label: "Subheadline", ui: { component: "textarea" } },
              { type: "string", name: "note", label: "Note" },
            ],
          },
          {
            type: "object",
            name: "problem",
            label: "The Problem",
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "intro", label: "Intro", ui: { component: "textarea" } },
              { type: "string", name: "body", label: "Body", ui: { component: "textarea" } },
            ],
          },
          {
            type: "object",
            name: "included",
            label: "What's Included",
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "subtitle", label: "Subtitle" },
              {
                type: "object",
                name: "items",
                label: "Items",
                list: true,
                fields: [
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "whoThisIsFor",
            label: "Who This Is For",
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "subtitle", label: "Subtitle" },
              { type: "string", name: "paragraphs", label: "Paragraphs", list: true, ui: { component: "textarea" } },
            ],
          },
          faqField,
          {
            type: "object",
            name: "ctaForm",
            label: "CTA Form",
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "subtitle", label: "Subtitle", ui: { component: "textarea" } },
            ],
          },
        ],
      },

      // ========================================================
      // CONTACT PAGE
      // ========================================================
      {
        name: "contact",
        label: "Contact Page",
        path: "content/pages",
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        match: { include: "contact" },
        fields: [
          ...seoFields,
          {
            type: "object",
            name: "hero",
            label: "Hero",
            fields: [
              { type: "string", name: "badge", label: "Badge" },
              { type: "string", name: "headline", label: "Headline" },
              { type: "string", name: "subheadline", label: "Subheadline", ui: { component: "textarea" } },
            ],
          },
          {
            type: "object",
            name: "form",
            label: "Form Section",
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "subtitle", label: "Subtitle" },
            ],
          },
          {
            type: "object",
            name: "location",
            label: "Location",
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "name", label: "Location Name" },
              { type: "string", name: "detail", label: "Detail" },
            ],
          },
          {
            type: "object",
            name: "responseTime",
            label: "Response Time",
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "time", label: "Time" },
              { type: "string", name: "detail", label: "Detail", ui: { component: "textarea" } },
            ],
          },
          {
            type: "object",
            name: "social",
            label: "Social Links",
            fields: [
              { type: "string", name: "title", label: "Title" },
              {
                type: "object",
                name: "links",
                label: "Links",
                list: true,
                fields: [
                  { type: "string", name: "platform", label: "Platform" },
                  { type: "string", name: "href", label: "URL" },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "quickLinks",
            label: "Quick Links",
            fields: [
              { type: "string", name: "title", label: "Title" },
              {
                type: "object",
                name: "items",
                label: "Links",
                list: true,
                fields: [
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "description", label: "Description" },
                  { type: "string", name: "href", label: "URL" },
                ],
              },
            ],
          },
        ],
      },

      // ========================================================
      // MEDIA PAGE
      // ========================================================
      {
        name: "mediaPage",
        label: "Media Page",
        path: "content/pages",
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        match: { include: "media" },
        fields: [
          ...seoFields,
          {
            type: "object",
            name: "hero",
            label: "Hero",
            fields: [
              { type: "string", name: "badge", label: "Badge" },
              { type: "string", name: "headline", label: "Headline" },
              { type: "string", name: "subheadline", label: "Subheadline", ui: { component: "textarea" } },
              { type: "string", name: "ctaText", label: "Button Text" },
              { type: "string", name: "ctaHref", label: "Button Link" },
            ],
          },
          {
            type: "object",
            name: "featuredLogos",
            label: "Featured In Logos",
            list: true,
            fields: [
              { type: "image", name: "src", label: "Logo Image" },
              { type: "string", name: "alt", label: "Alt Text" },
            ],
          },
          {
            type: "object",
            name: "pressHighlight",
            label: "Press Highlight",
            fields: [
              { type: "string", name: "tag", label: "Tag" },
              { type: "image", name: "image", label: "Image" },
              { type: "string", name: "imageAlt", label: "Image Alt" },
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "pullQuote", label: "Pull Quote", ui: { component: "textarea" } },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
              { type: "string", name: "linkText", label: "Link Text" },
              { type: "string", name: "linkHref", label: "Link URL" },
            ],
          },
          {
            type: "object",
            name: "allMedia",
            label: "All Media",
            fields: [
              { type: "string", name: "title", label: "Section Title" },
              { type: "string", name: "subtitle", label: "Section Subtitle" },
              {
                type: "object",
                name: "items",
                label: "Media Items",
                list: true,
                fields: [
                  { type: "string", name: "title", label: "Title", required: true },
                  {
                    type: "string",
                    name: "type",
                    label: "Type",
                    required: true,
                    options: ["podcast", "video", "article", "press"],
                  },
                  { type: "string", name: "source", label: "Source" },
                  { type: "string", name: "date", label: "Date" },
                  { type: "string", name: "href", label: "Link URL" },
                  { type: "string", name: "embedId", label: "YouTube Embed ID" },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "podcastCta",
            label: "Podcast CTA",
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "subtitle", label: "Subtitle", ui: { component: "textarea" } },
              { type: "string", name: "ctaText", label: "Button Text" },
              { type: "string", name: "ctaHref", label: "Button Link" },
            ],
          },
        ],
      },
    ],
  },
});
