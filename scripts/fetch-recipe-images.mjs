/**
 * fetch-recipe-images.mjs
 *
 * Fetches the ACTUAL recipe hero image for every recipe in the bank.
 * Priority: JSON-LD Recipe schema `image` > og:image > twitter:image.
 *
 * For collection pages (PCRM), uses a specific representative recipe URL
 * so each collection gets a distinct, relevant photo.
 *
 * Downloads and resizes each image to a performant card thumbnail (640×400 WebP),
 * and writes them to public/images/recipes/<slug>.webp.
 *
 * Usage:
 *   node scripts/fetch-recipe-images.mjs           # skip existing
 *   node scripts/fetch-recipe-images.mjs --force    # re-download all
 */

import { writeFile, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const FORCE = process.argv.includes('--force');

// ── Recipe list (keep in sync with recipes.astro) ────────────────────────────
// For PCRM collection entries, `href` points to a specific representative recipe
// page so we get a distinct, relevant photo for each collection.
const recipes = [
  // Breakfast
  { slug: 'overnight-oats', href: 'https://www.forksoverknives.com/recipes/vegan-breakfast/easy-overnight-chia-oatmeal/' },
  { slug: 'tofu-scramble', href: 'https://www.forksoverknives.com/recipes/vegan-breakfast/10-minute-tofu-scramble/' },
  { slug: 'banana-oat-pancakes', href: 'https://minimalistbaker.com/1-bowl-vegan-banana-oat-pancakes/' },
  { slug: 'pcrm-breakfast', href: 'https://www.pcrm.org/good-nutrition/plant-based-diets/recipes/chia-breakfast-parfait' },
  { slug: 'rpl-breakfast-cookies', href: 'https://rainbowplantlife.com/healthy-vegan-breakfast-cookies/' },
  { slug: 'savory-oatmeal', href: 'https://ohsheglows.com/loaded-lunchtime-oatmeal/' },
  // Lunch
  { slug: 'chickpea-noodle-soup', href: 'https://www.forksoverknives.com/recipes/vegan-soups-stews/30-minute-chickpea-noodle-soup-spinach/' },
  { slug: 'lentil-vegetable-soup', href: 'https://www.forksoverknives.com/recipes/vegan-soups-stews/lentil-vegetable-soup/' },
  { slug: 'roasted-buddha-bowl', href: 'https://ohsheglows.com/roasted-buddha-bowl/' },
  { slug: 'pcrm-lunch', href: 'https://www.pcrm.org/good-nutrition/plant-based-diets/recipes/rainbow-hummus-sandwich' },
  { slug: 'green-salad-lemon', href: 'https://minimalistbaker.com/simple-green-salad-with-lemon-vinaigrette/' },
  { slug: 'rpl-white-bean-soup', href: 'https://rainbowplantlife.com/creamy-white-bean-soup-with-kale-and-gremolata/' },
  // Dinner
  { slug: 'lentil-bolognese', href: 'https://www.forksoverknives.com/recipes/vegan-pasta-noodles/budget-friendly-lentil-bolognese/' },
  { slug: 'vegan-caesar-salad', href: 'https://ohsheglows.com/crowd-pleasing-vegan-caesar-salad/' },
  { slug: 'red-lentil-curry-mb', href: 'https://minimalistbaker.com/spicy-red-lentil-curry/' },
  { slug: 'pcrm-dinner', href: 'https://www.pcrm.org/good-nutrition/plant-based-diets/recipes/vegetable-lo-mein' },
  { slug: 'rpl-red-lentil-curry', href: 'https://rainbowplantlife.com/vegan-red-lentil-curry/' },
  { slug: 'butternut-squash-soup', href: 'https://www.thefullhelping.com/creamy-butternut-squash-five-spice-soup/' },
  // Snacks
  { slug: 'rpl-white-bean-dip', href: 'https://rainbowplantlife.com/lemony-white-bean-dip/' },
  { slug: 'energy-bites', href: 'https://minimalistbaker.com/5-ingredient-no-bake-cookie-energy-bites/' },
  { slug: 'fok-snacks', href: 'https://www.forksoverknives.com/recipes/vegan-snacks-appetizers/' },
  { slug: 'crispy-chickpeas', href: 'https://minimalistbaker.com/actually-crispy-baked-chickpeas/' },
  { slug: 'pcrm-snacks', href: 'https://www.pcrm.org/good-nutrition/plant-based-diets/recipes/banana-bread' },
];

const OUT_DIR = path.resolve('public/images/recipes');
const WIDTH = 640;
const HEIGHT = 400;

/**
 * Extract the best recipe image URL from the page HTML.
 * Priority: JSON-LD Recipe schema > og:image > twitter:image
 */
function extractImageUrl(html, pageUrl) {
  // 1. Try JSON-LD Recipe schema (most reliable — always the actual dish photo)
  const jsonLdBlocks = html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  for (const match of jsonLdBlocks) {
    try {
      let data = JSON.parse(match[1]);
      // Handle @graph wrapper
      if (data['@graph']) data = data['@graph'];
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        if (item['@type'] === 'Recipe' || (Array.isArray(item['@type']) && item['@type'].includes('Recipe'))) {
          const img = item.image;
          if (img) {
            if (typeof img === 'string') return img;
            if (Array.isArray(img)) return typeof img[0] === 'string' ? img[0] : img[0]?.url;
            if (img.url) return img.url;
          }
        }
      }
    } catch { /* skip malformed JSON-LD */ }
  }

  // 2. Try og:image
  const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (ogMatch) return ogMatch[1];

  // 3. Try twitter:image
  const twMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
  if (twMatch) return twMatch[1];

  throw new Error(`No recipe image found for ${pageUrl}`);
}

async function fetchRecipeImage(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
    },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`${res.status} fetching ${url}`);
  const html = await res.text();
  return extractImageUrl(html, url);
}

async function downloadAndResize(imageUrl, slug) {
  // Handle protocol-relative URLs
  if (imageUrl.startsWith('//')) imageUrl = 'https:' + imageUrl;

  const res = await fetch(imageUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'image/*',
    },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`${res.status} downloading image ${imageUrl}`);

  const buffer = Buffer.from(await res.arrayBuffer());
  const optimized = await sharp(buffer)
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'center' })
    .webp({ quality: 75 })
    .toBuffer();

  const outPath = path.join(OUT_DIR, `${slug}.webp`);
  await writeFile(outPath, optimized);
  console.log(`  ✓ ${slug}.webp (${(optimized.length / 1024).toFixed(1)} KB)`);
}

async function main() {
  if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true });

  if (FORCE) {
    console.log('--force: deleting existing .webp files…');
    for (const { slug } of recipes) {
      const p = path.join(OUT_DIR, `${slug}.webp`);
      if (existsSync(p)) await rm(p);
    }
    console.log();
  }

  console.log(`Fetching recipe images for ${recipes.length} recipes…\n`);

  let success = 0;
  let failed = 0;

  for (const { slug, href } of recipes) {
    const outPath = path.join(OUT_DIR, `${slug}.webp`);
    if (!FORCE && existsSync(outPath)) {
      console.log(`  ⏭ ${slug}.webp already exists, skipping`);
      success++;
      continue;
    }
    try {
      const imgUrl = await fetchRecipeImage(href);
      await downloadAndResize(imgUrl, slug);
      success++;
    } catch (err) {
      console.error(`  ✗ ${slug}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone: ${success} succeeded, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

main();
