/**
 * Retell.ai Webhook & Lead Types
 *
 * Type definitions for Retell server messages, function calls,
 * and GoHighLevel lead data for the 170 Otis St property agent.
 */

// --- Retell Webhook Events ---

export type RetellWebhookEventType =
  | 'call_started'
  | 'call_ended'
  | 'call_analyzed';

export interface RetellWebhookEvent {
  event: RetellWebhookEventType;
  call: RetellCall;
}

export interface RetellCall {
  call_id: string;
  agent_id: string;
  call_status: 'registered' | 'ongoing' | 'ended' | 'error';
  from_number?: string;
  to_number?: string;
  direction?: 'inbound' | 'outbound';
  start_timestamp?: number;
  end_timestamp?: number;
  duration_ms?: number;
  disconnection_reason?: string;
  transcript?: string;
  transcript_object?: RetellTranscriptEntry[];
  call_analysis?: RetellCallAnalysis;
  recording_url?: string;
  call_cost?: number;
  custom_analysis_data?: Record<string, unknown>;
}

export interface RetellTranscriptEntry {
  role: 'agent' | 'user';
  content: string;
  words?: Array<{
    word: string;
    start: number;
    end: number;
  }>;
}

export interface RetellCallAnalysis {
  call_summary?: string;
  user_sentiment?: 'Positive' | 'Negative' | 'Neutral' | 'Unknown';
  call_successful?: boolean;
  custom_analysis_data?: Record<string, unknown>;
}

// --- Retell Custom Function Call (sent to your server during a call) ---

export interface RetellFunctionCallPayload {
  call_id: string;
  name: string;
  args: Record<string, unknown>;
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
