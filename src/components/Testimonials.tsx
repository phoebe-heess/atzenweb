import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { TestimonialsColumn, TestimonialType } from '@/components/ui/testimonials-columns-1';
import { fetchTestimonials } from '../lib/public-api';

interface RawTestimonial {
  id: string;
  name: string;
  role: string;
  textDE: string;
  textEN: string;
  image: string;
  location?: string;
  untappdUrl?: string;
}

// Echte Untappd-Bewertungen (von Gabriel zugeschickt).
const dicebearAvatar = (name: string) =>
  `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=d4af37&textColor=1a1a1a`;

const FALLBACK_TESTIMONIALS_RAW: RawTestimonial[] = [
  {
    id: 't1',
    name: 'Andreas Opitz',
    role: 'Untappd Review',
    textDE: 'Ein richtig geiles handwerkliches Bier. Getreidig-malzig, a bissel Butter, Kellerfeuchte, ein leichter Einschlag von Karamell und Vanille, im Antrunk Fruchtsüße. Weiter so!',
    textEN: 'A really great craft beer. Grainy-malty, a touch of butter, cellar dampness, a light hint of caramel and vanilla, with fruity sweetness on the first sip. Keep it up!',
    image: dicebearAvatar('Andreas Opitz'),
    location: undefined,
    untappdUrl: 'https://untappd.com/user/cabdriver86/checkin/1576310093',
  },
  {
    id: 't2',
    name: 'Matthias Ress',
    role: 'Untappd Review',
    textDE: 'Süffig. Lecker. Charaktervoll, exotisch. Leicht bitter, hopfig.',
    textEN: 'Smooth drinking. Tasty. Full of character, exotic. Slightly bitter, hoppy.',
    image: dicebearAvatar('Matthias Ress'),
    location: undefined,
    untappdUrl: 'https://untappd.com/user/Ressman/checkin/1576100073',
  },
  {
    id: 't3',
    name: 'fixerfuchs',
    role: 'Untappd Review',
    textDE: 'Mei war des Gut, hätte das ganze Fass getrunken wenn mich keiner gestoppt hätte.',
    textEN: "Man, that was good — I would've drunk the whole keg if nobody had stopped me.",
    image: dicebearAvatar('fixerfuchs'),
    location: undefined,
    untappdUrl: 'https://untappd.com/user/fixerfuchs/checkin/1576491182',
  },
  {
    id: 't4',
    name: 'Matze M',
    role: 'Untappd Review',
    textDE: 'Sehr süffig, wunderbar weich, getreidig und angenehm malzig.',
    textEN: 'Very smooth drinking, wonderfully soft, grainy and pleasantly malty.',
    image: dicebearAvatar('Matze M'),
    location: undefined,
    untappdUrl: 'https://untappd.com/user/Matze_M/checkin/1553617052',
  },
  {
    id: 't5',
    name: 'Flo Luis',
    role: 'Untappd Review',
    textDE: 'Solides Gebräu. Für Helles sogar charakteristische Substanz da, nicht negativ gemeint.',
    textEN: 'Solid brew. Even has notable character for a Helles — meant as a compliment.',
    image: dicebearAvatar('Flo Luis'),
    location: undefined,
    untappdUrl: 'https://untappd.com/user/Ludmanez/checkin/1535741920',
  },
  {
    id: 't6',
    name: 'Toni Debupi',
    role: 'Untappd Review',
    textDE: 'Würziges und leckeres Bierchen.',
    textEN: 'A spicy and tasty little beer.',
    image: dicebearAvatar('Toni Debupi'),
    location: undefined,
    untappdUrl: 'https://untappd.com/user/Tonidebupi/checkin/1524666780',
  },
  {
    id: 't7',
    name: 'Julian P',
    role: 'Untappd Review',
    textDE: "Getreidig-malzig, 'Kellernote', Vanille(pudding) - alles dabei!",
    textEN: "Grainy-malty, a 'cellar note', vanilla (pudding) — it's all there!",
    image: dicebearAvatar('Julian P'),
    location: undefined,
    untappdUrl: 'https://untappd.com/user/loads0411/checkin/1576310165',
  },
];

export default function Testimonials({ lang = 'de' }: { lang?: string }) {
  const [rawTestimonials, setRawTestimonials] = useState<RawTestimonial[]>(FALLBACK_TESTIMONIALS_RAW);

  useEffect(() => {
    fetchTestimonials().then(data => { if (data && data.length) setRawTestimonials(data); });
  }, []);

  const testimonials: TestimonialType[] = useMemo(() => {
    const isEn = lang === 'en';
    return rawTestimonials.map(t => ({
      text: isEn ? t.textEN : t.textDE,
      image: t.image,
      name: t.name,
      role: t.role,
      location: t.location as TestimonialType['location'],
      untappdUrl: t.untappdUrl,
    }));
  }, [rawTestimonials, lang]);

  // Solange keine echten Untappd-Bewertungen vorliegen, Bereich ausblenden
  // statt erfundene Testimonials zu zeigen.
  if (testimonials.length === 0) {
    return null;
  }

  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

  return (
    <section className="bg-canvas dark:bg-primary-deep py-32 relative overflow-hidden">
      {/* Paper texture overlay */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-multiply pointer-events-none z-0" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/rice-paper-2.png")' }} />
      
      {/* Sunburst background glow - Stronger for visibility */}
      <div className="absolute top-0 left-0 w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_top_left,var(--color-primary)_0%,transparent_60%)] opacity-30 -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_bottom_right,var(--color-accent)_0%,transparent_60%)] opacity-10 -z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[640px] mx-auto text-center"
        >
          <div className="flex justify-center mb-8">
            <span className="bg-accent text-on-accent text-xs font-bold font-mono tracking-widest uppercase py-2 px-6 transform -rotate-2 shadow-sm" style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)' }}>
              {lang === 'en' ? 'Pavement Talk' : 'Bordsteingespräche'}
            </span>
          </div>

          <h2 className="text-display-xl text-ink dark:text-canvas tracking-tight font-handwritten font-bold normal-case">
            {lang === 'en' ? 'What the Atzen Say' : 'Was die Atzen sagen'}
          </h2>
          <p className="text-body-lg text-ink-secondary dark:text-canvas/80 mt-6 max-w-lg">
            {lang === 'en' 
              ? 'Real voices from local street curbs, parks, and beer gardens in Nuremberg, Fürth, and Berlin.' 
              : 'Ehrliche Meinungen von den Bordsteinen, Wiesen und Biergärten Frankens und Berlins.'}
          </p>
        </motion.div>

        {/* Sliding Columns Grid - Tumbling Posters Effect */}
        <div className="flex justify-center gap-8 mt-20 mask-[linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[800px] overflow-hidden perspective-1000">
          <TestimonialsColumn testimonials={firstColumn} duration={18} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block mt-12" duration={24} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block mt-4" duration={20} />
        </div>
      </div>
    </section>
  );
}
