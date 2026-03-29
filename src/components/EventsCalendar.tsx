import { useEffect, useState } from 'react';

// ── Types ────────────────────────────────────────────────────────────────────

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  htmlLink: string;
}

interface Props {
  calendarId: string;
  apiKey: string;
  /** Show only this many events (for homepage preview) */
  limit?: number;
  /** Show the featured hero card for the next event */
  showFeatured?: boolean;
  /** Show the month group headings */
  showMonthHeaders?: boolean;
  /** Compact card style (for homepage embed) */
  compact?: boolean;
  /**
   * If set, only show events whose title contains this string (case-insensitive).
   * Useful for showing only SMA cohort events on the diabetes page.
   * Example: filterKeyword="SMA"
   */
  filterKeyword?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function extractRegistrationUrl(description?: string): string | null {
  if (!description) return null;
  const match = description.match(/https?:\/\/[^\s<>"]+/);
  return match ? match[0] : null;
}

function cleanDescription(description?: string, registrationUrl?: string | null): string {
  if (!description) return '';
  let text = description
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .trim();
  if (registrationUrl) {
    text = text.replace(registrationUrl, '').trim();
    // Clean up leftover labels like "Registration:" or "Register:"
    text = text.replace(/^(registration|register|sign\s*up|link)\s*:\s*/i, '').trim();
  }
  return text;
}

function getEventDate(event: CalendarEvent): Date {
  return new Date(event.start.dateTime || event.start.date || '');
}

function formatMonth(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
}

function formatDay(date: Date): string {
  return date.getDate().toString();
}

function formatWeekday(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
}

function formatTimeRange(start: CalendarEvent['start'], end: CalendarEvent['end']): string {
  if (!start.dateTime) return 'All day';
  const s = new Date(start.dateTime);
  const time = s.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  if (end.dateTime) {
    const e = new Date(end.dateTime);
    const endTime = e.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${time} – ${endTime}`;
  }
  return time;
}

function formatFullDate(start: CalendarEvent['start']): string {
  const d = new Date(start.dateTime || start.date || '');
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function getMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function groupByMonth(events: CalendarEvent[]): [string, CalendarEvent[]][] {
  const groups = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const key = getMonthYear(getEventDate(event));
    const arr = groups.get(key) || [];
    arr.push(event);
    groups.set(key, arr);
  }
  return Array.from(groups.entries());
}

function daysUntil(date: Date): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getCountdownLabel(date: Date): string | null {
  const days = daysUntil(date);
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days <= 14) return `In ${days} days`;
  return null;
}

// ── Date Block ───────────────────────────────────────────────────────────────

function DateBlock({ event, large }: { event: CalendarEvent; large?: boolean }) {
  const date = getEventDate(event);
  const sizeClasses = large ? 'w-20 h-24' : 'w-16 h-20';
  const monthSize = large ? 'text-xs' : 'text-[10px]';
  const daySize = large ? 'text-3xl' : 'text-2xl';
  const wkdaySize = large ? 'text-[10px]' : 'text-[9px]';

  return (
    <div className={`${sizeClasses} rounded-xl bg-brand-50 border border-brand-100 flex flex-col items-center justify-center shrink-0 overflow-hidden`}>
      <span className={`${monthSize} font-bold tracking-widest text-brand-600 uppercase`}>
        {formatMonth(date)}
      </span>
      <span className={`${daySize} font-serif font-bold text-brand-900 leading-none`}>
        {formatDay(date)}
      </span>
      <span className={`${wkdaySize} font-medium tracking-wider text-neutral-400 uppercase mt-0.5`}>
        {formatWeekday(date)}
      </span>
    </div>
  );
}

// ── Featured Hero Event (the very next event) ────────────────────────────────

function FeaturedEvent({ event }: { event: CalendarEvent }) {
  const registrationUrl = extractRegistrationUrl(event.description);
  const description = cleanDescription(event.description, registrationUrl);
  const date = getEventDate(event);
  const countdown = getCountdownLabel(date);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-50 via-white to-lime-50 border border-brand-100 p-6 sm:p-8 md:p-10 shadow-sm mb-10">
      {/* Decorative circles */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-brand-50/60 pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-lime-50/80 pointer-events-none" />

      <div className="relative flex flex-col md:flex-row gap-6 md:gap-8 items-start">
        {/* Date block */}
        <div className="flex flex-col items-center gap-2">
          <DateBlock event={event} large />
          {countdown && (
            <span className="text-xs font-semibold text-brand-600 bg-brand-100 px-2.5 py-0.5 rounded-full whitespace-nowrap">
              {countdown}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700 bg-brand-100 px-3 py-1 rounded-full">
              Coming Up Next
            </span>
          </div>

          <h2 className="font-serif text-h2 text-brand-900 mb-3">
            {event.summary}
          </h2>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-small text-neutral-500 mb-4">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatTimeRange(event.start, event.end)}
            </span>
            {event.location && (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {event.location}
              </span>
            )}
          </div>

          {description && (
            <p className="text-body-lg text-neutral-600 mb-6 max-w-2xl">{description}</p>
          )}

          <div className="flex flex-wrap gap-3">
            {registrationUrl ? (
              <a href={registrationUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Register / Sign Up
              </a>
            ) : (
              <a href="/contact" className="btn-primary">
                Inquire About This Event
              </a>
            )}
            <a href={event.htmlLink} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
              </svg>
              Add to Calendar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Standard Event Card ──────────────────────────────────────────────────────

function EventCard({ event, compact }: { event: CalendarEvent; compact?: boolean }) {
  const registrationUrl = extractRegistrationUrl(event.description);
  const description = cleanDescription(event.description, registrationUrl);

  return (
    <div className="group flex gap-4 sm:gap-5 p-4 sm:p-5 bg-white border border-neutral-100 rounded-xl shadow-sm hover:shadow-md hover:border-brand-200 transition-all duration-300">
      {/* Date block */}
      <DateBlock event={event} />

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <h3 className="font-serif text-h4 text-brand-900 group-hover:text-brand-700 transition-colors mb-1.5 leading-snug">
          {event.summary}
        </h3>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-small text-neutral-500 mb-2">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatTimeRange(event.start, event.end)}
          </span>
          {event.location && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {event.location}
            </span>
          )}
        </div>

        {!compact && description && (
          <p className="text-small text-neutral-600 line-clamp-2 mb-3">{description}</p>
        )}

        <div className="flex flex-wrap gap-2 mt-auto pt-1">
          {registrationUrl ? (
            <a
              href={registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-small font-semibold text-brand-600 hover:text-brand-800 transition-colors"
            >
              Register
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          ) : (
            <a
              href="/contact"
              className="inline-flex items-center gap-1.5 text-small font-semibold text-brand-600 hover:text-brand-800 transition-colors"
            >
              Inquire
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
              </svg>
            </a>
          )}
          <span className="text-neutral-200 hidden sm:inline">|</span>
          <a
            href={event.htmlLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-small font-medium text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
            </svg>
            Add to Cal
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Loading Skeleton ─────────────────────────────────────────────────────────

function Skeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-5 p-5 bg-white border border-neutral-100 rounded-xl animate-pulse">
          <div className="w-16 h-20 rounded-xl bg-neutral-100 shrink-0" />
          <div className="flex-1 space-y-3 py-1">
            <div className="h-5 bg-neutral-100 rounded w-3/4" />
            <div className="h-3 bg-neutral-100 rounded w-1/2" />
            <div className="h-3 bg-neutral-100 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ compact }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="text-center py-8">
        <p className="text-body text-neutral-500">No upcoming events. Check back soon.</p>
      </div>
    );
  }
  return (
    <div className="text-center py-20 max-w-md mx-auto">
      <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5m-9 6v-4.5m0 0l-2.25 2.25M12 14.25l2.25 2.25" />
        </svg>
      </div>
      <h3 className="font-serif text-h3 text-brand-900 mb-3">No Upcoming Events</h3>
      <p className="text-body text-neutral-500 mb-6">
        New program dates and speaking engagements will appear here as they're scheduled.
      </p>
      <a href="/contact" className="btn-secondary">
        Get Notified When Events Are Added
      </a>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function EventsCalendar({
  calendarId,
  apiKey,
  limit,
  showFeatured = true,
  showMonthHeaders = true,
  compact = false,
  filterKeyword,
}: Props) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!calendarId || !apiKey) {
      setError('Calendar not configured yet.');
      setLoading(false);
      return;
    }

    const now = new Date().toISOString();
    // Fetch more than needed when filtering so we always have enough after the filter
    const maxResults = limit ? (filterKeyword ? limit * 5 : limit) : 20;
    const url =
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events` +
      `?key=${apiKey}` +
      `&timeMin=${encodeURIComponent(now)}` +
      `&orderBy=startTime` +
      `&singleEvents=true` +
      `&maxResults=${maxResults}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Calendar API error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        let items: CalendarEvent[] = data.items || [];
        if (filterKeyword) {
          const kw = filterKeyword.toLowerCase();
          items = items.filter((e) => e.summary?.toLowerCase().includes(kw));
        }
        if (limit) {
          items = items.slice(0, limit);
        }
        setEvents(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error('EventsCalendar error:', err);
        setError('Unable to load events right now.');
        setLoading(false);
      });
  }, [calendarId, apiKey, limit]);

  if (loading) return <Skeleton count={compact ? 2 : 3} />;

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-body text-neutral-400">{error}</p>
      </div>
    );
  }

  if (events.length === 0) return <EmptyState compact={compact} />;

  const [featured, ...rest] = events;
  const showHero = showFeatured && !compact && events.length > 0;
  const listEvents = showHero ? rest : events;
  const grouped = showMonthHeaders && !compact ? groupByMonth(listEvents) : null;

  return (
    <div>
      {/* Featured next event */}
      {showHero && featured && <FeaturedEvent event={featured} />}

      {/* Month-grouped list */}
      {grouped ? (
        <div className="space-y-10">
          {grouped.map(([month, monthEvents]) => (
            <div key={month}>
              <div className="flex items-center gap-3 mb-5">
                <h3 className="font-serif text-h4 text-brand-900 whitespace-nowrap">{month}</h3>
                <div className="h-px bg-neutral-200 flex-1" />
              </div>
              <div className="space-y-4">
                {monthEvents.map((event) => (
                  <EventCard key={event.id} event={event} compact={compact} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {listEvents.map((event) => (
            <EventCard key={event.id} event={event} compact={compact} />
          ))}
        </div>
      )}
    </div>
  );
}
