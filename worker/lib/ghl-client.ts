/**
 * GoHighLevel CRM Integration for Real Estate Leads
 *
 * Sends qualified buyer leads and call data to the existing
 * GHL webhook used by the BethMotleyMD.com website.
 */

import type { LeadData, QualifyBuyerParams, EscalateToOwnerParams } from './types';

const GHL_WEBHOOK_URL =
  'https://services.leadconnectorhq.com/hooks/ePX2hb2Ih0YFgzmRJCdi/webhook-trigger/2bcf8fff-7799-4be3-860c-2efd1f7b3830';

/**
 * Submit a qualified lead to GoHighLevel CRM.
 */
export async function submitLeadToGhl(lead: LeadData): Promise<void> {
  const payload = {
    form_name: 'Real Estate Lead - 170 Otis St',
    source: 'AI Phone Agent - Retell',
    name: lead.full_name,
    email: lead.email,
    phone: lead.phone,
    offer_amount: String(lead.offer_amount),
    financing_type: lead.financing_type,
    timeline: lead.timeline,
    purchase_type: lead.purchase_type,
    qualification_status: lead.qualification_status,
    call_summary: lead.call_summary || '',
    call_duration: lead.call_duration_seconds ? `${lead.call_duration_seconds}s` : '',
    notes: lead.notes || '',
    message: lead.call_transcript
      ? `Call transcript:\n${lead.call_transcript.substring(0, 5000)}`
      : '',
  };

  const response = await fetch(GHL_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    console.error(`[ghl] Lead submission failed: ${response.status}`);
    throw new Error(`GHL webhook failed: ${response.status}`);
  }

  console.log(`[ghl] Lead submitted: ${lead.full_name} — $${lead.offer_amount}`);
}

/**
 * Submit buyer qualification data to GoHighLevel.
 */
export async function submitQualificationToGhl(
  callerPhone: string | undefined,
  data: QualifyBuyerParams,
): Promise<void> {
  const payload = {
    form_name: 'Real Estate Qualification - 170 Otis St',
    source: 'AI Phone Agent - Retell',
    phone: callerPhone || 'Unknown',
    purchase_type: data.purchase_type,
    timeline: data.timeline,
    financing: data.financing,
    pre_approved: data.pre_approved ? 'Yes' : 'No',
    land_experience: data.land_experience ? 'Yes' : 'No',
    notes: data.additional_notes || '',
    message: `Buyer qualification: ${data.purchase_type}, ${data.timeline}, ${data.financing}, pre-approved: ${data.pre_approved}`,
  };

  const response = await fetch(GHL_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    console.error(`[ghl] Qualification submission failed: ${response.status}`);
  } else {
    console.log(`[ghl] Qualification submitted for ${callerPhone || 'unknown caller'}`);
  }
}

/**
 * Submit an escalation request (caller wants to speak to the owner).
 */
export async function submitEscalationToGhl(data: EscalateToOwnerParams): Promise<void> {
  const payload = {
    form_name: 'Real Estate Escalation - 170 Otis St',
    source: 'AI Phone Agent - Retell',
    name: data.caller_name || 'Unknown',
    phone: data.caller_phone || 'Unknown',
    message: `ESCALATION (${data.urgency}): ${data.reason}`,
    inquiry_type: 'Owner Callback Requested',
    notes: `Urgency: ${data.urgency}`,
  };

  const response = await fetch(GHL_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    console.error(`[ghl] Escalation submission failed: ${response.status}`);
  } else {
    console.log(`[ghl] Escalation submitted: ${data.reason}`);
  }
}

/**
 * Submit end-of-call report to GoHighLevel.
 */
export async function submitCallReportToGhl(
  callerPhone: string | undefined,
  transcript: string | undefined,
  summary: string | undefined,
  durationSeconds: number | undefined,
  endedReason: string | undefined,
): Promise<void> {
  const payload = {
    form_name: 'Real Estate Call Report - 170 Otis St',
    source: 'AI Phone Agent - Retell',
    phone: callerPhone || 'Unknown',
    message: transcript ? `Transcript:\n${transcript.substring(0, 5000)}` : 'No transcript available',
    notes: [
      summary ? `Summary: ${summary}` : '',
      durationSeconds ? `Duration: ${durationSeconds}s` : '',
      endedReason ? `Ended: ${endedReason}` : '',
    ]
      .filter(Boolean)
      .join(' | '),
  };

  const response = await fetch(GHL_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    console.error(`[ghl] Call report submission failed: ${response.status}`);
  } else {
    console.log(`[ghl] Call report submitted for ${callerPhone || 'unknown caller'}`);
  }
}
