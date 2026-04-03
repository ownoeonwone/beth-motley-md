/**
 * Retell.ai Webhook Handler
 *
 * Processes incoming Retell webhook events and custom function calls
 * for the 170 Otis St AI real estate phone agent. Routes function
 * calls to GHL and handles end-of-call reporting.
 *
 * Two endpoint types:
 * 1. POST /api/retell-webhook — General webhook (call_started, call_ended, call_analyzed)
 * 2. POST /api/retell-functions — Custom function calls during a live call
 */

import type {
  RetellWebhookEvent,
  RetellFunctionCallPayload,
  QualifyBuyerParams,
  LogLeadParams,
  EscalateToOwnerParams,
  QualificationStatus,
  LeadData,
} from '../lib/types';

import {
  submitLeadToGhl,
  submitQualificationToGhl,
  submitEscalationToGhl,
  submitCallReportToGhl,
} from '../lib/ghl-client';

interface Env {
  RETELL_API_KEY?: string;
}

/**
 * Verify the request is from Retell by checking the x-retell-signature header.
 * Retell signs webhooks with HMAC SHA-256 using your API key.
 */
async function verifyRetellSignature(
  request: Request,
  apiKey: string,
): Promise<boolean> {
  const signature = request.headers.get('x-retell-signature');
  if (!signature) return false;

  const body = await request.clone().text();
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(apiKey),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  const expectedSignature = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return signature === expectedSignature;
}

/**
 * Main webhook handler — handles Retell general webhook events
 * (call_started, call_ended, call_analyzed)
 */
export async function handleRetellWebhook(request: Request, env: Env): Promise<Response> {
  if (env.RETELL_API_KEY) {
    const valid = await verifyRetellSignature(request, env.RETELL_API_KEY);
    if (!valid) {
      console.error('[retell] Webhook signature verification failed');
      return new Response('Unauthorized', { status: 401 });
    }
  }

  let event: RetellWebhookEvent;
  try {
    event = await request.json() as RetellWebhookEvent;
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const callerPhone = event.call?.from_number;
  console.log(`[retell] Event: ${event.event}, call: ${event.call?.call_id}, from: ${callerPhone || 'unknown'}`);

  switch (event.event) {
    case 'call_started':
      console.log(`[retell] Call started: ${event.call.call_id}`);
      return jsonResponse({ message: 'OK' });

    case 'call_ended':
    case 'call_analyzed': {
      const call = event.call;
      const durationSeconds = call.duration_ms ? Math.round(call.duration_ms / 1000) : undefined;

      try {
        await submitCallReportToGhl(
          callerPhone,
          call.transcript,
          call.call_analysis?.call_summary,
          durationSeconds,
          call.disconnection_reason,
        );
      } catch (err) {
        console.error('[retell] Failed to submit call report:', err);
      }

      console.log(
        `[retell] Call ${event.event}: ${callerPhone || 'unknown'}, ` +
        `duration: ${durationSeconds || 0}s, ` +
        `reason: ${call.disconnection_reason || 'unknown'}`,
      );

      return jsonResponse({ message: 'OK' });
    }

    default:
      return jsonResponse({ message: 'OK' });
  }
}

/**
 * Custom function call handler — called by Retell during a live call
 * when the agent invokes a custom function (qualify_buyer, log_lead, escalate_to_owner)
 */
export async function handleRetellFunctions(request: Request, env: Env): Promise<Response> {
  if (env.RETELL_API_KEY) {
    const valid = await verifyRetellSignature(request, env.RETELL_API_KEY);
    if (!valid) {
      console.error('[retell] Function call signature verification failed');
      return new Response('Unauthorized', { status: 401 });
    }
  }

  let payload: RetellFunctionCallPayload;
  try {
    payload = await request.json() as RetellFunctionCallPayload;
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const { name, args, call_id } = payload;
  console.log(`[retell] Function call: ${name} (call: ${call_id})`, JSON.stringify(args));

  switch (name) {
    case 'qualify_buyer': {
      const params = args as unknown as QualifyBuyerParams;
      try {
        await submitQualificationToGhl(undefined, params);
      } catch (err) {
        console.error('[retell] Failed to submit qualification:', err);
      }

      const qualStatus = scoreQualification(params);
      return jsonResponse({
        result: `Buyer qualified as ${qualStatus}. ${getQualificationGuidance(qualStatus)}`,
      });
    }

    case 'log_lead': {
      const params = args as unknown as LogLeadParams;
      const lead: LeadData = {
        full_name: params.full_name,
        email: params.email,
        phone: params.phone || '',
        offer_amount: params.offer_amount,
        financing_type: params.financing_type,
        timeline: params.timeline,
        purchase_type: params.purchase_type,
        qualification_status: 'hot',
        notes: params.notes,
      };

      try {
        await submitLeadToGhl(lead);
      } catch (err) {
        console.error('[retell] Failed to submit lead:', err);
      }

      return jsonResponse({
        result: 'Lead has been logged successfully. The owner will follow up within 24 hours with next steps and title company information.',
      });
    }

    case 'escalate_to_owner': {
      const params = args as unknown as EscalateToOwnerParams;

      try {
        await submitEscalationToGhl(params);
      } catch (err) {
        console.error('[retell] Failed to submit escalation:', err);
      }

      return jsonResponse({
        result: 'The owner has been notified and will call back within 24 hours.',
      });
    }

    default:
      console.warn(`[retell] Unknown function: ${name}`);
      return jsonResponse({ result: 'Function not recognized' });
  }
}

/**
 * Score a buyer's qualification level based on their responses.
 */
function scoreQualification(params: QualifyBuyerParams): QualificationStatus {
  let score = 0;

  if (params.financing === 'cash') score += 3;
  if (params.pre_approved) score += 2;

  if (params.timeline === '30_days') score += 3;
  else if (params.timeline === '60_days') score += 2;
  else if (params.timeline === '90_days') score += 1;

  if (params.purchase_type === 'personal_build') score += 2;
  if (params.purchase_type === 'development') score += 2;
  if (params.purchase_type === 'investment') score += 1;

  if (params.land_experience) score += 1;

  if (score >= 7) return 'hot';
  if (score >= 4) return 'warm';
  if (score >= 2) return 'cold';
  return 'unqualified';
}

/**
 * Get conversation guidance based on qualification status.
 */
function getQualificationGuidance(status: QualificationStatus): string {
  switch (status) {
    case 'hot':
      return 'This is a highly qualified buyer. Be enthusiastic, move toward pricing and next steps quickly. Emphasize the comp at 102 Elm ($1.037M) and all-utilities advantage.';
    case 'warm':
      return 'This buyer shows good potential. Continue building value and address any concerns. Guide them toward making an offer.';
    case 'cold':
      return 'This buyer may need more time or education. Share the value proposition but don\'t push too hard. Collect their contact info for follow-up.';
    case 'unqualified':
      return 'This caller may not be a serious buyer. Be polite but efficient. Collect contact info if they\'re interested and wrap up the call.';
  }
}

function jsonResponse(data: Record<string, string>): Response {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}
