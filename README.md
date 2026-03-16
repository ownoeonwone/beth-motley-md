# BethMotleyMD.com

Personal brand website for **Beth Motley, MD, FACLM** — Lifestyle Medicine physician, speaker, and consultant.

## Tech Stack

- **[Astro](https://astro.build)** — Static site generator (zero JS by default, perfect performance)
- **[Tailwind CSS](https://tailwindcss.com)** — Utility-first styling
- **[React](https://react.dev)** — Interactive components (forms, media filter)
- **Astro Content Collections** — Blog articles and media appearances in Markdown
- **TypeScript** — Type safety throughout

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `PUBLIC_FORM_ENDPOINT` | URL for form submissions (Formspree, GoHighLevel, etc.) |
| `PUBLIC_NEWSLETTER_ENDPOINT` | URL for newsletter signups (ConvertKit/Kit, etc.) |
| `PUBLIC_SITE_URL` | Your production URL |

## Project Structure

```
src/
├── components/     # Astro + React components
├── content/        # Markdown content (articles, media)
├── layouts/        # Page layouts
├── pages/          # Routes (each file = a page)
├── styles/         # Global CSS + Tailwind
└── lib/            # Shared utilities
```

## Deployment

Push to GitHub. Connect to **Vercel** or **Cloudflare Pages** for automatic deployment.

See [MAINTENANCE.md](./MAINTENANCE.md) for detailed deployment and maintenance instructions.
See [BRAND.md](./BRAND.md) for brand guidelines, colors, typography, and voice/tone.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, programs, and newsletter |
| `/about` | Bio, credentials, story, approach |
| `/programs/diabetes-reversal` | Diabetes Reversal Group Visits program |
| `/programs/executive-md` | Executive MD Program |
| `/speaking` | Speaking topics, testimonials, inquiry form |
| `/consulting` | Consulting services for healthcare organizations |
| `/media` | Filterable media appearances |
| `/articles` | Blog articles |
| `/contact` | Contact form |

## License

Private. All rights reserved.
