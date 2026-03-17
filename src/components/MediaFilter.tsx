import { useState } from 'react';

interface MediaItem {
  title: string;
  type: 'podcast' | 'video' | 'article' | 'press';
  source: string;
  date: string;
  href: string;
  embedId?: string;
}

const typeColors: Record<string, string> = {
  podcast: 'bg-purple-50 text-purple-700 border-purple-100',
  video: 'bg-red-50 text-red-700 border-red-100',
  article: 'bg-blue-50 text-blue-700 border-blue-100',
  press: 'bg-amber-50 text-amber-700 border-amber-100',
};

const typeIcons: Record<string, string> = {
  podcast: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z',
  video: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  article: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
  press: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
};

const filters = ['all', 'podcast', 'video', 'article', 'press'] as const;

export default function MediaFilter({ items }: { items: MediaItem[] }) {
  const [active, setActive] = useState<string>('all');

  const filtered = active === 'all' ? items : items.filter((i) => i.type === active);

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`px-4 py-2 rounded-full text-small font-medium transition-colors ${
              active === f
                ? 'bg-brand-700 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {f === 'all' ? 'All' : f === 'press' ? 'Press' : f.charAt(0).toUpperCase() + f.slice(1) + 's'}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item, i) => (
          <div key={i} className="card group">
            {item.embedId && (
              <div className="aspect-video rounded-brand overflow-hidden mb-4 -mt-2 -mx-2 md:-mt-4 md:-mx-4">
                <iframe
                  src={`https://www.youtube.com/embed/${item.embedId}`}
                  title={item.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  className="w-full h-full"
                />
              </div>
            )}
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeColors[item.type]}`}>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={typeIcons[item.type]} />
                </svg>
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </span>
              <span className="text-xs text-neutral-400">{item.date}</span>
            </div>
            <h3 className="text-h4 font-serif text-brand-900 mb-2 group-hover:text-brand-700 transition-colors">
              <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-2">
                {item.title}
              </a>
            </h3>
            <p className="text-small text-neutral-500">{item.source}</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-neutral-400 py-12">No media items in this category yet.</p>
      )}
    </div>
  );
}
