import React, { useState, useEffect } from 'react';
import { 
  Instagram, 
  Heart, 
  MessageCircle, 
  ExternalLink, 
  RefreshCw, 
  MapPin, 
  Loader2,
  Calendar,
  Sparkles,
  Award,
  Check
} from 'lucide-react';
import { translations } from '../constants/translations';

interface InstagramFeedProps {
  lang: 'de' | 'en' | 'de-BY';
}

interface MockPost {
  id: string;
  location: string;
  imageStyle: {
    bgGradient: string;
    glowColor: string;
  };
  visualTheme: 'fresh' | 'spaeti' | 'crew';
  date: string;
  likes: number;
  comments: number;
  captionKey: 'fresh' | 'spaeti' | 'crew';
}

const MOCK_POSTS_DATA: MockPost[] = [
  {
    id: 'post_1',
    location: 'Buttenheim, Bayern',
    imageStyle: {
      bgGradient: 'bg-amber-500',
      glowColor: 'oklch(0.769 0.165 70.1 / 0.25)'
    },
    visualTheme: 'fresh',
    date: '02. Juni 2026',
    likes: 342,
    comments: 18,
    captionKey: 'fresh'
  },
  {
    id: 'post_2',
    location: 'Berlin-Kreuzberg',
    imageStyle: {
      bgGradient: 'bg-pink-600',
      glowColor: 'oklch(0.656 0.212 354.3 / 0.2)'
    },
    visualTheme: 'spaeti',
    date: '31. Mai 2026',
    likes: 512,
    comments: 29,
    captionKey: 'spaeti'
  },
  {
    id: 'post_3',
    location: 'Wassertorplatz, Berlin',
    imageStyle: {
      bgGradient: 'bg-amber-600',
      glowColor: 'oklch(0.666 0.157 58.3 / 0.2)'
    },
    visualTheme: 'crew',
    date: '28. Mai 2026',
    likes: 419,
    comments: 22,
    captionKey: 'crew'
  }
];

const CAPTIONS = {
  de: {
    fresh: "Frisch abgefüllt und bereit für die Straße! Unser naturtrübes Kellerbier verbindet beste fränkische Brauqualität mit wildem Großstadt-Vibe. Jede Kiste trägt die Liebe der Heimat in sich. 💛🍻 #satzvonfranken #atzenkultur #kellerbier",
    spaeti: "Nachtschicht im Lieblingsspäti! Wenn das Neonlicht angeht, schmeckt das Atzengold am besten. Ab jetzt in über 40 Verkaufsstellen frisch im Kühlschrank. Wo holst du dir dein Feierabendbier? 🌆⭐ #berlinnightlife #spätivibes #atzengold",
    crew: "Beste Atzen, ehrliches Bier. Bei den ersten Sonnenstrahlen sitzen wir auf dem Bordstein und lassen die Seele baumeln. Danke für den Support an der Ecke. Ihr seid die Brand! 🙌🍺 #atzencrew #pavementculture #kellerbier"
  },
  'de-BY': {
    fresh: "Frisch abgfüllt und bereit für de Gassn! Unsa naturtrübs Kellerbier bringt fei beste fränkische Brauqualität auf'n Asphalt. Jede Kistn is voll mit Liebe der Hoamat. Probiers aus, Atze! 💛🍻 #atzengold #kellerbier",
    spaeti: "Nachtschicht im Liablings-Späti! Wenn des Neonlicht brennt, schmeckt des Atzengold am allabestn. Ab jetz in über 40 Standorte im kühlen Kastn. Schnapp kühles Nass! 🌆⭐ #späti #hoamatliebe #atzengold",
    crew: "Beste Atzn, feschs Bier. Bei dene ersten Sonnenstrahln sitzn ma alle mitnand auf der Gassn. Danke für de ganze Treie! Ihr seid de Größten! 🙌🍺 #atzen #kellerbier #freunde"
  },
  en: {
    fresh: "Freshly bottled and ready for the streets! Our naturally cloudy Kellerbier blends finest Franconian brewing excellence with raw urban vibes. Every single crate carries pure passion. 💛🍻 #atzengold #unfiltered #streetculture",
    spaeti: "Late night operations at our neighborhood Späti kiosk! When the neon signs light up, Atzengold is your ultimate companion. Now chilling in over 40 local fridges. 🌆⭐ #berlinbynight #späticulture #kellerbier",
    crew: "True friends, honest beer. Catching the first warm sunrays sitting on the pavement. Thanks for representing the corner and showing true love. You are the community! 🙌🍺 #friendship #pavementculture #unfiltered"
  }
};

export default function InstagramFeed({ lang }: InstagramFeedProps) {
  const [loading, setLoading] = useState(false);
  const [feedPosts, setFeedPosts] = useState<MockPost[]>(MOCK_POSTS_DATA);
  const [hasRefreshed, setHasRefreshed] = useState(false);
  const [activeLikeAnim, setActiveLikeAnim] = useState<string | null>(null);

  const activeT = translations[lang] || translations.de;

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setHasRefreshed(true);
      const updated = feedPosts.map(post => ({
        ...post,
        likes: post.likes + Math.floor(Math.random() * 5) + 1,
        comments: post.comments + (Math.random() > 0.6 ? 1 : 0)
      }));
      setFeedPosts(updated);
    }, 900);
  };

  const handleLikeClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setActiveLikeAnim(id);
    setTimeout(() => setActiveLikeAnim(null), 600);

    setFeedPosts(prev => prev.map(post => {
      if (post.id === id) {
        return {
          ...post,
          likes: post.likes + 1
        };
      }
      return post;
    }));
  };

  return (
    <section id="instagram-feed" className="py-32 bg-texture-paper text-ink relative overflow-hidden transition-all duration-300">
      {/* Paper texture overlay */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-multiply pointer-events-none z-0" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/rice-paper-2.png")' }} />
      
      {/* Soft background glows to lift the layout */}
      <div className="absolute top-1/4 left-1/12 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,var(--color-primary)_0%,transparent_70%)] opacity-10 -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/12 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,var(--color-accent)_0%,transparent_70%)] opacity-10 -z-10 pointer-events-none" />

      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--color-ink) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="mx-auto max-w-7xl px-6 md:px-12 relative z-10">
        
        {/* Header Block Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 text-center md:text-left">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-accent text-on-accent px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase shadow-sm transform -rotate-1" style={{ clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0% 100%)' }}>
              <Instagram className="h-4 w-4 text-on-accent" />
              <span>@atzengold</span>
            </div>
            
            <h2 className="text-display-xl text-ink dark:text-canvas font-handwritten font-bold normal-case">
              {activeT.instagramTitle}
            </h2>
            
            <p className="text-body-md text-ink-secondary dark:text-canvas/90 max-w-2xl lg:max-w-xl font-medium">
              {activeT.instagramSubtitle}
            </p>
          </div>

          {/* Core action CTA blocks */}
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end gap-4 shrink-0">
            <button
              id="refresh-feed-btn"
              onClick={handleRefresh}
              disabled={loading}
              className={`group cursor-pointer flex items-center justify-center gap-2 bg-[#0033A0] hover:bg-[#002a80] text-white rounded-lg border-4 border-white px-6 py-4 text-xs font-sans font-black uppercase tracking-wider transition-all duration-200 shadow-md hover:scale-[1.02] active:scale-95 relative before:absolute before:inset-[3px] before:border before:border-white before:rounded-[3px] before:pointer-events-none ${loading ? 'opacity-70 cursor-wait' : ''}`}
            >
              <RefreshCw className={`h-4 w-4 relative z-10 transition-transform duration-500 group-hover:rotate-180 ${loading ? 'animate-spin' : ''}`} />
              <span className="relative z-10">{loading ? (lang === 'en' ? 'RELOADING...' : 'LÄDT...') : (lang === 'en' ? 'REFRESH FEED' : 'KANAL AKTUALISIEREN')}</span>
            </button>

            <a
              href="https://www.instagram.com/atzengold/"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FFCC00] hover:bg-[#e6b800] text-black rounded-lg border-4 border-black px-8 py-4 text-xs sm:text-sm font-sans font-black tracking-wider uppercase transition-all duration-200 shadow-md hover:scale-[1.02] active:scale-95 relative before:absolute before:inset-[3px] before:border before:border-black before:rounded-[3px] before:pointer-events-none"
            >
              <Instagram className="h-5 w-5 shrink-0 relative z-10" />
              <span className="relative z-10">{activeT.instagramFollow}</span>
            </a>
          </div>
        </div>

        {/* Instantly beautiful, on-brand Interactive Grid display */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 min-h-[420px] items-center justify-center">
            {[1, 2, 3].map((num) => (
              <div key={num} className="bg-canvas border border-ink/10 rounded-xl p-6 h-96 flex flex-col justify-between shadow-xl animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-ink/5" />
                  <div className="space-y-3">
                    <div className="h-3 w-24 bg-ink/15 rounded" />
                    <div className="h-2 w-16 bg-ink/10 rounded" />
                  </div>
                </div>
                <div className="h-40 bg-ink/5 rounded-xl w-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-ink/20 animate-spin" />
                </div>
                <div className="space-y-3">
                  <div className="h-3 w-full bg-ink/10 rounded" />
                  <div className="h-3 w-3/4 bg-ink/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {feedPosts.map((post, idx) => {
              const capText = CAPTIONS[lang]?.[post.captionKey] || CAPTIONS.de[post.captionKey];
              
              // Slapped flyer random rotations
              const rotationClass = idx === 0 ? '-rotate-1 hover:rotate-0' : idx === 1 ? 'rotate-2 hover:rotate-0' : '-rotate-2 hover:rotate-0';
              
              return (
                <div
                  key={post.id}
                  className={`group relative bg-[#fcfbfa] rounded-sm transition-all duration-300 flex flex-col h-full overflow-hidden shadow-md hover:shadow-xl border border-ink/15 transform ${rotationClass} p-[4px] before:absolute before:inset-[4px] before:border before:border-dashed before:border-ink/10 before:pointer-events-none`}
                  style={{ transformOrigin: 'center' }}
                >
                  {/* Top Creator Header Card */}
                  <div className="flex items-center justify-between p-5 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-canvas flex items-center justify-center text-xs font-display font-black shrink-0 shadow-sm border border-canvas/10">
                        AZ
                      </div>
                      
                      <div className="text-left">
                        <p className="text-xs font-black tracking-wide leading-none flex items-center gap-1 font-sans text-ink">
                          atzengold 
                          <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-sm" title="Verifiziert">
                            <Check className="h-2 w-2" />
                          </span>
                        </p>
                        <p className="text-[10px] font-bold flex items-center gap-1 mt-1 font-mono text-ink-secondary">
                          <MapPin className="h-2.5 w-2.5 text-accent" />
                          {post.location}
                        </p>
                      </div>
                    </div>

                    <span className="text-[9px] font-mono font-bold select-none text-ink-mute">
                      {post.date}
                    </span>
                  </div>

                  {/* Dynamic Branded Post Photo Canvas Frame Mock with double-tap support */}
                  <a
                    href="https://www.instagram.com/atzengold/"
                    target="_blank"
                    rel="noreferrer"
                    className="relative w-full aspect-square flex items-center justify-center overflow-hidden cursor-pointer bg-ink/5 border-y border-ink/10"
                  >
                    {/* Grayscale to color transitions */}
                    <div className={`absolute inset-0 ${post.imageStyle.bgGradient} opacity-90 transition-all duration-500 filter grayscale contrast-[1.15] brightness-[0.95] group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105`} />
                    <div 
                      className="absolute inset-0 opacity-[0.08]" 
                      style={{ backgroundImage: 'radial-gradient(var(--color-ink) 1px, transparent 1px)', backgroundSize: '12px 12px' }}
                    />

                    {post.visualTheme === 'fresh' && (
                      <div className="relative z-10 flex flex-col items-center justify-center space-y-4 text-center p-4 transition-transform duration-300 group-hover:scale-105">
                        <div className="relative w-14 h-36 flex flex-col justify-end items-center drop-shadow-lg">
                          <div className="w-4 h-5 bg-canvas border border-ink/20 flex items-center justify-center rounded-t-sm">
                            <div className="w-2.5 h-4 bg-accent text-[3px] py-0.5 font-bold rounded-sm text-ink">AZ</div>
                          </div>
                          <div className="w-10 h-6 bg-brand-dark-900 rounded-t-xl" />
                          <div className="relative w-12 h-24 bg-canvas rounded-b-xl border border-ink/20 p-1 flex flex-col items-center justify-between shadow-inner">
                            <div className="w-10 h-16 bg-accent rounded-lg flex flex-col items-center justify-center text-[5px] font-bold p-1 shadow-sm">
                              <span className="text-[4px] text-ink">ATZEN</span>
                              <span className="text-[7px] text-ink">GOLD</span>
                            </div>
                            <span className="text-[4px] bg-brand-dark-900 text-canvas font-mono px-1.5 py-0.5 font-bold rounded-full">NATURTRÜB</span>
                          </div>
                        </div>
                        <span className="text-[8px] font-mono tracking-widest font-bold bg-canvas px-3 py-1.5 rounded-full text-ink select-none shadow-md border border-ink/10">
                          SUDE 14 // HELL
                        </span>
                      </div>
                    )}

                    {post.visualTheme === 'spaeti' && (
                      <div className="relative z-10 flex flex-col items-center justify-center space-y-3 p-4 text-center transition-transform duration-300 group-hover:scale-105">
                        <div className="bg-canvas px-5 py-3 rounded-xl shadow-lg select-none transform -rotate-2 border border-ink/15">
                          <p className="text-[10px] font-mono font-black tracking-widest uppercase text-ink-secondary">SPÄTKAUF</p>
                          <p className="text-lg font-display font-black tracking-tighter mt-0.5 text-accent drop-shadow-sm">OPEN 24/7</p>
                        </div>
                        <div className="flex gap-1.5 justify-center mt-4">
                          <div className="w-6 h-14 bg-brand-dark-900 rounded-full rotate-[-8deg] shadow-lg border border-ink/10" />
                          <div className="w-6 h-14 bg-accent rounded-full shadow-xl scale-105 z-10 border border-ink/10" />
                          <div className="w-6 h-14 bg-brand-dark-900 rounded-full rotate-[8deg] shadow-lg border border-ink/10" />
                        </div>
                      </div>
                    )}

                    {post.visualTheme === 'crew' && (
                      <div className="relative z-10 flex flex-col items-center justify-center space-y-4 text-center p-4 transition-transform duration-300 group-hover:scale-105">
                        <div className="flex gap-1">
                          <div className="w-12 h-12 rounded-xl bg-canvas text-ink flex items-center justify-center text-xl font-display font-black shadow-lg transform -rotate-12 border border-ink/15">
                            G
                          </div>
                          <div className="w-12 h-12 rounded-xl bg-accent text-ink flex items-center justify-center text-xl font-display font-black shadow-xl transform translate-y-2 z-10 border border-ink/15">
                            M
                          </div>
                          <div className="w-12 h-12 rounded-xl bg-canvas text-ink flex items-center justify-center text-xl font-display font-black shadow-lg transform rotate-12 translate-y-1 border border-ink/15">
                            A
                          </div>
                        </div>
                        <div className="bg-canvas rounded-xl px-4 py-2 text-center max-w-[160px] shadow-lg transform rotate-2 border border-ink/15">
                          <p className="text-[9px] font-mono font-bold leading-tight text-ink">{lang === 'en' ? 'Pavement Culture & Friends' : 'Bordsteinkante & Freunde'}</p>
                        </div>
                      </div>
                    )}

                    {/* Absolute Interaction Overlay */}
                    <div className="absolute inset-0 bg-brand-dark-900/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center space-y-4">
                      <div className="flex items-center gap-6 text-canvas text-sm font-bold font-mono">
                        <span className="flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <Heart className="h-6 w-6 text-accent fill-accent animate-pulse" />
                          {post.likes}
                        </span>
                        <span className="flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                          <MessageCircle className="h-6 w-6 text-canvas fill-canvas/20" />
                          {post.comments}
                        </span>
                      </div>
                      
                      <span className="px-5 py-2.5 bg-accent text-on-accent rounded-full text-xs font-bold font-mono flex items-center gap-2 transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-xl hover:bg-accent-hover hover:-translate-y-0.5">
                        <ExternalLink className="h-4 w-4" />
                        {activeT.instagramViewPost}
                      </span>
                    </div>

                    {/* Double-tap simulated Heart Burst feedback element */}
                    {activeLikeAnim === post.id && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-brand-dark-900/20 backdrop-blur-sm pointer-events-none">
                        <Heart className="h-24 w-24 animate-scaleUp text-accent fill-accent filter drop-shadow-2xl" />
                      </div>
                    )}
                  </a>

                  {/* Actions Bar layout */}
                  <div className="flex items-center justify-between p-4 font-mono text-xs select-none bg-[#fcfbfa] relative z-10 border-b border-ink/5">
                    <div className="flex items-center gap-5">
                      <button
                        onClick={(e) => handleLikeClick(post.id, e)}
                        className="cursor-pointer flex items-center gap-1.5 text-ink-secondary hover:text-accent transition-colors group/btn"
                        title="Beitrag liken"
                      >
                        <Heart className="h-4.5 w-4.5 group-hover/btn:scale-110 active:scale-90 transition-transform duration-100 fill-transparent hover:fill-accent/20" />
                        <span className="font-bold text-xs text-ink">{post.likes}</span>
                      </button>
                      
                      <div className="flex items-center gap-1.5 text-ink-secondary">
                        <MessageCircle className="h-4.5 w-4.5 cursor-help" />
                        <span className="font-bold text-xs text-ink">{post.comments}</span>
                      </div>
                    </div>

                    <a
                      href="https://www.instagram.com/atzengold/"
                      target="_blank"
                      rel="noreferrer"
                      className="text-ink-mute hover:text-ink transition-colors flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded hover:bg-ink/5"
                    >
                      <span>Share</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  {/* Post Caption rendering block */}
                  <div className="px-5 pb-5 pt-3 flex-1 flex flex-col justify-start text-left text-xs sm:text-sm leading-relaxed text-ink-secondary bg-[#fcfbfa]">
                    <p className="line-clamp-4 select-text">
                      <strong className="mr-1.5 font-bold text-ink">atzengold</strong>
                      {capText}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Dynamic visual indicator feedback indicating feed updated state */}
        {hasRefreshed && !loading && (
          <div className="mt-16 flex justify-center animate-fadeIn duration-500">
            <span className="inline-flex items-center gap-2 text-xs font-mono font-bold bg-canvas text-ink rounded-full px-6 py-3 shadow-md animate-peel select-none border border-ink/10">
              <Sparkles className="h-4 w-4 animate-pulse text-accent" />
              {lang === 'en' ? 'FEED UPDATED WITH LIVE ENGAGEMENT MODEL' : 'FEED ERFOLGREICH MIT ENGAGEMENT-LIVE-MODELL AKTUALISIERT'}
            </span>
          </div>
        )}

      </div>
    </section>
  );
}
