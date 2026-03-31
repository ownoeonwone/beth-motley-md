import { useState, type FormEvent, type ReactNode } from 'react';
import { submitToGhl } from '../lib/utils';

interface Props {
  children: ReactNode;
}

export default function ProviderToolsGate({ children }: Props) {
  const [status, setStatus] = useState<'locked' | 'loading' | 'unlocked' | 'error'>(() => {
    // Check if already unlocked in this browser
    if (typeof window !== 'undefined' && localStorage.getItem('provider-tools-unlocked')) {
      return 'unlocked';
    }
    return 'locked';
  });

  const [form, setForm] = useState({ name: '', email: '', organization: '', role: '' });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      await submitToGhl('provider-tools-access', form);
      localStorage.setItem('provider-tools-unlocked', '1');
      setStatus('unlocked');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'unlocked') {
    return <>{children}</>;
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="card border-brand-200 bg-brand-50/30 text-center p-8">
        <div className="w-14 h-14 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <h3 className="text-h4 font-serif text-brand-900 mb-2">Provider Access Required</h3>
        <p className="text-small text-neutral-600 mb-6">
          These resources are designed for clinicians and students. Enter your information below to access the full toolkit.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pt-name" className="label-text">Full Name *</label>
              <input id="pt-name" type="text" required value={form.name} onChange={(e) => update('name', e.target.value)} className="input-field" placeholder="Your name" />
            </div>
            <div>
              <label htmlFor="pt-email" className="label-text">Email *</label>
              <input id="pt-email" type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} className="input-field" placeholder="you@organization.com" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pt-org" className="label-text">Organization</label>
              <input id="pt-org" type="text" value={form.organization} onChange={(e) => update('organization', e.target.value)} className="input-field" placeholder="Hospital, practice, or school" />
            </div>
            <div>
              <label htmlFor="pt-role" className="label-text">Role</label>
              <input id="pt-role" type="text" value={form.role} onChange={(e) => update('role', e.target.value)} className="input-field" placeholder="e.g. Physician, Resident, Student" />
            </div>
          </div>
          <button type="submit" disabled={status === 'loading'} className="btn-primary w-full disabled:opacity-60">
            {status === 'loading' ? 'Verifying...' : 'Access Provider Tools'}
          </button>
          {status === 'error' && <p className="text-sm text-red-600 text-center">Something went wrong. Please try again.</p>}
        </form>

        <p className="text-[11px] text-neutral-400 mt-4">
          Your information is submitted securely and will not be shared.
        </p>
      </div>
    </div>
  );
}
