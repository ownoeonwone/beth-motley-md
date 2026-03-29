# Sanity CMS Setup Guide

This site uses [Sanity](https://sanity.io) as its CMS. Beth edits content at
`https://[project-id].sanity.studio` — no local tools or code knowledge needed.

---

## 1. Create a Sanity account & project

1. Go to [sanity.io](https://sanity.io) and sign up (free)
2. Click **Create new project** → name it `Beth Motley MD`
3. Choose dataset name `production` (the default)
4. Note your **Project ID** from the project dashboard URL

---

## 2. Set environment variables

Copy `.env.example` to `.env` and fill in:

```
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
SANITY_STUDIO_PROJECT_ID=your_project_id
SANITY_STUDIO_DATASET=production
```

Add the same variables to **Cloudflare Pages** → Settings → Environment Variables.

---

## 3. Deploy the Sanity Studio

The Studio is what Beth uses to edit content. Sanity hosts it for free.

```bash
cd studio
npm install
npm run deploy
```

This publishes the Studio at `https://beth-motley-md.sanity.studio` (or similar).
Beth bookmarks this URL and uses it to edit any content on the site.

---

## 4. Seed existing content

Run the seed script once to import the current JSON/markdown content into Sanity.

First, create a write token:
- Go to sanity.io/manage → your project → **API** → **Tokens**
- Click **Add API token** → name it `Seed`, role **Editor** → copy the token

Then run:

```bash
SANITY_PROJECT_ID=xxx SANITY_TOKEN=yyy node scripts/seed-sanity.mjs
```

After seeding:
- Open the Studio and **publish** each page document (click Publish)
- Review and correct any content if needed
- Re-upload images through the Studio's media library (local `/images/` paths need uploading)

---

## 5. Set up auto-deploy on content changes

So the live site updates when Beth publishes changes:

1. In **Cloudflare Pages** → Settings → Build → **Deploy Hooks** → create a hook
2. Copy the hook URL
3. In **Sanity** → sanity.io/manage → your project → **API** → **Webhooks**
4. Add a webhook pointing to your Cloudflare deploy hook URL
5. Set filter to trigger on **publish** events

Now when Beth hits Publish in the Studio, the site rebuilds automatically (~1 min).

---

## How Beth edits content

1. Go to `https://beth-motley-md.sanity.studio`
2. Log in with her Sanity account (invite her from sanity.io/manage → Members)
3. The left sidebar has:
   - **Home Page, About Page, Speaking Page**, etc. — edit any page copy
   - **Articles** — write new blog posts with a Word-processor-like editor
   - **Media Appearances** — add podcasts, videos, press features
   - **Calendar & Events** — add upcoming cohort dates or speaking engagements
4. Click **Publish** when done → site rebuilds in ~1 minute

### Updating next cohort dates
1. Click **Diabetes Reversal Program** in the sidebar
2. Scroll to the **Schedule** section
3. Update the **Next Cohort Dates** field (e.g. "Starting March 15, 2025")
4. Click **Publish**

---

## Local development

```bash
# Run the Astro site (requires .env with SANITY_PROJECT_ID)
npm run dev

# Run the Sanity Studio locally
npm run studio
```

---

## Pricing

The Sanity **Starter (free)** plan covers this site comfortably:
- 3 users
- 500,000 API requests / month
- 10 GB bandwidth
- 5 GB assets

Upgrade to Growth ($15/user/month) only if more editors are needed.
