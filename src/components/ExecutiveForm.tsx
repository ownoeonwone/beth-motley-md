import { useState, type FormEvent } from 'react';

export default function ExecutiveForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', title: '',
    primaryConcerns: '', currentPhysician: '', goals: '', timeline: '',
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
        body: JSON.stringify({ ...form, formName: 'executive-md' }),
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="card text-center py-12 border-brand-200 bg-brand-50/30">
        <svg className="w-12 h-12 text-brand-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-h3 font-serif text-brand-900 mb-2">Application Received</h3>
        <p className="text-body text-neutral-600">Thank you for your interest in the Executive MD Program. A member of Dr. Motley&apos;s team will contact you within 48 hours to schedule a confidential consultation.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <p className="text-small text-neutral-500 italic mb-6">All information is kept strictly confidential. This screening helps us determine if the Executive MD Program is the right fit for your needs.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="exec-name" className="label-text">Full Name *</label>
          <input id="exec-name" type="text" required value={form.name} onChange={(e) => update('name', e.target.value)} className="input-field" />
        </div>
        <div>
          <label htmlFor="exec-email" className="label-text">Email *</label>
          <input id="exec-email" type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} className="input-field" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label htmlFor="exec-phone" className="label-text">Phone *</label>
          <input id="exec-phone" type="tel" required value={form.phone} onChange={(e) => update('phone', e.target.value)} className="input-field" />
        </div>
        <div>
          <label htmlFor="exec-company" className="label-text">Company / Organization</label>
          <input id="exec-company" type="text" value={form.company} onChange={(e) => update('company', e.target.value)} className="input-field" />
        </div>
        <div>
          <label htmlFor="exec-title" className="label-text">Title / Role</label>
          <input id="exec-title" type="text" value={form.title} onChange={(e) => update('title', e.target.value)} className="input-field" placeholder="e.g. CEO, VP" />
        </div>
      </div>

      <div>
        <label htmlFor="exec-concerns" className="label-text">Primary Health Concerns *</label>
        <textarea id="exec-concerns" required rows={3} value={form.primaryConcerns} onChange={(e) => update('primaryConcerns', e.target.value)} className="input-field resize-y" placeholder="What health challenges or goals are you looking to address?" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="exec-physician" className="label-text">Do you currently have a primary care physician?</label>
          <select id="exec-physician" value={form.currentPhysician} onChange={(e) => update('currentPhysician', e.target.value)} className="input-field">
            <option value="">Select...</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Looking for one">Looking for one</option>
          </select>
        </div>
        <div>
          <label htmlFor="exec-timeline" className="label-text">Preferred Timeline</label>
          <select id="exec-timeline" value={form.timeline} onChange={(e) => update('timeline', e.target.value)} className="input-field">
            <option value="">Select...</option>
            <option value="Immediately">Ready to start immediately</option>
            <option value="1-3 months">Within 1-3 months</option>
            <option value="3+ months">3+ months out</option>
            <option value="Just exploring">Just exploring options</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="exec-goals" className="label-text">What does optimal health look like for you? *</label>
        <textarea id="exec-goals" required rows={3} value={form.goals} onChange={(e) => update('goals', e.target.value)} className="input-field resize-y" placeholder="Describe what you'd like to achieve: energy, performance, longevity, specific conditions..." />
      </div>

      <button type="submit" disabled={status === 'loading'} className="btn-primary disabled:opacity-60">
        {status === 'loading' ? 'Submitting...' : 'Request Confidential Consultation'}
      </button>
      {status === 'error' && <p className="text-sm text-red-600">Something went wrong. Please try again.</p>}
    </form>
  );
}
