import { useState, type FormEvent } from 'react';

const inquiryTypes = [
  'Speaking engagement',
  'Podcast / media appearance',
  'Consulting inquiry',
  'Diabetes reversal program',
  'Executive MD program',
  'General question',
];

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    type: '',
    message: '',
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const endpoint = import.meta.env.PUBLIC_FORM_ENDPOINT || '#';
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, formName: 'contact' }),
      });
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
        <h3 className="text-h3 font-serif text-brand-900 mb-2">Message Sent</h3>
        <p className="text-body text-neutral-600">Thank you for reaching out. Dr. Motley&apos;s team will be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-name" className="label-text">Full Name *</label>
          <input id="contact-name" type="text" required value={form.name} onChange={(e) => update('name', e.target.value)} className="input-field" placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="contact-email" className="label-text">Email *</label>
          <input id="contact-email" type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} className="input-field" placeholder="you@email.com" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-phone" className="label-text">Phone</label>
          <input id="contact-phone" type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} className="input-field" placeholder="(555) 123-4567" />
        </div>
        <div>
          <label htmlFor="contact-type" className="label-text">Inquiry Type *</label>
          <select id="contact-type" required value={form.type} onChange={(e) => update('type', e.target.value)} className="input-field">
            <option value="">Select one...</option>
            {inquiryTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="label-text">Message *</label>
        <textarea id="contact-message" required rows={5} value={form.message} onChange={(e) => update('message', e.target.value)} className="input-field resize-y" placeholder="How can Dr. Motley help?" />
      </div>

      <button type="submit" disabled={status === 'loading'} className="btn-primary w-full sm:w-auto disabled:opacity-60">
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </button>
      {status === 'error' && <p className="text-sm text-red-600">Something went wrong. Please try again or email directly.</p>}
    </form>
  );
}
