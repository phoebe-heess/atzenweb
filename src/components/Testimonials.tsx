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
  location: string;
}

const FALLBACK_TESTIMONIALS_RAW: RawTestimonial[] = [
  {
    id: 't1',
    textDE: "Endlich ein Bier, das schmeckt wie früher. Schön süffig und naturtrüb direkt vom Fass am Pflaster.",
    textEN: "Finally a beer that tastes like the good old days. Incredibly drinkable and beautifully cloudy straight on the pavement.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
    name: "Lukas Schmidt",
    role: "Kneipen-Gänger, Nürnberg",
    location: "nurnberg",
  },
  {
    id: 't2',
    textDE: "Atzengold hat die Berliner Späti-Seele nach Fürth gebracht. Der beste Begleiter für lange Nächte am Heizhaus.",
    textEN: "Atzengold brought the Berlin Späti soul to Franconia. The absolute best companion for long nights near Heizhaus.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
    name: "Moritz Reinhardt",
    role: "Späti-Liebhaber, Fürth",
    location: "furth",
  },
  {
    id: 't3',
    textDE: "Unglaublich süffig und herrlich unfiltriert. Die Kohlensäure ist perfekt ausbalanciert – extrem gefährlich lecker!",
    textEN: "Unbelievably smooth and delightfully unfiltered. Carbonation is spot on – extremely dangerously delicious!",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
    name: "Sarah König",
    role: "Atzin vom Dienst, Berlin",
    location: "berlin",
  },
  {
    id: 't4',
    textDE: "Als Franke bin ich beim Bier echt wählerisch. Aber das Atzengold Hell hat mich absolut umgehauen.",
    textEN: "Being Franconian, I am very picky about my cellar beers. But Atzengold completely blew me away.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80",
    name: "Jonas Bergmann",
    role: "Stammgast, Gostenhof",
    location: "nurnberg",
  },
  {
    id: 't5',
    textDE: "Einfach ehrlich. Kein Schnickschnack. Schmeckt am besten im Sonnenuntergang auf der Bordsteinkante.",
    textEN: "Simply honest. No nonsense. Tastes best during sunset sitting directly on the pavement curb.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80",
    name: "Max Krüger",
    role: "Pavement-Genießer, Berlin",
    location: "berlin",
  },
  {
    id: 't6',
    textDE: "Das Design der Flasche hat mich angelockt, der ehrliche Geschmack hat mich zum Fan gemacht. Ein Hoch auf die Atzen!",
    textEN: "The bottle art drew me in, the honest flavor made me a lifelong fan. Cheers to the Atzen!",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80",
    name: "Elena Wagner",
    role: "Atzin der ersten Stunde, Nürnberg",
    location: "nurnberg",
  },
  {
    id: 't7',
    textDE: "Egal ob beim Grillen an der Pegnitz oder Späti-Tour in Kreuzberg: Atzengold gehört einfach dazu.",
    textEN: "Whether grilling by the Pegnitz river or doing a Späti tour in Kreuzberg, Atzold is always there.",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&h=100&q=80",
    name: "Farhan Ali",
    role: "Pegnitz-Griller, Nürnberg",
    location: "nurnberg",
  },
  {
    id: 't8',
    textDE: "Ein ehrliches fränkisches Kellerbier mit der perfekten Portion Berliner Schnauze. Das neue Standardbier bei uns.",
    textEN: "An honest Franconian Kellerbier with a perfect portion of Berlin character. Our new go-to standard.",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=100&h=100&q=80",
    name: "Sina Beck",
    role: "Biergarten-Fan, Erlangen",
    location: "erlangen",
  },
  {
    id: 't9',
    textDE: "Gekühlt am besten, aber läuft auch lauwarm an der Ecke runter wie Öl. Absoluter Atzen-Klassiker.",
    textEN: "Best when chilled, but flows down like oil even lukewarm at the corner. Absolute Atzen classic.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&h=100&q=80",
    name: "Hassan Al-Saeed",
    role: "Bordstein-Philosoph, Fürth",
    location: "furth",
  }
];

export default function Testimonials({ lang = 'de' }: { lang?: string }) {
  const [rawTestimonials, setRawTestimonials] = useState<RawTestimonial[]>(FALLBACK_TESTIMONIALS_RAW);

  useEffect(() => {
    fetchTestimonials().then(data => { if (data) setRawTestimonials(data); });
  }, []);

  const testimonials: TestimonialType[] = useMemo(() => {
    const isEn = lang === 'en';
    return rawTestimonials.map(t => ({
      text: isEn ? t.textEN : t.textDE,
      image: t.image,
      name: t.name,
      role: t.role,
      location: t.location as TestimonialType['location'],
    }));
  }, [rawTestimonials, lang]);

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
