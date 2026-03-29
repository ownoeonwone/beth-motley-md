import { useState, type FormEvent } from 'react';

const referralSources = [
  'My doctor referred me',
  'Found online / search',
  'Friend or family recommendation',
  'Social media',
  'Attended a talk by Dr. Motley',
  'Other',
];

export default function DiabetesForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    diagnosisType: '', yearsWithDiagnosis: '', currentMedications: '',
    referralSource: '', goals: '', questions: '',
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
        body: JSON.stringify({ ...form, formName: 'diabetes-reversal' }),
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
        <p className="text-body text-neutral-600">We&apos;ll review your information and reach out within 3 business days to discuss next steps.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-small font-medium transition-colors ${
              step >= s ? 'bg-brand-700 text-white' : 'bg-neutral-100 text-neutral-400'
            }`}>{s}</div>
            {s < 2 && <div className={`w-12 h-0.5 ${step > s ? 'bg-brand-700' : 'bg-neutral-200'}`} />}
          </div>
        ))}
        <span className="text-small text-neutral-500 ml-2">{step === 1 ? 'Your Info' : 'Health Background'}</span>
      </div>

      {step === 1 && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="dr-name" className="label-text">Full Name *</label>
              <input id="dr-name" type="text" required value={form.name} onChange={(e) => update('name', e.target.value)} className="input-field" />
            </div>
            <div>
              <label htmlFor="dr-email" className="label-text">Email *</label>
              <input id="dr-email" type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="dr-phone" className="label-text">Phone *</label>
              <input id="dr-phone" type="tel" required value={form.phone} onChange={(e) => update('phone', e.target.value)} className="input-field" />
            </div>
            <div>
              <label htmlFor="dr-referral" className="label-text">How did you hear about us?</label>
              <select id="dr-referral" value={form.referralSource} onChange={(e) => update('referralSource', e.target.value)} className="input-field">
                <option value="">Select...</option>
                {referralSources.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <button type="button" onClick={() => setStep(2)} className="btn-primary" disabled={!form.name || !form.email || !form.phone}>
            Next Step
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="dr-diagnosis" className="label-text">Diagnosis *</label>
              <select id="dr-diagnosis" required value={form.diagnosisType} onChange={(e) => update('diagnosisType', e.target.value)} className="input-field">
                <option value="">Select...</option>
                <option value="Type 2 Diabetes">Type 2 Diabetes</option>
                <option value="Prediabetes">Prediabetes</option>
                <option value="Metabolic Syndrome">Metabolic Syndrome</option>
                <option value="Not yet diagnosed but concerned">Not yet diagnosed but concerned</option>
              </select>
            </div>
            <div>
              <label htmlFor="dr-years" className="label-text">Years Since Diagnosis</label>
              <select id="dr-years" value={form.yearsWithDiagnosis} onChange={(e) => update('yearsWithDiagnosis', e.target.value)} className="input-field">
                <option value="">Select...</option>
                <option value="Less than 1 year">Less than 1 year</option>
                <option value="1-5 years">1-5 years</option>
                <option value="5-10 years">5-10 years</option>
                <option value="10+ years">10+ years</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="dr-meds" className="label-text">Current Medications (if any)</label>
            <input id="dr-meds" type="text" value={form.currentMedications} onChange={(e) => update('currentMedications', e.target.value)} className="input-field" placeholder="List current diabetes-related medications" />
          </div>
          <div>
            <label htmlFor="dr-goals" className="label-text">What are your goals? *</label>
            <textarea id="dr-goals" required rows={3} value={form.goals} onChange={(e) => update('goals', e.target.value)} className="input-field resize-y" placeholder="What would you most like to achieve through this program?" />
          </div>
          <div>
            <label htmlFor="dr-questions" className="label-text">Any questions for us?</label>
            <textarea id="dr-questions" rows={2} value={form.questions} onChange={(e) => update('questions', e.target.value)} className="input-field resize-y" />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="btn-secondary">Back</button>
            <button type="submit" disabled={status === 'loading'} className="btn-primary disabled:opacity-60">
              {status === 'loading' ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
          {status === 'error' && <p className="text-sm text-red-600">Something went wrong. Please try again.</p>}
        </div>
      )}

      <p className="text-small text-neutral-500 text-center mt-4 flex items-center justify-center gap-1.5">
        <svg className="w-4 h-4 text-brand-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        Your information is secure and HIPAA-compliant.{' '}
        <a href="/notice-of-privacy-practices" className="underline hover:text-brand-600 transition-colors">Privacy Practices</a>
      </p>
    </form>
  );
}
