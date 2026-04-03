/**
 * Vapi.ai Webhook Handler
 *
 * Processes incoming Vapi server messages for the 170 Otis St
 * AI real estate phone agent. Routes function calls to GHL
 * and handles end-of-call reporting.
 */

import type {
  VapiWebhookPayload,
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
  VAPI_WEBHOOK_SECRET?: string;
}

/**
 * Main webhook handler — called from worker/index.ts for POST /api/vapi-webhook
 */
export async function handleVapiWebhook(request: Request, env: Env): Promise<Response> {
  // Verify webhook secret if configured
  if (env.VAPI_WEBHOOK_SECRET) {
    const authHeader = request.headers.get('x-vapi-secret');
    if (authHeader !== env.VAPI_WEBHOOK_SECRET) {
      console.error('[vapi] Webhook secret mismatch');
      return new Response('Unauthorized', { status: 401 });
    }
  }

  let payload: VapiWebhookPayload;
  try {
    payload = await request.json() as VapiWebhookPayload;
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const messageType = payload.message?.type;
  const callerPhone = payload.message?.call?.customer?.number;

  console.log(`[vapi] Received ${messageType} from ${callerPhone || 'unknown'}`);

  switch (messageType) {
    case 'function-call':
      return handleFunctionCall(payload, callerPhone);

    case 'end-of-call-report':
      return handleEndOfCallReport(payload, callerPhone);

    case 'assistant-request':
      // Could return dynamic assistant config here; for now Vapi uses dashboard config
      return jsonResponse({ message: 'OK' });

    default:
      // status-update, transcript, speech-update, hang — acknowledge silently
      return jsonResponse({ message: 'OK' });
  }
}

/**
 * Handle Vapi function calls (qualify_buyer, log_lead, escalate_to_owner)
 */
async function handleFunctionCall(
  payload: VapiWebhookPayload,
  callerPhone: string | undefined,
): Promise<Response> {
  const functionCall = payload.message.functionCall;
  if (!functionCall) {
    return jsonResponse({ result: 'No function call data received' });
  }

  const { name, parameters } = functionCall;
  console.log(`[vapi] Function call: ${name}`, JSON.stringify(parameters));

  switch (name) {
    case 'qualify_buyer': {
      const params = parameters as unknown as QualifyBuyerParams;
      try {
        await submitQualificationToGhl(callerPhone, params);
      } catch (err) {
        console.error('[vapi] Failed to submit qualification:', err);
      }

      const qualStatus = scoreQualification(params);
      return jsonResponse({
        result: `Buyer qualified as ${qualStatus}. ${getQualificationGuidance(qualStatus)}`,
      });
    }

    case 'log_lead': {
      const params = parameters as unknown as LogLeadParams;
      const lead: LeadData = {
        full_name: params.full_name,
        email: params.email,
        phone: params.phone || callerPhone || '',
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
        console.error('[vapi] Failed to submit lead:', err);
      }

      return jsonResponse({
        result: 'Lead has been logged successfully. The owner will follow up within 24 hours with next steps and title company information.',
      });
    }

    case 'escalate_to_owner': {
      const params = parameters as unknown as EscalateToOwnerParams;
      if (!params.caller_phone && callerPhone) {
        params.caller_phone = callerPhone;
      }

      try {
        await submitEscalationToGhl(params);
      } catch (err) {
        console.error('[vapi] Failed to submit escalation:', err);
      }

      return jsonResponse({
        result: 'The owner has been notified and will call back within 24 hours.',
      });
    }

    default:
      console.warn(`[vapi] Unknown function: ${name}`);
      return jsonResponse({ result: 'Function not recognized' });
  }
}

/**
 * Handle end-of-call reports — log transcript and summary to GHL
 */
async function handleEndOfCallReport(
  payload: VapiWebhookPayload,
  callerPhone: string | undefined,
): Promise<Response> {
  const msg = payload.message;

  try {
    await submitCallReportToGhl(
      callerPhone,
      msg.transcript,
      msg.summary,
      msg.durationSeconds,
      msg.endedReason,
    );
  } catch (err) {
    console.error('[vapi] Failed to submit call report:', err);
  }

  console.log(
    `[vapi] Call ended: ${callerPhone || 'unknown'}, ` +
    `duration: ${msg.durationSeconds || 0}s, ` +
    `reason: ${msg.endedReason || 'unknown'}`,
  );

  return jsonResponse({ message: 'OK' });
}

/**
 * Score a buyer's qualification level based on their responses.
 */
function scoreQualification(params: QualifyBuyerParams): QualificationStatus {
  let score = 0;

  // Cash buyers and pre-approved buyers score highest
  if (params.financing === 'cash') score += 3;
  if (params.pre_approved) score += 2;

  // Shorter timelines are more serious
  if (params.timeline === '30_days') score += 3;
  else if (params.timeline === '60_days') score += 2;
  else if (params.timeline === '90_days') score += 1;

  // Personal builders and developers are most serious
  if (params.purchase_type === 'personal_build') score += 2;
  if (params.purchase_type === 'development') score += 2;
  if (params.purchase_type === 'investment') score += 1;

  // Experience with land purchases is a good sign
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
