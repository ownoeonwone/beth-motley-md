/**
 * Vapi.ai Webhook & Lead Types
 *
 * Type definitions for Vapi server messages, function calls,
 * and GoHighLevel lead data for the 170 Otis St property agent.
 */

// --- Vapi Webhook Payloads ---

export type VapiMessageType =
  | 'assistant-request'
  | 'function-call'
  | 'end-of-call-report'
  | 'speech-update'
  | 'transcript'
  | 'hang'
  | 'status-update';

export interface VapiWebhookPayload {
  message: {
    type: VapiMessageType;
    call?: VapiCall;
    functionCall?: VapiFunctionCall;
    artifact?: VapiArtifact;
    /** end-of-call-report fields */
    endedReason?: string;
    transcript?: string;
    summary?: string;
    recordingUrl?: string;
    cost?: number;
    durationSeconds?: number;
  };
}

export interface VapiCall {
  id: string;
  orgId: string;
  phoneNumberId?: string;
  customer?: {
    number?: string;
  };
  status: string;
  startedAt?: string;
  endedAt?: string;
}

export interface VapiFunctionCall {
  name: string;
  parameters: Record<string, unknown>;
}

export interface VapiArtifact {
  transcript?: string;
  messages?: Array<{
    role: string;
    message: string;
    time: number;
  }>;
  recordingUrl?: string;
}

// --- Function Call Parameter Types ---

export interface QualifyBuyerParams {
  purchase_type: 'personal_build' | 'investment' | 'development' | 'other';
  timeline: '30_days' | '60_days' | '90_days' | 'flexible';
  financing: 'cash' | 'conventional_loan' | 'hard_money' | 'other';
  pre_approved: boolean;
  land_experience: boolean;
  additional_notes?: string;
}

export interface LogLeadParams {
  full_name: string;
  email: string;
  phone: string;
  offer_amount: number;
  financing_type: string;
  timeline: string;
  purchase_type: string;
  notes?: string;
}

export interface EscalateToOwnerParams {
  caller_name?: string;
  caller_phone?: string;
  reason: string;
  urgency: 'low' | 'medium' | 'high';
}

// --- Lead Data ---

export type QualificationStatus = 'hot' | 'warm' | 'cold' | 'unqualified';

export interface LeadData {
  full_name: string;
  email: string;
  phone: string;
  offer_amount: number;
  financing_type: string;
  timeline: string;
  purchase_type: string;
  qualification_status: QualificationStatus;
  call_summary?: string;
  call_transcript?: string;
  call_duration_seconds?: number;
  notes?: string;
}

// --- Vapi Function Call Response ---

export interface VapiFunctionResponse {
  result: string;
}
