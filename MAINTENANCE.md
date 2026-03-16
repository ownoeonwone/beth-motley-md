# Maintenance Guide — BethMotleyMD.com

This guide explains how to update and maintain the site without a developer.

---

## Quick Reference

| Task | How |
|------|-----|
| Edit page content | Edit `.astro` files in `src/pages/` |
| Add a blog post | Create a `.md` file in `src/content/articles/` |
| Add a media item | Add to the `mediaItems` array in `src/pages/media.astro` |
| Change colors/fonts | Edit `tailwind.config.mjs` |
| Update navigation | Edit `navLinks` in `src/components/Header.astro` |
| Update footer links | Edit `footerLinks` in `src/components/Footer.astro` |
| Change form endpoint | Update `PUBLIC_FORM_ENDPOINT` in `.env` |
| Deploy | Push to GitHub → auto-deploys to Vercel/Cloudflare |

---

## Adding a Blog Article

1. Create a new `.md` file in `src/content/articles/`. Use a URL-friendly filename:
   ```
   src/content/articles/my-new-article.md
   ```

2. Add frontmatter at the top:
   ```yaml
   ---
   title: "Your Article Title"
   description: "A 1-2 sentence summary for SEO."
   date: 2026-04-01
   tags: ["lifestyle medicine", "nutrition"]
   draft: false
   ---
   ```

3. Write your content in Markdown below the frontmatter:
   ```markdown
   ## First Section

   Your content here. Use **bold** and *italic* freely.

   ### Subsection

   - Bullet points work
   - Like this

   [Link text](https://example.com)
   ```

4. Set `draft: true` to hide an article from the site while you work on it.

5. Push to GitHub — the article will appear automatically on the Articles page.

---

## Adding a Media Appearance

Open `src/pages/media.astro` and add an entry to the `mediaItems` array:

```javascript
{
  title: "Your Podcast Title",
  type: "podcast",        // podcast | video | article | press
  source: "Podcast Name",
  date: "April 2026",
  href: "https://link-to-episode.com",
  embedId: "",            // YouTube video ID (leave empty for non-YouTube)
},
```

For YouTube videos, the `embedId` is the part after `v=` in the URL:
- URL: `https://youtube.com/watch?v=abc123`
- embedId: `"abc123"`

---

## Connecting Forms

### Option A: Formspree (Easiest)

1. Sign up at [formspree.io](https://formspree.io) (free for up to 50 submissions/month)
2. Create a form for each type (Contact, Speaking, Diabetes, Executive)
3. Copy your form endpoint (e.g., `https://formspree.io/f/xyzabc`)
4. Add to `.env`:
   ```
   PUBLIC_FORM_ENDPOINT=https://formspree.io/f/xyzabc
   ```
5. In Formspree settings, configure email notifications and optionally connect to Google Sheets

### Option B: GoHighLevel Webhook

1. In GoHighLevel, create a webhook for inbound forms
2. Copy the webhook URL
3. Set it as `PUBLIC_FORM_ENDPOINT` in `.env`
4. Each form submission includes a `formName` field (`contact`, `speaking`, `diabetes-reversal`, `executive-md`) — use this in GHL to route to different pipelines

### Option C: Google Sheets (via Apps Script)

1. Create a Google Sheet with columns matching form fields
2. Go to Extensions → Apps Script
3. Create a web app that receives POST requests and writes to the sheet
4. Use the web app URL as your `PUBLIC_FORM_ENDPOINT`

### Newsletter (ConvertKit / Kit)

1. In Kit, create a form and get its action URL
2. Set `PUBLIC_NEWSLETTER_ENDPOINT` in `.env` to the Kit form endpoint

---

## Updating Page Content

Each page is a single `.astro` file in `src/pages/`. The content is directly in the HTML — just edit the text.

**Example**: To update the About page bio, open `src/pages/about.astro` and edit the text in the `<p>` tags.

For components that repeat (testimonials, FAQ items, credentials), look for arrays near the top of the file and edit the values.

---

## Deployment

### Initial Setup (Vercel)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Framework: Astro (auto-detected)
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add environment variables from `.env`
7. Deploy

### Initial Setup (Cloudflare Pages — recommended)

1. Push to GitHub
2. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → Pages → Create
3. Connect your GitHub repo
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add environment variables
7. Deploy

### Custom Domain

1. In your hosting provider, go to Domains settings
2. Add `bethmotleymd.com` (and `www.bethmotleymd.com`)
3. Update DNS at your registrar:
   - For Vercel: Add a CNAME record pointing to `cname.vercel-dns.com`
   - For Cloudflare: It auto-configures if domain is on Cloudflare

### Continuous Deployment

After initial setup, every push to the `main` branch auto-deploys. Edit a file, push, and the site updates in ~60 seconds.

---

## Running Locally

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server runs at `http://localhost:4321`.

---

## File Structure Quick Reference

```
src/
├── components/          # Reusable UI pieces
├── content/
│   ├── articles/        # Blog posts (Markdown files)
│   └── media/           # Media appearances (Markdown files)
├── layouts/
│   └── BaseLayout.astro # Wraps every page (head, header, footer)
├── pages/               # Each file = a URL route
│   ├── index.astro      # Homepage (/)
│   ├── about.astro      # /about
│   ├── speaking.astro   # /speaking
│   ├── consulting.astro # /consulting
│   ├── media.astro      # /media
│   ├── contact.astro    # /contact
│   ├── programs/
│   │   ├── diabetes-reversal.astro
│   │   └── executive-md.astro
│   └── articles/
│       ├── index.astro        # /articles
│       └── [...slug].astro    # /articles/my-post
├── styles/
│   └── global.css       # Global styles & Tailwind
└── lib/
    └── utils.ts         # Shared utilities
```

---

## Common Tasks for a VA

1. **Publish a blog post**: Create `.md` file in `src/content/articles/`, commit and push
2. **Add a media appearance**: Edit the array in `src/pages/media.astro`, commit and push
3. **Update testimonials**: Edit the TestimonialCard data in the relevant page file
4. **Change photos**: Replace files in `public/images/` with same filenames
5. **Update credentials**: Edit `src/components/CredentialBar.astro`

All changes go live automatically after pushing to GitHub.
