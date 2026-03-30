/**
 * fetch-recipe-images.mjs
 *
 * Fetches the og:image for every recipe URL in the recipe bank,
 * downloads and resizes each image to a performant card thumbnail (640×400 WebP),
 * and writes them to public/images/recipes/<slug>.webp.
 *
 * Usage:  node scripts/fetch-recipe-images.mjs
 *
 * This script is meant to be run locally (or in CI) where there are no
 * proxy restrictions. It only needs to be re-run when recipe URLs change.
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

// ── Recipe list (keep in sync with recipes.astro) ─────────────────────────────
const recipes = [
  // Breakfast
  { slug: 'overnight-oats', href: 'https://www.forksoverknives.com/recipes/vegan-breakfast/easy-overnight-chia-oatmeal/' },
  { slug: 'tofu-scramble', href: 'https://www.forksoverknives.com/recipes/vegan-breakfast/10-minute-tofu-scramble/' },
  { slug: 'banana-oat-pancakes', href: 'https://minimalistbaker.com/1-bowl-vegan-banana-oat-pancakes/' },
  { slug: 'pcrm-breakfast', href: 'https://www.pcrm.org/good-nutrition/plant-based-diets/recipes' },
  { slug: 'rpl-breakfast-cookies', href: 'https://rainbowplantlife.com/healthy-vegan-breakfast-cookies/' },
  { slug: 'savory-oatmeal', href: 'https://ohsheglows.com/loaded-lunchtime-oatmeal/' },
  // Lunch
  { slug: 'chickpea-noodle-soup', href: 'https://www.forksoverknives.com/recipes/30-minute-chickpea-noodle-soup-spinach/' },
  { slug: 'lentil-vegetable-soup', href: 'https://www.forksoverknives.com/recipes/vegan-soups-stews/lentil-vegetable-soup/' },
  { slug: 'roasted-buddha-bowl', href: 'https://ohsheglows.com/roasted-buddha-bowl/' },
  { slug: 'pcrm-lunch', href: 'https://www.pcrm.org/good-nutrition/plant-based-diets/recipes' },
  { slug: 'green-salad-lemon', href: 'https://minimalistbaker.com/simple-green-salad-with-lemon-vinaigrette/' },
  { slug: 'rpl-white-bean-soup', href: 'https://rainbowplantlife.com/creamy-white-bean-soup-with-kale-and-gremolata/' },
  // Dinner
  { slug: 'lentil-bolognese', href: 'https://www.forksoverknives.com/recipes/vegan-pasta-noodles/budget-friendly-lentil-bolognese/' },
  { slug: 'vegan-caesar-salad', href: 'https://ohsheglows.com/crowd-pleasing-vegan-caesar-salad/' },
  { slug: 'red-lentil-curry-mb', href: 'https://minimalistbaker.com/spicy-red-lentil-curry/' },
  { slug: 'pcrm-dinner', href: 'https://www.pcrm.org/good-nutrition/plant-based-diets/recipes' },
  { slug: 'rpl-red-lentil-curry', href: 'https://rainbowplantlife.com/vegan-red-lentil-curry/' },
  { slug: 'butternut-squash-soup', href: 'https://www.thefullhelping.com/creamy-butternut-squash-five-spice-soup/' },
  // Snacks
  { slug: 'rpl-white-bean-dip', href: 'https://rainbowplantlife.com/lemony-white-bean-dip/' },
  { slug: 'energy-bites', href: 'https://minimalistbaker.com/5-ingredient-no-bake-cookie-energy-bites/' },
  { slug: 'fok-snacks', href: 'https://www.forksoverknives.com/recipes/vegan-snacks-appetizers/' },
  { slug: 'crispy-chickpeas', href: 'https://minimalistbaker.com/actually-crispy-baked-chickpeas/' },
  { slug: 'pcrm-snacks', href: 'https://www.pcrm.org/good-nutrition/plant-based-diets/recipes' },
];

const OUT_DIR = path.resolve('public/images/recipes');
const WIDTH = 640;
const HEIGHT = 400;

async function fetchOgImage(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BethMotleyMD-ImageBot/1.0)' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`${res.status} fetching ${url}`);
  const html = await res.text();

  // Try og:image first, then twitter:image
  const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (ogMatch) return ogMatch[1];

  const twMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
  if (twMatch) return twMatch[1];

  throw new Error(`No og:image found for ${url}`);
}

async function downloadAndResize(imageUrl, slug) {
  const res = await fetch(imageUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BethMotleyMD-ImageBot/1.0)' },
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
  console.log(`Fetching og:images for ${recipes.length} recipes…\n`);

  let success = 0;
  let failed = 0;

  for (const { slug, href } of recipes) {
    const outPath = path.join(OUT_DIR, `${slug}.webp`);
    if (existsSync(outPath)) {
      console.log(`  ⏭ ${slug}.webp already exists, skipping`);
      success++;
      continue;
    }
    try {
      const ogUrl = await fetchOgImage(href);
      await downloadAndResize(ogUrl, slug);
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
