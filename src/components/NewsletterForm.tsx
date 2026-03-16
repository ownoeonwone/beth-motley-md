import { useState, type FormEvent } from 'react';

export default function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const endpoint = import.meta.env.PUBLIC_NEWSLETTER_ENDPOINT || '#';
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, form: 'newsletter' }),
      });
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className={`text-center py-4 ${dark ? 'text-brand-200' : 'text-brand-700'}`}>
        <p className="font-medium">Welcome! Check your inbox to confirm.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
      <label htmlFor="newsletter-email" className="sr-only">Email address</label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`flex-1 px-4 py-3 rounded-brand text-body transition-all ${
          dark
            ? 'bg-brand-800 border border-brand-700 text-white placeholder:text-brand-400 focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20'
            : 'input-field'
        }`}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-accent whitespace-nowrap disabled:opacity-60"
      >
        {status === 'loading' ? 'Joining...' : 'Subscribe'}
      </button>
      {status === 'error' && (
        <p className="text-sm text-red-400 mt-1">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
