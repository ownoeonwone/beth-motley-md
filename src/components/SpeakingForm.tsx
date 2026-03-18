import { useState, type FormEvent } from 'react';
import { submitToGhl } from '../lib/utils';

const audienceTypes = [
  'Corporate / Workplace wellness',
  'Healthcare conference',
  'Medical education (CME)',
  'Community / Church group',
  'Podcast / Webinar / Virtual event',
  'Other',
];

export default function SpeakingForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [form, setForm] = useState({
    name: '', email: '', organization: '', audience: '',
    eventDate: '', location: '', attendees: '', details: '',
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      await submitToGhl('speaking', form);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="card text-center py-12">
        <svg className="w-12 h-12 text-lime-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-h3 font-serif text-brand-900 mb-2">Inquiry Received</h3>
        <p className="text-body text-neutral-600">Thank you! We&apos;ll review your event details and respond within 2 business days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="speak-name" className="label-text">Your Name *</label>
          <input id="speak-name" type="text" required value={form.name} onChange={(e) => update('name', e.target.value)} className="input-field" />
        </div>
        <div>
          <label htmlFor="speak-email" className="label-text">Email *</label>
          <input id="speak-email" type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} className="input-field" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="speak-org" className="label-text">Organization *</label>
          <input id="speak-org" type="text" required value={form.organization} onChange={(e) => update('organization', e.target.value)} className="input-field" />
        </div>
        <div>
          <label htmlFor="speak-audience" className="label-text">Audience Type *</label>
          <select id="speak-audience" required value={form.audience} onChange={(e) => update('audience', e.target.value)} className="input-field">
            <option value="">Select...</option>
            {audienceTypes.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label htmlFor="speak-date" className="label-text">Event Date</label>
          <input id="speak-date" type="date" value={form.eventDate} onChange={(e) => update('eventDate', e.target.value)} className="input-field" />
        </div>
        <div>
          <label htmlFor="speak-location" className="label-text">Location</label>
          <input id="speak-location" type="text" value={form.location} onChange={(e) => update('location', e.target.value)} className="input-field" placeholder="City, State or Virtual" />
        </div>
        <div>
          <label htmlFor="speak-attendees" className="label-text">Expected Attendees</label>
          <input id="speak-attendees" type="text" value={form.attendees} onChange={(e) => update('attendees', e.target.value)} className="input-field" placeholder="e.g. 50-100" />
        </div>
      </div>

      <div>
        <label htmlFor="speak-details" className="label-text">Event Details & Topics of Interest *</label>
        <textarea id="speak-details" required rows={4} value={form.details} onChange={(e) => update('details', e.target.value)} className="input-field resize-y" placeholder="Tell us about your event, audience, and what topics you'd like covered..." />
      </div>

      <button type="submit" disabled={status === 'loading'} className="btn-primary disabled:opacity-60">
        {status === 'loading' ? 'Submitting...' : 'Submit Speaking Inquiry'}
      </button>
      {status === 'error' && <p className="text-sm text-red-600">Something went wrong. Please try again.</p>}
    </form>
  );
}
