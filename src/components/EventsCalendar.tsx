import { useEffect, useState } from 'react';

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
}

function extractRegistrationUrl(description?: string): string | null {
  if (!description) return null;
  // Find the first http/https URL anywhere in the description
  const match = description.match(/https?:\/\/[^\s<>"]+/);
  return match ? match[0] : null;
}

function cleanDescription(description?: string): string {
  if (!description) return '';
  // Strip HTML tags Sanity may have injected, decode basic entities
  return description
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function formatEventDate(start: CalendarEvent['start'], end: CalendarEvent['end']): string {
  const startVal = start.dateTime || start.date;
  const endVal = end.dateTime || end.date;
  if (!startVal) return '';

  const isAllDay = !start.dateTime;
  const startDate = new Date(startVal);

  const dateStr = startDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  if (isAllDay) return dateStr;

  const timeStr = startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  if (endVal) {
    const endDate = new Date(endVal);
    const endTime = endDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${dateStr} · ${timeStr} – ${endTime}`;
  }

  return `${dateStr} · ${timeStr}`;
}

function EventCard({ event }: { event: CalendarEvent }) {
  const registrationUrl = extractRegistrationUrl(event.description);
  const description = cleanDescription(event.description);
  // Remove the URL from the display description so it's not shown as raw text
  const displayDescription = registrationUrl
    ? description.replace(registrationUrl, '').replace(/^[\s\S]*?:\s*/, '').trim()
    : description;

  return (
    <div className="card hover:border-brand-200 transition-colors">
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
              Upcoming
            </span>
          </div>
          <h3 className="text-h4 font-serif text-brand-900">{event.summary}</h3>
        </div>

        <div className="space-y-2 text-small text-neutral-500">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5 shrink-0 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
            </svg>
            <span>{formatEventDate(event.start, event.end)}</span>
          </div>

          {event.location && (
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 shrink-0 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span>{event.location}</span>
            </div>
          )}
        </div>

        {displayDescription && (
          <p className="text-body text-neutral-600 line-clamp-3">{displayDescription}</p>
        )}

        <div className="flex flex-wrap gap-3 pt-1">
          {registrationUrl ? (
            <a
              href={registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !py-2 !px-4 !text-small"
            >
              Register / Sign Up
            </a>
          ) : (
            <a href="/contact" className="btn-primary !py-2 !px-4 !text-small">
              Inquire About This Event
            </a>
          )}
          <a
            href={event.htmlLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary !py-2 !px-4 !text-small"
          >
            Add to Calendar
          </a>
        </div>
      </div>
    </div>
  );
}

export default function EventsCalendar({ calendarId, apiKey }: Props) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!calendarId || !apiKey) {
      setError('Calendar not configured.');
      setLoading(false);
      return;
    }

    const now = new Date().toISOString();
    const url =
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events` +
      `?key=${apiKey}` +
      `&timeMin=${encodeURIComponent(now)}` +
      `&orderBy=startTime` +
      `&singleEvents=true` +
      `&maxResults=20`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Calendar API error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setEvents(data.items || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Unable to load events right now. Please check back soon.');
        setLoading(false);
      });
  }, [calendarId, apiKey]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-neutral-100 rounded w-1/4 mb-3" />
            <div className="h-6 bg-neutral-100 rounded w-3/4 mb-4" />
            <div className="h-4 bg-neutral-100 rounded w-1/2 mb-2" />
            <div className="h-4 bg-neutral-100 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-body text-neutral-500">{error}</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-16 max-w-lg mx-auto">
        <p className="text-body-lg text-neutral-500 mb-4">No upcoming events scheduled at this time.</p>
        <p className="text-body text-neutral-400 mb-6">
          Subscribe to the newsletter to be notified when new program dates are announced.
        </p>
        <a href="/contact" className="btn-secondary">Get Notified</a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
