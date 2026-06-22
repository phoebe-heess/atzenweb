import React from 'react';
import { Instagram } from 'lucide-react';

interface InstagramFeedProps {
  lang: 'de' | 'en';
}

const HEADLINE: Record<'de' | 'en', string> = {
  de: 'Unsere täglichen Abenteuer eine etwas andere Biermarke aufzubauen',
  en: 'Our daily adventures building a slightly different beer brand',
};

const FOLLOW_LABEL: Record<'de' | 'en', string> = {
  de: 'Uns auf Instagram folgen',
  en: 'Follow Us on Instagram',
};

// TODO: replace with the real GIF once supplied (Gabriel: "Das Gif reiche ich nach").
// Expected path: /images/instagram-feed.gif — drop the file in public/images/ and it will appear automatically.
const FEED_GIF_SRC = '/images/instagram-feed.gif';

export default function InstagramFeed({ lang }: InstagramFeedProps) {
  return (
    <section id="instagram-feed" className="py-32 bg-texture-paper text-ink relative overflow-hidden transition-all duration-300">
      {/* Paper texture overlay */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-multiply pointer-events-none z-0" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/rice-paper-2.png")' }} />

      {/* Soft background glows to lift the layout */}
      <div className="absolute top-1/4 left-1/12 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,var(--color-primary)_0%,transparent_70%)] opacity-10 -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/12 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,var(--color-accent)_0%,transparent_70%)] opacity-10 -z-10 pointer-events-none" />

      <div className="mx-auto max-w-4xl px-6 md:px-12 relative z-10 flex flex-col items-center text-center gap-10">

        <div className="inline-flex items-center gap-2 bg-accent text-on-accent px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase shadow-sm transform -rotate-1" style={{ clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0% 100%)' }}>
          <Instagram className="h-4 w-4 text-on-accent" />
          <span>@atzengold</span>
        </div>

        <h2 className="text-display-xl text-ink dark:text-canvas font-handwritten font-bold normal-case max-w-2xl">
          {HEADLINE[lang]}
        </h2>

        {/* Single auto-cycling GIF, clickable through to the real Instagram profile */}
        <a
          href="https://www.instagram.com/atzengold/"
          target="_blank"
          rel="noreferrer"
          className="group relative w-full max-w-md aspect-square rounded-2xl overflow-hidden border border-ink/15 dark:border-canvas/15 shadow-xl bg-ink/5 dark:bg-canvas/5 flex items-center justify-center"
        >
          <img
            src={FEED_GIF_SRC}
            alt="@atzengold auf Instagram"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-brand-dark-900/0 group-hover:bg-brand-dark-900/30 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity px-5 py-2.5 bg-accent text-on-accent rounded-full text-xs font-bold font-mono flex items-center gap-2 shadow-xl">
              <Instagram className="h-4 w-4" />
              {FOLLOW_LABEL[lang]}
            </span>
          </div>
        </a>

        <a
          href="https://www.instagram.com/atzengold/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-on-accent rounded-lg border-4 border-ink px-8 py-4 text-xs sm:text-sm font-sans font-black tracking-wider uppercase transition-all duration-200 shadow-md hover:scale-[1.02] active:scale-95 relative before:absolute before:inset-[3px] before:border before:border-ink before:rounded-[3px] before:pointer-events-none"
        >
          <Instagram className="h-5 w-5 shrink-0 relative z-10" />
          <span className="relative z-10">{FOLLOW_LABEL[lang]}</span>
        </a>

      </div>
    </section>
  );
}
