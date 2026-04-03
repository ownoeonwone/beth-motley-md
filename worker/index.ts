/**
 * Beth Motley MD — Cloudflare Worker
 *
 * Handles:
 * 1. Retell.ai webhook for AI real estate phone agent (POST /api/retell-webhook)
 * 2. Retell.ai custom function calls (POST /api/retell-functions)
 * 3. Scheduled maintenance tasks via cron trigger
 *
 * Static asset requests are served automatically by the [assets] binding
 * configured in wrangler.toml.
 *
 * Cron: Sundays at 3 AM EST (08:00 UTC) — see wrangler.toml
 */

import { handleRetellWebhook, handleRetellFunctions } from './routes/retell-webhook';

interface Env {
  ASSETS: Fetcher;
  RETELL_API_KEY?: string;
}

// Key pages to health-check during maintenance
const HEALTH_CHECK_PATHS = [
  '/',
  '/about',
  '/programs/diabetes-reversal',
  '/programs/executive-md',
  '/speaking',
  '/consulting',
  '/media',
  '/resources',
  '/contact',
  '/events',
];

const SITE_URL = 'https://www.bethmotleymd.com';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // API routes
    if (request.method === 'POST') {
      if (url.pathname === '/api/retell-webhook') {
        return handleRetellWebhook(request, env);
      }
      if (url.pathname === '/api/retell-functions') {
        return handleRetellFunctions(request, env);
      }
    }

    // Pass all other requests through to the static assets binding
    return env.ASSETS.fetch(request);
  },

  // Scheduled maintenance — runs every Sunday at 3 AM EST
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(runMaintenance(env));
  },
};

async function runMaintenance(env: Env): Promise<void> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  const results: { path: string; status: number; ok: boolean; ms: number }[] = [];

  console.log(`[maintenance] Starting weekly maintenance at ${timestamp}`);

  // 1. Health-check all key pages
  for (const path of HEALTH_CHECK_PATHS) {
    const url = `${SITE_URL}${path}`;
    const t0 = Date.now();
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        headers: { 'User-Agent': 'BethMotleyMD-HealthCheck/1.0' },
        signal: AbortSignal.timeout(10_000),
      });
      const ms = Date.now() - t0;
      results.push({ path, status: response.status, ok: response.ok, ms });
      if (!response.ok) {
        console.error(`[maintenance] FAIL ${path} → ${response.status} (${ms}ms)`);
      } else {
        console.log(`[maintenance] OK   ${path} → ${response.status} (${ms}ms)`);
      }
    } catch (err) {
      const ms = Date.now() - t0;
      results.push({ path, status: 0, ok: false, ms });
      console.error(`[maintenance] ERROR ${path} → ${String(err)} (${ms}ms)`);
    }
  }

  // 2. Summarise
  const failed = results.filter((r) => !r.ok);
  const avgMs = Math.round(results.reduce((s, r) => s + r.ms, 0) / results.length);
  const totalMs = Date.now() - startTime;

  if (failed.length === 0) {
    console.log(
      `[maintenance] All ${results.length} pages healthy. avg ${avgMs}ms. ` +
        `Completed in ${totalMs}ms.`
    );
  } else {
    console.error(
      `[maintenance] ${failed.length}/${results.length} pages FAILED: ` +
        failed.map((r) => `${r.path} (${r.status || 'timeout'})`).join(', ')
    );
  }
}
