export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const GHL_WEBHOOK_URL =
  'https://services.leadconnectorhq.com/hooks/ePX2hb2Ih0YFgzmRJCdi/webhook-trigger/2bcf8fff-7799-4be3-860c-2efd1f7b3830';

const FORM_DISPLAY_NAMES: Record<string, string> = {
  contact: 'Contact Inquiry',
  speaking: 'Speaking Inquiry',
  'practice-integration': 'Practice Integration Application',
};

const FIELD_MAPS: Record<string, Record<string, string>> = {
  contact: {
    name: 'name',
    email: 'email',
    phone: 'phone',
    type: 'inquiry_type',
    message: 'message',
  },
  speaking: {
    name: 'name',
    email: 'email',
    organization: 'organization',
    audience: 'audience_type',
    eventDate: 'event_date',
    location: 'event_location',
    attendees: 'expected_attendees',
    details: 'event_details',
  },
  'practice-integration': {
    name: 'name',
    email: 'email',
    phone: 'phone',
    practiceName: 'practice_name',
    practiceType: 'practice_type',
    practiceSize: 'practice_size',
    primaryGoal: 'primary_goal',
    smaExperience: 'sma_experience',
    timeline: 'implementation_timeline',
    message: 'message',
  },
};

export function buildGhlPayload(
  formName: string,
  data: Record<string, string>,
): Record<string, string> {
  const payload: Record<string, string> = {
    form_name: FORM_DISPLAY_NAMES[formName] || formName,
    source: 'Website - Beth Motley MD',
    name: '',
    email: '',
    phone: '',
    inquiry_type: '',
    message: '',
    organization: '',
    audience_type: '',
    event_date: '',
    event_location: '',
    expected_attendees: '',
    event_details: '',
    practice_name: '',
    practice_type: '',
    practice_size: '',
    primary_goal: '',
    sma_experience: '',
    implementation_timeline: '',
  };

  const mapping = FIELD_MAPS[formName] || {};
  for (const [localKey, payloadKey] of Object.entries(mapping)) {
    payload[payloadKey] = data[localKey] || '';
  }

  return payload;
}

export async function submitToGhl(
  formName: string,
  data: Record<string, string>,
): Promise<void> {
  const payload = buildGhlPayload(formName, data);
  const response = await fetch(GHL_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Webhook submission failed: ${response.status}`);
  }
}
