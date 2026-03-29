import { useState, type FormEvent } from 'react';
import { submitToGhl } from '../lib/utils';

const practiceTypes = [
  'Family Medicine',
  'Internal Medicine',
  'Other',
];

const practiceSizes = [
  'Solo',
  '2\u20133 physicians',
  '4\u20136 physicians',
  'Health system',
];

const primaryGoals = [
  'Add new revenue streams',
  'Improve chronic disease outcomes',
  'Both',
  'Still exploring',
];

const smaExperience = [
  'Yes',
  'No',
  'Heard of them',
];

const timelines = [
  'Ready now',
  '3\u20136 months',
  'Just exploring',
];

export default function PracticeIntegrationForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    practiceName: '',
    practiceType: '',
    practiceSize: '',
    primaryGoal: '',
    smaExperience: '',
    timeline: '',
    message: '',
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      await submitToGhl('practice-integration', {
        ...form,
        name: `${form.firstName} ${form.lastName}`,
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
        <h3 className="text-h3 font-serif text-brand-900 mb-2">Application Received</h3>
        <p className="text-body text-neutral-600">
          Dr. Motley reviews every submission personally and will be in touch within 3 business days if there is a strong fit.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="pi-first" className="label-text">First Name *</label>
          <input id="pi-first" type="text" required value={form.firstName} onChange={(e) => update('firstName', e.target.value)} className="input-field" />
        </div>
        <div>
          <label htmlFor="pi-last" className="label-text">Last Name *</label>
          <input id="pi-last" type="text" required value={form.lastName} onChange={(e) => update('lastName', e.target.value)} className="input-field" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="pi-email" className="label-text">Email Address *</label>
          <input id="pi-email" type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} className="input-field" />
        </div>
        <div>
          <label htmlFor="pi-phone" className="label-text">Phone Number *</label>
          <input id="pi-phone" type="tel" required value={form.phone} onChange={(e) => update('phone', e.target.value)} className="input-field" />
        </div>
      </div>

      <div>
        <label htmlFor="pi-practice" className="label-text">Practice Name *</label>
        <input id="pi-practice" type="text" required value={form.practiceName} onChange={(e) => update('practiceName', e.target.value)} className="input-field" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="pi-type" className="label-text">Practice Type *</label>
          <select id="pi-type" required value={form.practiceType} onChange={(e) => update('practiceType', e.target.value)} className="input-field">
            <option value="">Select...</option>
            {practiceTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="pi-size" className="label-text">Practice Size *</label>
          <select id="pi-size" required value={form.practiceSize} onChange={(e) => update('practiceSize', e.target.value)} className="input-field">
            <option value="">Select...</option>
            {practiceSizes.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="pi-goal" className="label-text">Primary Goal *</label>
          <select id="pi-goal" required value={form.primaryGoal} onChange={(e) => update('primaryGoal', e.target.value)} className="input-field">
            <option value="">Select...</option>
            {primaryGoals.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="pi-sma" className="label-text">Prior SMA Experience</label>
          <select id="pi-sma" value={form.smaExperience} onChange={(e) => update('smaExperience', e.target.value)} className="input-field">
            <option value="">Select...</option>
            {smaExperience.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="pi-timeline" className="label-text">Implementation Timeline</label>
        <select id="pi-timeline" value={form.timeline} onChange={(e) => update('timeline', e.target.value)} className="input-field">
          <option value="">Select...</option>
          {timelines.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="pi-message" className="label-text">Tell us about your practice and what brought you here</label>
        <textarea id="pi-message" rows={4} value={form.message} onChange={(e) => update('message', e.target.value)} className="input-field resize-y" />
      </div>

      <button type="submit" disabled={status === 'loading'} className="btn-primary w-full disabled:opacity-60">
        {status === 'loading' ? 'Submitting...' : 'Submit My Application'}
      </button>

      {status === 'error' && <p className="text-sm text-red-600">Something went wrong. Please try again.</p>}

      <p className="text-small text-neutral-500 text-center mt-2 flex items-center justify-center gap-1.5">
        <svg className="w-4 h-4 text-brand-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        Your information is secure and HIPAA-compliant.{' '}
        <a href="/notice-of-privacy-practices" className="underline hover:text-brand-600 transition-colors">Privacy Practices</a>
      </p>
    </form>
  );
}
