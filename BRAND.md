# Beth Motley, MD — Brand Guidelines

## Brand Identity

**Positioning**: Dr. Beth Motley is a leading authority in Lifestyle Medicine and Diabetes Reversal — a board-certified physician who uses evidence-based lifestyle interventions to prevent, treat, and reverse chronic disease.

**Tagline options**:
- "Lifestyle Medicine. Evidence-Based. Life-Changing."
- "Reverse Disease. Restore Health. Reclaim Your Life."

---

## Logo

The logo features a stylized plant/leaf motif enclosed in a circle, representing growth, vitality, and the natural approach to health. The typography uses a classic serif for "Beth Motley, MD" with a clean sans-serif "LIFESTYLE MEDICINE" subtitle.

### Logo Variants
| Variant | File | Use Case |
|---------|------|----------|
| Horizontal | `logo-horizontal.png` | Header, email signatures, wide spaces |
| Stacked | `logo-stacked.png` | Social media, square placements |
| Badge (circle) | `logo-badge.png` | Favicons, profile photos, watermarks |
| Badge with fill | `logo-badge-color.png` | Marketing materials, presentations |

### Logo Usage Rules
- Maintain clear space equal to the height of the leaf icon on all sides
- Minimum size: 120px wide (horizontal), 80px wide (badge)
- Never stretch, rotate, or alter the logo proportions
- On dark backgrounds, use the white/reversed version
- Do not place the logo on busy images without a solid or semi-transparent backing

---

## Color Palette

### Primary — Brand Teal
The core brand color. Conveys trust, medical authority, and calm.

| Token | Hex | Usage |
|-------|-----|-------|
| brand-50 | `#EDF7F6` | Light backgrounds, hover states |
| brand-100 | `#D4EEEC` | Subtle backgrounds |
| brand-200 | `#A8DDD9` | Borders, dividers |
| brand-300 | `#6BC5BF` | Secondary accents |
| brand-400 | `#3AA8A4` | Interactive hover |
| brand-500 | `#238888` | Links, interactive elements |
| brand-600 | `#1A7272` | Secondary text on light bg |
| brand-700 | `#155E5E` | **Primary buttons, CTAs** |
| brand-800 | `#0F4F52` | Dark accents |
| brand-900 | `#0A3D3F` | **Headings, dark backgrounds** |
| brand-950 | `#062A2C` | Darkest — footer |

### Accent — Lime
Adds energy and optimism. Use sparingly for CTAs and highlights.

| Token | Hex | Usage |
|-------|-----|-------|
| lime-50 | `#FAFBE8` | Lightest highlight |
| lime-100 | `#F4F7D8` | Subtle highlight bg |
| lime-200 | `#E8EFB0` | Light accents |
| lime-300 | `#D8E47A` | Medium accents |
| lime-400 | `#C8D84F` | Active states |
| lime-500 | `#B8CC3C` | **Accent buttons, badges** |
| lime-600 | `#9EB82E` | Hover for accent buttons |
| lime-700 | `#7A9423` | Checkmarks, success icons |

### Neutrals
Warm-toned grays for text and backgrounds.

| Token | Hex | Usage |
|-------|-----|-------|
| neutral-50 | `#F7F7F5` | Page backgrounds |
| neutral-100 | `#EBEBEB` | Borders, dividers |
| neutral-200 | `#D4D4D4` | Input borders |
| neutral-300 | `#B0B0B0` | Disabled text |
| neutral-400 | `#8B8B8B` | Placeholder text |
| neutral-500 | `#6B6B6B` | Secondary text |
| neutral-600 | `#525252` | Body text |
| neutral-700 | `#404040` | Strong body text |
| neutral-800 | `#2D2D2D` | **Primary body text** |
| neutral-900 | `#1A1A1A` | Strongest text |

---

## Typography

### Headings — Playfair Display
A refined serif that communicates authority and warmth. Used for all headings (h1-h4).

- **Display**: 3.5rem / 56px, -0.02em tracking, 1.1 line-height
- **H1**: 2.75rem / 44px, -0.02em, 1.15 line-height
- **H2**: 2rem / 32px, -0.01em, 1.2 line-height
- **H3**: 1.5rem / 24px, 1.3 line-height
- **H4**: 1.25rem / 20px, 1.4 line-height

### Body — Inter
A clean, modern sans-serif with excellent readability at all sizes.

- **Body Large**: 1.125rem / 18px, 1.7 line-height
- **Body**: 1rem / 16px, 1.7 line-height
- **Small**: 0.875rem / 14px, 1.6 line-height
- **Label/Overline**: 0.75rem / 12px, 0.2em letter-spacing, uppercase

### Font Loading
Fonts are loaded via Google Fonts CDN with `preconnect` for performance:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
```

---

## Spacing

The design uses an 8px base grid. All spacing values are multiples of 4px.

| Token | Value | Common Usage |
|-------|-------|--------------|
| `section-padding` | 64px / 96px (md) | Vertical padding between page sections |
| `container-page` | max-width 1200px, px-20/32 | Page content width |
| `gap-6` | 24px | Card grid gaps |
| `gap-3` | 12px | Inline element spacing |
| `rounded-brand` | 8px | Default border radius |

---

## Imagery Guidelines

### Photography Style
- **Professional, warm, and natural** — not sterile or clinical
- Prefer natural lighting over harsh studio lighting
- Show diverse people of different ages, races, and body types
- Focus on real moments: cooking, moving, connecting, learning
- Avoid: stock-photo poses, overly filtered images, junk food imagery

### Dr. Motley's Photos
- Use professional headshots for speaker pages and bios
- Candid shots of her teaching or with patients (with consent) for social proof
- White coat is optional — approachable attire works well for lifestyle medicine
- Background: clean, not cluttered

### Image Specifications
- Hero images: 1920x1080 minimum, optimized JPEG/WebP
- Card thumbnails: 800x450 (16:9 ratio)
- Profile photos: 800x800 minimum (square crop)
- All images should have descriptive alt text for accessibility

---

## Icon Style

- **Line icons** with 1.5-2px stroke weight
- Rounded caps and joins
- Match brand-600 or brand-700 on light backgrounds
- Match brand-200 or white on dark backgrounds
- 24x24 default size; 20x20 for inline; 48x48 for feature cards
- Source: Heroicons (heroicons.com) for consistency

---

## Button Styles

### Primary (brand-700 bg, white text)
Main CTAs — "Get Started", "Book Beth", "Submit"
```
bg-brand-700 text-white hover:bg-brand-800 active:bg-brand-900
px-7 py-3.5 rounded-[8px] font-medium
```

### Secondary (white bg, brand-700 border)
Secondary actions — "Learn More", "Back"
```
bg-white text-brand-700 border-2 border-brand-700 hover:bg-brand-50
px-7 py-3.5 rounded-[8px] font-medium
```

### Accent (lime-500 bg, brand-900 text)
High-attention CTAs — "Subscribe", "Apply Now"
```
bg-lime-500 text-brand-900 hover:bg-lime-600
px-7 py-3.5 rounded-[8px] font-semibold
```

---

## Voice & Tone

### Attributes
| Do | Don't |
|-----|-------|
| Credible, evidence-based | Hype-y, "miracle cure" language |
| Warm and encouraging | Cold or clinical |
| Optimistic and empowering | Shaming or fear-based |
| Clear and accessible | Overly technical jargon |
| Professional and authoritative | Influencer-style or salesy |
| Specific and practical | Vague wellness platitudes |

### Writing Guidelines
- Lead with outcomes and benefits, backed by evidence
- Use "you" and "your" — speak directly to the reader
- Cite ACLM, peer-reviewed research, or clinical experience when making claims
- Avoid absolute promises ("guaranteed", "cure") — use "evidence shows", "patients have experienced"
- Keep paragraphs short (2-4 sentences)
- Use active voice
- Include a call to action in every section

### Tone by Context
| Context | Tone |
|---------|------|
| Homepage | Confident, inviting, professional |
| Programs | Warm, detailed, reassuring |
| Speaking | Energetic, accomplished, engaging |
| Consulting | Authoritative, strategic, peer-to-peer |
| Articles | Educational, accessible, encouraging |
| Forms | Welcoming, respectful, concise |

---

## Component Reference

All components are implemented in the Tailwind config (`tailwind.config.mjs`) and global CSS (`src/styles/global.css`). The design system is the code — no separate design file needed.

To preview all components, run the site locally:
```bash
npm run dev
```
