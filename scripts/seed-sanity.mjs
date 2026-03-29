/**
 * Seed script: migrate existing JSON page content and markdown articles/media
 * into your Sanity project.
 *
 * Usage:
 *   SANITY_PROJECT_ID=xxx SANITY_TOKEN=xxx node scripts/seed-sanity.mjs
 *
 * Requirements:
 *   npm install @sanity/client @sanity/uuid
 *
 * Run once after creating your Sanity project. Safe to re-run — it uses
 * createOrReplace so it won't duplicate documents.
 */

import { createClient } from '@sanity/client'
import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const projectId = process.env.SANITY_PROJECT_ID
const token = process.env.SANITY_TOKEN

if (!projectId || !token) {
  console.error('❌  Set SANITY_PROJECT_ID and SANITY_TOKEN env vars before running.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

// ── Helpers ──────────────────────────────────────────────────────────────────

let keyCounter = 0
function key() {
  return `seed-${++keyCounter}`
}

/** Add _key to every object in an array (required by Sanity) */
function addKeys(arr) {
  if (!Array.isArray(arr)) return arr
  return arr.map((item) => {
    if (typeof item !== 'object' || item === null) return item
    const withKey = { ...item, _key: key() }
    for (const [k, v] of Object.entries(withKey)) {
      if (Array.isArray(v)) withKey[k] = addKeys(v)
    }
    return withKey
  })
}

/** Recursively add _key to all nested arrays */
function prepareDoc(obj) {
  if (typeof obj !== 'object' || obj === null) return obj
  const out = { ...obj }
  for (const [k, v] of Object.entries(out)) {
    if (Array.isArray(v)) out[k] = addKeys(v)
    else if (typeof v === 'object' && v !== null) out[k] = prepareDoc(v)
  }
  return out
}

function readJson(relPath) {
  return JSON.parse(readFileSync(join(root, relPath), 'utf8'))
}

/**
 * Very basic markdown-to-portable-text converter.
 * Handles headings, bullet lists, paragraphs.
 * Good enough for seeding existing content; Beth will use the rich editor going forward.
 */
function markdownToPortableText(md) {
  const blocks = []
  const lines = md.trim().split('\n')
  let listItems = []

  function flushList() {
    if (listItems.length === 0) return
    for (const text of listItems) {
      blocks.push({
        _type: 'block',
        _key: key(),
        style: 'normal',
        listItem: 'bullet',
        level: 1,
        children: [{ _type: 'span', _key: key(), text, marks: [] }],
        markDefs: [],
      })
    }
    listItems = []
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) {
      flushList()
      continue
    }

    const h2 = line.match(/^## (.+)$/)
    const h3 = line.match(/^### (.+)$/)
    const h4 = line.match(/^#### (.+)$/)
    const bullet = line.match(/^[-*] (.+)$/)

    if (h2) {
      flushList()
      blocks.push({ _type: 'block', _key: key(), style: 'h2', children: [{ _type: 'span', _key: key(), text: h2[1], marks: [] }], markDefs: [] })
    } else if (h3) {
      flushList()
      blocks.push({ _type: 'block', _key: key(), style: 'h3', children: [{ _type: 'span', _key: key(), text: h3[1], marks: [] }], markDefs: [] })
    } else if (h4) {
      flushList()
      blocks.push({ _type: 'block', _key: key(), style: 'h4', children: [{ _type: 'span', _key: key(), text: h4[1], marks: [] }], markDefs: [] })
    } else if (bullet) {
      listItems.push(bullet[1])
    } else {
      flushList()
      // Convert inline markdown links [text](url) to link annotations
      const markDefs = []
      let text = line
      const children = []
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
      let last = 0
      let match
      while ((match = linkRegex.exec(line)) !== null) {
        if (match.index > last) {
          children.push({ _type: 'span', _key: key(), text: line.slice(last, match.index), marks: [] })
        }
        const linkKey = key()
        markDefs.push({ _type: 'link', _key: linkKey, href: match[2] })
        children.push({ _type: 'span', _key: key(), text: match[1], marks: [linkKey] })
        last = match.index + match[0].length
      }
      if (last < line.length) {
        children.push({ _type: 'span', _key: key(), text: line.slice(last), marks: [] })
      }
      if (children.length === 0) {
        children.push({ _type: 'span', _key: key(), text: line, marks: [] })
      }
      blocks.push({ _type: 'block', _key: key(), style: 'normal', children, markDefs })
    }
  }
  flushList()
  return blocks
}

/** Parse frontmatter from a markdown file */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/m)
  if (!match) return { data: {}, body: content }
  const data = {}
  for (const line of match[1].split('\n')) {
    const [k, ...rest] = line.split(':')
    if (!k) continue
    const val = rest.join(':').trim().replace(/^"(.*)"$/, '$1')
    if (val === 'true') data[k.trim()] = true
    else if (val === 'false') data[k.trim()] = false
    else if (val.startsWith('[') && val.endsWith(']')) {
      data[k.trim()] = val.slice(1, -1).split(',').map((s) => s.trim().replace(/^"(.*)"$/, '$1')).filter(Boolean)
    } else data[k.trim()] = val
  }
  return { data, body: match[2] }
}

// ── Seed page singletons ─────────────────────────────────────────────────────

async function seedSingleton(type, jsonPath) {
  console.log(`  Seeding ${type}...`)
  const raw = readJson(jsonPath)
  const doc = { _id: type, _type: type, ...prepareDoc(raw) }
  await client.createOrReplace(doc)
  console.log(`  ✓ ${type}`)
}

// ── Seed articles ────────────────────────────────────────────────────────────

async function seedArticles() {
  const dir = join(root, 'src/content/articles')
  let files
  try {
    files = readdirSync(dir).filter((f) => f.endsWith('.md'))
  } catch {
    console.log('  No articles directory found, skipping.')
    return
  }

  for (const file of files) {
    const content = readFileSync(join(dir, file), 'utf8')
    const { data, body } = parseFrontmatter(content)
    const slug = file.replace(/\.mdx?$/, '')
    console.log(`  Seeding article: ${slug}`)

    const doc = {
      _id: `article-${slug}`,
      _type: 'article',
      title: data.title,
      slug: { _type: 'slug', current: slug },
      description: data.description,
      publishedAt: data.date,
      tags: Array.isArray(data.tags) ? data.tags : [],
      draft: data.draft === true,
      body: markdownToPortableText(body),
    }
    await client.createOrReplace(doc)
    console.log(`  ✓ article: ${slug}`)
  }
}

// ── Seed media items from media.json allMedia.items ──────────────────────────

async function seedMediaItems() {
  const mediaPage = readJson('content/pages/media.json')
  const items = mediaPage?.allMedia?.items || []
  console.log(`  Seeding ${items.length} media items...`)

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const id = `media-item-${i}`
    const doc = {
      _id: id,
      _type: 'mediaItem',
      title: item.title,
      type: item.type,
      source: item.source || '',
      date: item.date || '',
      href: item.href,
      embedId: item.embedId || undefined,
      featured: item.featured || false,
      // Note: local image paths won't render via cdn.sanity.io
      // Upload images through the Studio after seeding
    }
    await client.createOrReplace(doc)
  }
  console.log(`  ✓ ${items.length} media items`)
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🌱 Seeding Sanity dataset...\n')

  console.log('📄 Page singletons:')
  await seedSingleton('homePage', 'content/pages/home.json')
  await seedSingleton('aboutPage', 'content/pages/about.json')
  await seedSingleton('speakingPage', 'content/pages/speaking.json')
  await seedSingleton('mediaPage', 'content/pages/media.json')
  await seedSingleton('resourcesPage', 'content/pages/resources.json')
  await seedSingleton('contactPage', 'content/pages/contact.json')
  await seedSingleton('consultingPage', 'content/pages/consulting.json')
  await seedSingleton('diabetesReversalPage', 'content/pages/diabetes-reversal.json')
  await seedSingleton('executiveMdPage', 'content/pages/executive-md.json')

  console.log('\n📝 Articles:')
  await seedArticles()

  console.log('\n🎙️  Media items:')
  await seedMediaItems()

  console.log('\n✅ Seed complete!\n')
  console.log('Next steps:')
  console.log('  1. Open your Studio and review the imported content')
  console.log('  2. Publish all singleton documents (click "Publish" in the Studio)')
  console.log('  3. Upload images via the Studio (local image paths need re-uploading)')
  console.log('  4. Set up a Cloudflare Pages deploy hook to rebuild on content changes\n')
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
