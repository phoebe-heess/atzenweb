import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';

const Bottle3D = lazy(() => import('./Bottle3D'));
import { motion, AnimatePresence, useInView, animate } from 'motion/react';
import { 
  History, 
  Map, 
  UserCheck, 
  TrendingUp, 
  Compass, 
  Flame, 
  Users, 
  Tv, 
  Infinity, 
  ArrowRight,
  Sparkles,
  Award,
  MapPin,
  Play
} from 'lucide-react';
import { fetchStory } from '../lib/public-api';
import { StoryNode } from '../types';
import { translations } from '../constants/translations';
import { WheatDivider } from './ornaments/WheatDivider';
import HeritageCrests from './HeritageCrests';
import fallbackStory from '../data/story.json';

const AnimatedGauge = ({ label, targetValue, colorClass, textColorClass, delay = 0 }: { label: string, targetValue: number, colorClass: string, textColorClass: string, delay?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        animate(0, targetValue, {
          duration: 2,
          ease: "easeOut",
          onUpdate: (latest) => setDisplayValue(Math.round(latest))
        });
      }, delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isInView, targetValue, delay]);

  return (
    <div ref={ref}>
      <div className="flex justify-between items-baseline mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-ink dark:text-canvas">{label}</span>
        <span className={`text-sm font-mono font-bold ${textColorClass}`}>{displayValue}%</span>
      </div>
      <div className="flex gap-1.5 h-3">
        {Array.from({ length: 10 }).map((_, i) => {
          const threshold = i * 10 + 5;
          const isFilled = displayValue >= threshold;
          return (
            <div 
              key={i} 
              className={`flex-1 rounded-full transition-colors duration-300 ${isFilled ? colorClass : 'bg-ink/5 dark:bg-canvas/20'}`}
            />
          );
        })}
      </div>
    </div>
  );
};

// High performance timeline story nodes

const ICON_LOOKUP: Record<string, React.ComponentType<{ className?: string }>> = {
  'Map': Map,
  'Compass': Compass,
  'Users': Users,
  'Infinity': Infinity,
  'Award': Award
};

interface StoryAndBrewProps {
  lang: 'de' | 'en';
}

export default function StoryAndBrew({ lang }: StoryAndBrewProps) {
  const t = translations[lang];
  const [storyNodes, setStoryNodes] = useState<StoryNode[]>(fallbackStory as StoryNode[]);
  const [activeNodeIndex, setActiveNodeIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchStory().then(data => { if (data) setStoryNodes(data); });
  }, []);

  // Track active nodes using IntersectionObserver for precise 50% viewport crossing
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px", // Trigger exactly at 50% viewport height
      threshold: 0
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idStr = entry.target.getAttribute('data-story-id');
          if (idStr) {
            const id = parseInt(idStr, 10);
            const index = storyNodes.findIndex(node => node.id === id);
            if (index !== -1) {
              setActiveNodeIndex(index);
            }
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    const targets = document.querySelectorAll('[data-story-node-desktop]');
    targets.forEach(target => observer.observe(target));

    return () => {
      observer.disconnect();
    };
  }, []);

  const renderVisualCardInner = (node: StoryNode, mediaOnly: boolean = false) => {
    const IconComp = ICON_LOOKUP[node.image];
    return (
      <>
        {/* Background Watermark Icon */}
        <div className="absolute top-0 right-0 p-8 text-ink/5 pointer-events-none">
          {IconComp ? <IconComp className="h-44 w-44" /> : null}
        </div>

        {/* Brand Sign Mashup */}
        <div className="flex items-start gap-4 pb-6 mb-6">
          {/* Simulated Yellow German District Sign "Fürth Atzenhof" */}
          <div className="bg-accent p-3 text-on-accent transform -rotate-2 flex-1 text-center font-sans shadow-md" style={{ clipPath: 'polygon(1% 1%, 99% 0%, 100% 98%, 0% 100%)' }}>
            <p className="text-[10px] font-bold tracking-widest uppercase border-b border-on-accent/30 pb-1 mb-1">Stadt Fürth</p>
            <p className="text-xl font-extrabold uppercase font-sans">Atzenhof</p>
            <p className="text-[9px] font-bold tracking-wider mt-1 uppercase">Ortsteil</p>
          </div>

          <div className="h-6 w-6 text-ink shrink-0 font-mono text-center flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-accent animate-glitch" />
          </div>

          {/* Simulated Berlin Subway Sign Style */}
          <div className="bg-ink p-4 text-canvas transform rotate-3 flex-1 text-center shadow-md rounded-sm">
            <p className="text-xs font-mono tracking-widest uppercase leading-none opacity-90">SUBWAY LINE</p>
            <p className="text-lg font-black tracking-tight mt-1 font-sans">U Kreuzberg</p>
            <span className="inline-block mt-2 bg-accent text-[8px] font-mono text-on-accent font-bold px-2 py-0.5 rounded-sm">
              ATZE DISTRICT
            </span>
          </div>
        </div>

        {/* Story Description Text */}
        {!mediaOnly && (
          <div className="space-y-4 relative z-10">
            <span className="text-xs font-mono text-on-accent font-bold uppercase tracking-widest px-3 py-1 bg-accent transform -rotate-1 inline-block shadow-sm">
              Node #{node.id} // {node.year}
            </span>
            
            <h3 className="text-4xl font-handwritten font-bold text-primary tracking-tight normal-case">
              {lang === 'en' ? node.titleEn : node.title}
            </h3>
            
            <p className="text-sm leading-relaxed text-ink-secondary dark:text-canvas/80 font-sans">
              {lang === 'en' ? node.textEn : node.text}
            </p>
          </div>
        )}

        {/* Model Transparency Banner */}
        {!mediaOnly && (
          <div className="mt-8 border-t border-ink/10 dark:border-canvas/10 pt-6 flex items-center justify-between text-xs font-mono text-ink-mute dark:text-canvas/60">
            <span className="font-bold">Model: {lang === 'en' ? 'Cuckoo Brewing' : 'Kuckucks-Brauverfahren'}</span>
            <span className="text-accent font-bold">● 100% Transparent</span>
          </div>
        )}
      </>
    );
  };

  return (
    <section id="story-narrative" className="relative bg-canvas dark:bg-primary-deep py-24 px-6 md:px-12 bg-texture-paper">
      
      <div className="relative mx-auto max-w-7xl">
        
        {/* Section Header - Full Width (desktop: text left, bottle right) */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 mb-16">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 bg-accent text-on-accent px-4 py-2 text-xs font-bold uppercase animate-stamp" style={{ clipPath: 'polygon(2% 0%, 98% 2%, 100% 98%, 0% 100%)' }}>
              <History className="h-4 w-4" />
              {t.storyTitle}
            </div>
            <p className="text-sm font-bold text-ink dark:text-canvas uppercase tracking-wider font-mono opacity-80">
              {lang === 'en' ? 'BORN IN FRANCONIA, REARED ON STREETS' : 'IN FRANKEN GEBOREN, AUF DER STRASSE DAHEIM'}
            </p>
            <h3 className="text-display-xl mt-2 text-ink dark:text-canvas mb-4 font-handwritten font-bold normal-case">
              {lang === 'en' ? 'Slang meets tradition' : 'Wo Atze auf Tradition trifft'}
            </h3>
            <div className="space-y-4 text-body-md text-ink-secondary dark:text-canvas/80">
              {t.storySubtitle.split('\n\n').map((paragraph, index, arr) => {
                const isLast = index === arr.length - 1;
                if (isLast) {
                  return (
                    <p key={index} className="font-handwritten text-3xl text-accent font-bold mt-4 animate-pulse">
                      {paragraph}
                    </p>
                  );
                }
                return (
                  <p key={index} className="leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>
          <div className="hidden lg:flex lg:col-span-5 items-center justify-center min-h-[400px]">
            <Suspense fallback={
              <div className="w-full aspect-[3/4] rounded-xl bg-ink/5 dark:bg-canvas/5 animate-pulse flex items-center justify-center">
                <span className="text-xs font-mono text-ink/30 dark:text-canvas/30">Loading 3D bottle...</span>
              </div>
            }>
              <Bottle3D
                labels={{
                  shoulder: '/labels/Artzengold_Georgenbraeu_Hals_Dez25.webp',
                  body: '/labels/Artzengold_Georgenbraeu_Bauch_Dez25.webp',
                  back: '/labels/Artzengold_Georgenbraeu_Ruecken_Dez25.webp',
                }}
                autoRotate={true}
                className="w-[min(92vw,500px)] h-[min(64vh,560px)]"
              />
            </Suspense>
          </div>
        </div>

        {/* Desktop Sticky Scroll Reveal Layout (lg and above) */}
        <div ref={containerRef} className="hidden lg:grid grid-cols-12 gap-12 items-start relative w-full mb-24">
          
          {/* Scrollable Timeline Nodes (Left Side, 6 Cols) */}
          <div className="col-span-6 relative pl-8 ml-4 border-l-2 border-dashed border-ink/20">
            {storyNodes.map((node, index) => {
              const isActive = index === activeNodeIndex;
              return (
                <motion.div
                  key={node.id}
                  data-story-node-desktop
                  data-story-id={node.id}
                  initial={{ opacity: 0.3 }}
                  animate={{ 
                    opacity: isActive ? 1 : 0.3
                  }}
                  transition={{ duration: 0.4 }}
                  className="relative min-h-[55vh]"
                >
                  <div className="flex items-start gap-8 relative pt-[15vh]">
                    {/* Sticky Date/Year Column (col-span-3 equivalent) */}
                    <div className="sticky top-[15vh] z-20 self-start flex items-center shrink-0 w-24">
                      {node.gifUrl && (
                        <img
                          src={node.gifUrl}
                          alt=""
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                          className="w-9 h-9 rounded-md object-cover border-2 border-accent shadow-sm mr-2 shrink-0"
                        />
                      )}
                      {/* Timeline Dot (Sticks together with the year badge) */}
                      <div 
                        className={`absolute left-[-33px] top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-2 transition-all duration-300 ${
                          isActive 
                            ? 'bg-accent border-accent scale-125 shadow-lg shadow-accent/20' 
                            : 'bg-canvas dark:bg-primary-deep border-ink/30 dark:border-canvas/30'
                        }`}
                      />

                      {/* Sticky Year Badge - Sticker Effect */}
                      <span className={`year-sticker font-display font-extrabold italic text-sm px-3 py-1.5 transform -rotate-1 transition-all duration-300 ${
                        isActive 
                          ? 'scale-110' 
                          : 'opacity-50'
                      }`}>
                        {node.year}
                      </span>
                    </div>

                    {/* Description and Title Column (col-span-9 equivalent) */}
                    <div className="relative flex-1 pb-16">
                      {/* Large Year Watermark */}
                      <span className="absolute left-0 -top-12 text-7xl font-mono font-black text-ink/5 dark:text-canvas/5 select-none pointer-events-none">
                        {node.year}
                      </span>

                      <div className="relative z-10 space-y-2 pt-1">
                        <span className={`text-xs font-bold font-mono uppercase tracking-wider block transition-colors duration-300 ${
                          isActive ? 'text-accent' : 'text-ink-mute dark:text-canvas/40'
                        }`}>
                          {lang === 'en' ? node.taglineEn : node.tagline}
                        </span>
                        <h4 className={`text-3xl font-handwritten font-bold transition-colors duration-300 normal-case ${
                          isActive ? 'text-primary' : 'text-ink-mute dark:text-canvas/40'
                        }`}>
                          {lang === 'en' ? node.titleEn : node.title}
                        </h4>
                        <p className={`text-sm leading-relaxed mt-4 transition-colors font-sans ${
                          isActive ? 'text-ink-secondary dark:text-canvas/80' : 'text-ink-mute dark:text-canvas/40'
                        }`}>
                          {lang === 'en' ? node.textEn : node.text}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Sticky Visual Card Panel (Right Side, 6 Cols) */}
          <div className="col-span-6 sticky top-[20vh] h-[60vh] flex flex-col justify-center self-start">
            <div className="relative w-full">
              <div className="bg-canvas dark:bg-brand-dark-900 border border-ink/10 dark:border-canvas/10 shadow-xl p-8 flex flex-col justify-between min-h-[420px] relative rounded-sm transform rotate-1 w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeNodeIndex}
                    initial={{ opacity: 0, y: -20, scale: 1.05, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(8px)' }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col justify-between h-full flex-1"
                  >
                    {renderVisualCardInner(storyNodes[activeNodeIndex])}
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Decorative background border */}
              <div className="absolute -inset-4 border border-ink/20 dark:border-canvas/20 transform -rotate-1 z-[-1] rounded-sm pointer-events-none"></div>
            </div>
          </div>

        </div>

        {/* Mobile Stacked Timeline Layout (less than lg) */}
        <div className="block lg:hidden space-y-10 mb-24 pl-6 ml-2 border-l-2 border-dashed border-ink/20">
          {storyNodes.map((node) => (
            <div key={node.id} className="relative">
              {/* Timeline Dot */}
              <div className="absolute left-[-33px] top-2 h-4 w-4 rounded-full border-2 bg-accent border-accent shadow-sm" />

              <div className="space-y-4">
                {/* Embedded Visual Collage Card (Acts as Image fallback) */}
                <motion.div
                  initial={{ opacity: 0, y: 30, filter: 'blur(8px)', scale: 1.05 }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
                  viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="relative max-w-md w-full pt-4"
                >
                  <div className="bg-canvas dark:bg-brand-dark-900 border border-ink/10 dark:border-canvas/10 shadow-lg p-6 flex flex-col justify-between min-h-[220px] relative rounded-sm transform rotate-1 w-full">
                    {renderVisualCardInner(node, true)}
                  </div>
                  {/* Decorative background border */}
                  <div className="absolute -inset-2 border border-ink/20 dark:border-canvas/20 transform -rotate-1 z-[-1] rounded-sm pointer-events-none"></div>
                </motion.div>

                {/* Narrative Text Block */}
                <div className="space-y-2 max-w-md">
                  <div className="flex items-center gap-2">
                    {node.gifUrl && (
                      <img
                        src={node.gifUrl}
                        alt=""
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                        className="w-8 h-8 rounded-md object-cover border-2 border-accent shadow-sm shrink-0"
                      />
                    )}
                    <span className="year-sticker font-display font-extrabold italic text-xs px-2 py-1 transform -rotate-1">
                      {node.year}
                    </span>
                  </div>
                  <span className="ml-3 text-xs font-bold font-mono uppercase tracking-wider text-ink-mute dark:text-canvas/60">
                    {lang === 'en' ? node.taglineEn : node.tagline}
                  </span>
                  <h4 className="text-3xl font-handwritten font-bold mt-2 text-primary normal-case">
                    {lang === 'en' ? node.titleEn : node.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-ink-secondary dark:text-canvas/80 mt-3 font-sans">
                    {lang === 'en' ? node.textEn : node.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center w-full my-16">
            <WheatDivider className="text-ink/30 dark:text-canvas/20 w-full max-w-sm" />
        </div>

        <HeritageCrests lang={lang} />

        {/* The Beer Characteristics & Breakdown Visualizer */}
        <div className="bg-canvas dark:bg-brand-dark-900 border border-ink/10 dark:border-canvas/10 shadow-2xl p-8 md:p-12 mt-16 rounded-md wheatpaste-poster">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              <div className="lg:col-span-6 space-y-8">
                <div>
                  <span className="inline-flex items-center gap-1.5 bg-ink dark:bg-canvas text-canvas dark:text-ink text-xs font-mono font-bold uppercase px-3 py-1.5 rounded-sm shadow-sm animate-stamp transform -rotate-1">
                    <Award className="h-4 w-4 text-accent" /> REINHEITSGEBOT 1516
                  </span>
                  <h3 className="text-display-xl text-ink dark:text-canvas tracking-tight mt-6 font-handwritten font-bold normal-case">
                    {t.brewTitle}
                  </h3>
                  <p className="text-body-lg text-ink-secondary dark:text-canvas/80 mt-4 max-w-lg leading-relaxed">
                    {t.brewSubtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                  {/* Card 1: ABV */}
                  <div className="bg-accent text-on-accent p-6 rounded-md shadow-sm border border-accent-hover hover:-translate-y-1 hover:shadow-md transition-all">
                      <span className="text-xs font-bold uppercase font-handwritten tracking-widest opacity-80">{t.brewAbv}</span>
                      <p className="text-sm font-bold mt-3 leading-snug">{t.brewAbvDesc}</p>
                  </div>

                  {/* Card 2: Unfiltered */}
                  <div className="bg-ink dark:bg-brand-dark-950 text-canvas p-6 rounded-md shadow-sm hover:-translate-y-1 hover:shadow-md transition-all" style={{animationDelay: '100ms'}}>
                      <span className="text-xs font-bold uppercase font-handwritten tracking-widest text-canvas/60">{t.brewUnfiltered}</span>
                      <p className="text-sm font-bold mt-3 leading-snug text-canvas/90">{t.brewUnfilteredDesc}</p>
                  </div>
                </div>
              </div>

              {/* Flavor Gauges Chart Breakdown */}
              <div className="lg:col-span-6 bg-canvas dark:bg-brand-dark-900 border border-ink/10 dark:border-canvas/10 shadow-lg p-8 space-y-8 rounded-md relative z-40 overflow-hidden group">
                
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-110" />
                
                <h4 className="text-2xl font-handwritten text-ink dark:text-canvas uppercase tracking-widest flex items-center gap-2 border-b border-ink/10 dark:border-canvas/10 pb-4 font-bold relative z-10">
                  <Flame className="h-5 w-5 text-accent" />
                  {t.flavorTitle}
                </h4>

                <div className="space-y-6 relative z-10">
                  <AnimatedGauge 
                    label={t.flavorYeast} 
                    targetValue={85} 
                    colorClass="bg-accent" 
                    textColorClass="text-accent" 
                    delay={0}
                  />
                  <AnimatedGauge 
                    label={t.flavorHops} 
                    targetValue={60} 
                    colorClass="bg-ink dark:bg-canvas" 
                    textColorClass="text-ink dark:text-canvas" 
                    delay={0.2}
                  />
                  <AnimatedGauge 
                    label={t.flavorCitrus} 
                    targetValue={45} 
                    colorClass="bg-primary dark:bg-[oklch(0.55_0.12_150.0)]" 
                    textColorClass="text-primary dark:text-[oklch(0.7_0.12_150.0)]" 
                    delay={0.4}
                  />
                </div>

                <div className="mt-8 bg-accent p-6 text-sm text-on-accent font-bold font-mono rounded-md shadow-md transform rotate-1 hover:rotate-0 transition-transform duration-300 relative z-10">
                  {lang === 'en' 
                    ? '"Very natural first-sip. Pours delicately cloudy golden-yellow. Balanced malt sweets transition into a remarkably crisp, floral citrus bite, triggering endless drinkability!"' 
                    : '"Naturtrüber Genuss auf höchstem Niveau. Ein feiner herber Abgang paart sich mit weicher Fülle und lebendiger Kohlensäure – extrem gefährlich süffig!"'}
                </div>

              </div>

            </div>
        </div>

        <div className="flex justify-center w-full my-16">
           <WheatDivider className="text-ink/30 dark:text-canvas/20 w-full max-w-sm" flip />
        </div>

        {/* Transparent Cuckoo Brewery Section */}
        <div className="bg-texture-paper dark:bg-brand-dark-900 border border-ink/10 dark:border-canvas/10 shadow-xl p-8 md:p-12 mt-16 overflow-hidden relative rounded-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 bg-ink dark:bg-canvas text-canvas dark:text-ink px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-sm shadow-sm">
                  <Users className="h-4 w-4" />
                  100% Transparent // Kuckucksbrauer
                </div>
                
                <h3 className="text-display-xl text-ink dark:text-canvas tracking-tight leading-none font-handwritten font-bold normal-case">
                  {lang === 'en' ? 'The Cuckoo Brewery Model' : 'Das Kuckucksbrauer-Prinzip'}
                </h3>
                
                <p className="text-body-md text-ink-secondary dark:text-canvas/80 font-bold">
                  {lang === 'en'
                    ? "At Atzengold, we prioritize liquid quality and regional collaboration over heavy industrial machinery. We do not own expensive steel factories — and that's a good thing. We rent idle tanks and fermenters from small family breweries in Upper Franconia and have them brew to our own recipe there."
                    : "Bei Atzengold steht das Produkt und die regionale Verbundenheit im Mittelpunkt, nicht tonnenschwere Industrieanlagen. Wir besitzen keine millionenschweren Fabriken. und das ist auch gut so. Wir mieten freie, ungenutzte Sudkessel und Gärtanks bei kleinen Familienbrauereien in Oberfranken und lassen dort nach unserem eigenen Rezept brauen."}
                </p>

                <p className="text-sm text-ink-secondary dark:text-canvas/70 font-bold italic border-l-2 border-accent pl-4">
                  {lang === 'en'
                    ? "We don't have our own brewery, and that's a good thing. Why build more plants and take money from venture capitalists who already have plenty of cash, when you can team up with absolutely fantastic small Franconian breweries that make damn good beer and are, in some cases, not doing so well economically right now."
                    : "Wir haben keine eigene Brauerei, und das ist auch gut so. Denn warum weitere Anlagen aufbauen und dafür Geld von Venture Capitalisten nehmen, die eh schon genügend Kohle haben, wenn man doch mit ganz fantastischen kleinen fränkischen Brauereien zusammenarbeiten kann, die saugutes Bier machen und denen es teilweise wirtschaftlich gerade gar nicht so gut geht."}
                </p>

                <a
                  href="https://youtube.com/shorts/ASD8RRXFL4A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-accent text-on-accent px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm shadow-md hover:bg-accent-hover hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all border-2 border-ink cursor-pointer"
                >
                  <Play className="h-5 w-5 fill-current" />
                  {lang === 'en'
                    ? "Here's a look inside our partner brewery St. Georgenbräu in Buttenheim"
                    : 'Hier ein Einblick in unsere Partnerbrauerei St. Georgenbräu in Buttenheim'}
                </a>
                
                <div className="space-y-4 pt-6 border-t border-ink/10 dark:border-canvas/10">
                  <h4 className="text-sm font-mono text-ink dark:text-canvas uppercase tracking-widest font-black">
                    {lang === 'en' ? 'Why Cuckoo Brewing Matters:' : 'Die handfesten Vorteile für dich & die Region:'}
                  </h4>
                  
                  <ul className="space-y-4 text-xs font-mono text-ink-secondary dark:text-canvas/70 font-bold">
                    <li className="flex items-start gap-3">
                      <span className="text-accent text-lg">✓</span>
                      <span>
                        {lang === 'en' 
                          ? 'Empowering Independent Heritage: We financially support small, local family-owned Bavarian breweries instead of major corporate conglomerates.' 
                          : 'Erhalt der Braukultur: Wir unterstützen gezielt kleine, freie fränkische Familienbetriebe statt anonymer Braukonzerne.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent text-lg">✓</span>
                      <span>
                        {lang === 'en' 
                          ? 'Eco-Logical Resource Recycling: No heavy steel factory production means we reduced our direct CO2 setup footprint by an incredible 40%.' 
                          : 'Öko-Ressourceneffizienz: Durch die Nutzung bestehender Kessel entfällt schwerer Fabrikbau – das senkt den CO²-Footprint um über 40%.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent text-lg">✓</span>
                      <span>
                        {lang === 'en' 
                          ? 'Master-Grade Execution: Brewed with traditional double-decoction mashing under strict supervision of certified Master Brewers.' 
                          : 'Meisterhafte Qualität: Gebraut im klassischen Zweimaischverfahren unter den Augen fränkischer Braumeister.'}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-ink/10 dark:border-canvas/10 pt-6 flex items-center gap-4">
                  <div className="h-12 w-12 bg-ink dark:bg-canvas flex items-center justify-center font-mono text-sm text-canvas dark:text-ink font-black rounded-full shadow-md">
                    G
                  </div>
                  <div>
                    <p className="text-sm font-black text-ink dark:text-canvas uppercase leading-none">Gabriel</p>
                    <p className="text-xs font-mono text-ink-mute dark:text-canvas/50 font-bold mt-1 uppercase">Founder, Atzengold</p>
                  </div>
                </div>
              </div>

              {/* Photos & Authenticity Row */}
              <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Photo Card 1 */}
                <div className="bg-canvas dark:bg-brand-dark-900 shadow-lg p-3 hover:-translate-y-1 transition-all rounded-sm transform rotate-1">
                  <div className="relative h-56 md:h-64 mb-4 overflow-hidden rounded-sm">
                    <img 
                      src="https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?auto=format&fit=crop&w=800&q=80" 
                      alt="Gabriel on the brew deck" 
                      className="w-full h-full object-cover filter grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-3 left-3 bg-canvas/90 dark:bg-brand-dark-900/90 backdrop-blur-sm text-ink dark:text-canvas text-[10px] font-mono font-bold py-1.5 px-3 rounded-full shadow-sm flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-accent" /> Buttenheim
                    </span>
                  </div>
                  
                  <div className="space-y-2 px-1 pb-2">
                    <h4 className="text-sm font-black text-ink dark:text-canvas uppercase flex items-center gap-2 font-mono">
                      <Sparkles className="h-4 w-4 text-accent" />
                      {lang === 'en' ? 'Gabriel & Master Hans' : 'Gabriel & Braumeister Hans'}
                    </h4>
                    <p className="text-xs text-ink-secondary dark:text-canvas/80 font-bold leading-relaxed font-sans">
                      {lang === 'en'
                        ? 'Gabriel working side by side with brewery master Hans-Dieter checking warm wort parameters on the mashing deck.'
                        : 'Gabriel arbeitet Seite an Seite mit Braumeister Hans-Dieter. Gemeinsam prüfen sie die Würzequalität direkt am Sudkessel.'}
                    </p>
                  </div>
                </div>

                {/* Photo Card 2 */}
                <div className="bg-canvas dark:bg-brand-dark-900 shadow-lg p-3 hover:-translate-y-1 transition-all rounded-sm transform -rotate-2 mt-4 md:mt-12">
                  <div className="relative h-56 md:h-64 mb-4 overflow-hidden rounded-sm">
                    <img 
                      src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80" 
                      alt="Gabriel inspecting Kellerbier" 
                      className="w-full h-full object-cover filter grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-3 left-3 bg-canvas/90 dark:bg-brand-dark-900/90 backdrop-blur-sm text-ink dark:text-canvas text-[10px] font-mono font-bold py-1.5 px-3 rounded-full shadow-sm flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-accent" /> Vault Cellar
                    </span>
                  </div>
                  
                  <div className="space-y-2 px-1 pb-2">
                    <h4 className="text-sm font-black text-ink dark:text-canvas uppercase flex items-center gap-2 font-mono">
                      <Award className="h-4 w-4 text-accent" />
                      {lang === 'en' ? 'Cold Cellar Care' : 'Kalte Kellersorgung'}
                    </h4>
                    <p className="text-xs text-ink-secondary dark:text-canvas/80 font-bold leading-relaxed font-sans">
                      {lang === 'en'
                        ? 'Gabriel personally oversees the naturally cloudy fermentation inside traditional cold cellars to preserve all organic nutrients.'
                        : 'Gabriel kontrolliert die Gärung im kalten Felsenkeller. So bleibt Atzengold eiskalt naturbelassen, vitaminreich und voll im Geschmack.'}
                    </p>
                  </div>
                </div>

              </div>
            </div>
        </div>

      </div>
    </section>
  );
}
