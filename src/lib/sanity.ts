import { createClient } from '@sanity/client'

const projectId = import.meta.env.SANITY_PROJECT_ID
if (!projectId) {
  throw new Error(
    'Missing SANITY_PROJECT_ID environment variable. ' +
    'Add it in your Cloudflare Pages dashboard under Settings → Environment variables.'
  )
}

export const sanityClient = createClient({
  projectId,
  dataset: import.meta.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // fetch fresh data at build time
})

// ── Page singletons ──────────────────────────────────────────────────────────

export async function getHomePage() {
  return sanityClient.fetch(`*[_type == "homePage"][0]`)
}

export async function getAboutPage() {
  return sanityClient.fetch(`*[_type == "aboutPage"][0]`)
}

export async function getSpeakingPage() {
  return sanityClient.fetch(`*[_type == "speakingPage"][0]`)
}

export async function getMediaPage() {
  return sanityClient.fetch(`*[_type == "mediaPage"][0]`)
}

export async function getResourcesPage() {
  return sanityClient.fetch(`*[_type == "resourcesPage"][0]`)
}

export async function getContactPage() {
  return sanityClient.fetch(`*[_type == "contactPage"][0]`)
}

export async function getConsultingPage() {
  return sanityClient.fetch(`*[_type == "consultingPage"][0]`)
}

export async function getDiabetesReversalPage() {
  return sanityClient.fetch(`
    *[_type == "diabetesReversalPage"][0] {
      ...,
      hero {
        ...,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt,
      }
    }
  `)
}

export async function getExecutiveMdPage() {
  return sanityClient.fetch(`*[_type == "executiveMdPage"][0]`)
}

// ── Articles ─────────────────────────────────────────────────────────────────

export async function getArticles() {
  return sanityClient.fetch(`
    *[_type == "article" && draft != true] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      description,
      publishedAt,
      tags,
      "image": image.asset->url,
      draft
    }
  `)
}

export async function getArticleSlugs() {
  return sanityClient.fetch<{ slug: string }[]>(`
    *[_type == "article" && draft != true] {
      "slug": slug.current
    }
  `)
}

export async function getArticleBySlug(slug: string) {
  return sanityClient.fetch(
    `*[_type == "article" && slug.current == $slug && draft != true][0] {
      _id,
      title,
      "slug": slug.current,
      description,
      publishedAt,
      tags,
      "image": image.asset->url,
      body
    }`,
    { slug },
  )
}

// ── Media appearances ────────────────────────────────────────────────────────

export async function getMediaItems() {
  return sanityClient.fetch(`
    *[_type == "mediaItem"] | order(date desc) {
      _id,
      title,
      type,
      source,
      date,
      href,
      embedId,
      "image": image.asset->url,
      featured
    }
  `)
}

// ── Calendar events ──────────────────────────────────────────────────────────

export async function getUpcomingEvents() {
  const now = new Date().toISOString()
  return sanityClient.fetch(
    `*[_type == "calendarEvent" && published == true && startDate >= $now] | order(startDate asc) {
      _id,
      title,
      eventType,
      startDate,
      endDate,
      location,
      description,
      registrationUrl
    }`,
    { now },
  )
}
