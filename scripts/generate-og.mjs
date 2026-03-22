import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const W = 1200;
const H = 630;

// 1. Resize headshot to fill right half
const headshotBuf = await sharp(join(root, 'public/images/headshots/beth-motley-hallway.png'))
  .resize(560, 630, { fit: 'cover', position: 'top' })
  .toBuffer();

// 2. Build a full-canvas SVG for background + text (no transparency tricks — we'll overlay the photo separately)
const bgSvg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f3d3e"/>
      <stop offset="100%" stop-color="#0a2e2f"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
</svg>`;

// 3. Overlay SVG: text + accents + fade (drawn on top of everything)
const textSvg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#0a2e2f" stop-opacity="1"/>
      <stop offset="52%"  stop-color="#0a2e2f" stop-opacity="1"/>
      <stop offset="72%"  stop-color="#0a2e2f" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#0a2e2f" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <!-- Fade so headshot bleeds through on right -->
  <rect width="${W}" height="${H}" fill="url(#fade)"/>
  <!-- Left accent bar -->
  <rect x="0" y="0" width="6" height="${H}" fill="#4caf96"/>
  <!-- Name -->
  <text x="72" y="188" font-family="Georgia, serif" font-size="64" font-weight="bold" fill="white">Beth Motley, MD</text>
  <!-- Credential -->
  <text x="72" y="236" font-family="Arial, sans-serif" font-size="21" fill="#4caf96" letter-spacing="2.5">FACLM · LIFESTYLE MEDICINE</text>
  <!-- Divider -->
  <rect x="72" y="268" width="60" height="4" rx="2" fill="#4caf96"/>
  <!-- Subhead lines -->
  <text x="72" y="322" font-family="Arial, sans-serif" font-size="27" fill="#d4ede8">Reversing Diabetes &amp; Chronic</text>
  <text x="72" y="360" font-family="Arial, sans-serif" font-size="27" fill="#d4ede8">Disease Through Evidence-Based</text>
  <text x="72" y="398" font-family="Arial, sans-serif" font-size="27" fill="#d4ede8">Lifestyle Medicine</text>
  <!-- Location pill -->
  <rect x="72" y="448" width="256" height="44" rx="22" fill="none" stroke="#4caf96" stroke-width="1.5"/>
  <text x="200" y="476" font-family="Arial, sans-serif" font-size="18" fill="#4caf96" text-anchor="middle">Greenville, SC</text>
  <!-- Domain watermark -->
  <text x="${W - 40}" y="${H - 26}" font-family="Arial, sans-serif" font-size="16" fill="white" fill-opacity="0.4" text-anchor="end">bethmotleymd.com</text>
</svg>`;

// 4. Render bg SVG → raw buffer → composite headshot → composite text overlay
const bgBuf = await sharp(Buffer.from(bgSvg))
  .resize(W, H)
  .toBuffer();

await sharp(bgBuf)
  .composite([
    // Photo on the right
    { input: headshotBuf, left: W - 560, top: 0 },
    // Text + fade overlay
    { input: Buffer.from(textSvg), left: 0, top: 0 },
  ])
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(join(root, 'public/images/og-default.jpg'));

const { size } = await import('fs').then(fs => fs.promises.stat(join(root, 'public/images/og-default.jpg')));
console.log(`✅  og-default.jpg written — ${Math.round(size / 1024)} KB`);
