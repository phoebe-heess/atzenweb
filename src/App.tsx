import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  Sparkles, 
  Compass, 
  History, 
  ShoppingBag, 
  Briefcase, 
  Instagram, 
  ShieldAlert,
  Flame,
  ArrowRight,
  Mail
} from 'lucide-react';
import AgeGate from './components/AgeGate';
import CookieBanner from './components/CookieBanner';
import ThreeDMap from './components/ThreeDMap';
import StoryAndBrew from './components/StoryAndBrew';
import MerchShop from './components/MerchShop';
// B2B-Portal vorerst deaktiviert (Gabriel: "vielleicht benötigen wir das später") — nur auskommentiert, nicht gelöscht.
// import B2BPortal from './components/B2BPortal';
import BrandHub from './components/BrandHub';
import Datenschutz from './components/Datenschutz';
import Impressum from './components/Impressum';
import CheckoutSuccess from './components/CheckoutSuccess';
import Widerrufsrecht from './components/Widerrufsrecht';
import AGB from './components/AGB';
import GoldBarsSVG from './components/GoldBarsSVG';
import NotificationToast from './components/NotificationToast';
import InstagramFeed from './components/InstagramFeed';
import Testimonials from './components/Testimonials';
import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminVenues from './components/admin/AdminVenues';
import AdminStory from './components/admin/AdminStory';
import AdminMerch from './components/admin/AdminMerch';
import AdminOrders from './components/admin/AdminOrders';
import AdminTestimonials from './components/admin/AdminTestimonials';
import AdminBeerProfile from './components/admin/AdminBeerProfile';
import AdminBrandHub from './components/admin/AdminBrandHub';
import AdminBrandGuidelines from './components/admin/AdminBrandGuidelines';
import AdminSettings from './components/admin/AdminSettings';
import AdminTranslations from './components/admin/AdminTranslations';
import { SunburstBg } from './components/ornaments/SunburstBg';
import { WheatDivider } from './components/ornaments/WheatDivider';
import { translations } from './constants/translations';
import { Language } from './types';

// Custom Web Audio API synthesizer for the real-time notification chime
function playNotificationChime() {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Low notification chime (dual oscillator harmony)
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Warm, rich bell-like frequencies (perfect for a premium beer clink/chime)
    osc1.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc2.frequency.setValueAtTime(880.00, audioCtx.currentTime); // A5

    osc1.type = 'sine';
    osc2.type = 'sine';

    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.65);

    osc1.start();
    osc2.start();
    osc1.stop(audioCtx.currentTime + 0.7);
    osc2.stop(audioCtx.currentTime + 0.7);
  } catch (err) {
    // Graceful fallback if block by browser policy or audio node failure
    console.log('Audio chime played (muted by browser policy)');
  }
}

export default function App() {
  const [lang, setLang] = useState<Language>('de');
  const [isVerified, setIsVerified] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [showBrandHub, setShowBrandHub] = useState(false);
  const [showDatenschutz, setShowDatenschutz] = useState(false);
  const [showImpressum, setShowImpressum] = useState(false);
  const [showWiderrufsrecht, setShowWiderrufsrecht] = useState(false);
  const [showAGB, setShowAGB] = useState(false);
  const [checkoutOrderId, setCheckoutOrderId] = useState<string | null>(null);
  const [showCheckoutCancel, setShowCheckoutCancel] = useState(false);
  // Dark mode entfernt — Seite läuft nur noch im hellen/beigen Theme
  const theme: 'dark' | 'light' = 'light';
  const [showHeader, setShowHeader] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminApiKey, setAdminApiKey] = useState<string | null>(null);
  const [adminSection, setAdminSection] = useState('dashboard');

  // Smart Sticky Header scroll event listener
  useEffect(() => {
    let lastScroll = window.scrollY;
    
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      
      // Update scrolled status
      setScrolled(currentScroll > 10);
      
      // Always show at the top of the page (within 50px)
      if (currentScroll < 50) {
        setShowHeader(true);
      } else {
        const diff = currentScroll - lastScroll;
        if (Math.abs(diff) > 5) {
          if (diff > 0) {
            // Scrolling down -> hide
            setShowHeader(false);
          } else {
            // Scrolling up -> show
            setShowHeader(true);
          }
        }
      }
      
      lastScroll = currentScroll;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initialize status
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Language switcher is now a direct button, no dropdown state or click-outside reference needed

  // Close mobile drawer on Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  useEffect(() => {
    // Seite läuft nur noch im hellen/beigen Theme — Dark Mode entfernt
    const root = window.document.documentElement;
    root.classList.add('light');
    root.classList.remove('dark');
  }, []);

  // Admin mode & checkout routes: check URL hash on mount and restore stored API key
  useEffect(() => {
    const hash = window.location.hash;

    // Admin-CMS vorerst deaktiviert (Gabriel: "Nur auskommentieren") — Einstiegspunkt über #admin-Hash auskommentiert, Code bleibt erhalten.
    // if (hash === '#admin') {
    //   const stored = localStorage.getItem('ag_admin_key');
    //   if (stored) {
    //     setAdminApiKey(stored);
    //     setIsAdmin(true);
    //   }
    // }

    if (hash.startsWith('#checkout/success')) {
      const params = new URLSearchParams(hash.split('?')[1] || '');
      const orderId = params.get('order');
      if (orderId) setCheckoutOrderId(orderId);
    }

    if (hash === '#checkout/cancel') {
      setShowCheckoutCancel(true);
    }

    const onHashChange = () => {
      const h = window.location.hash;

      // Admin-CMS vorerst deaktiviert — siehe oben.
      // if (h === '#admin') {
      //   const stored = localStorage.getItem('ag_admin_key');
      //   if (stored) {
      //     setAdminApiKey(stored);
      //     setIsAdmin(true);
      //   }
      // }

      if (h.startsWith('#checkout/success')) {
        const params = new URLSearchParams(h.split('?')[1] || '');
        const orderId = params.get('order');
        if (orderId) setCheckoutOrderId(orderId);
      }

      if (h === '#checkout/cancel') {
        setShowCheckoutCancel(true);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Alt+A keyboard shortcut to toggle admin mode — auskommentiert (Admin-CMS vorerst deaktiviert)
  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     if (e.altKey && e.key === 'a') {
  //       e.preventDefault();
  //       setIsAdmin(prev => !prev);
  //     }
  //   };
  //   window.addEventListener('keydown', handleKeyDown);
  //   return () => window.removeEventListener('keydown', handleKeyDown);
  // }, []);

  // Dynamic Crisp Chat widget injection
  useEffect(() => {
    const websiteId = import.meta.env.VITE_CRISP_WEBSITE_ID;
    if (!websiteId) return;

    (window as any).$crisp = [];
    (window as any).CRISP_WEBSITE_ID = websiteId;

    const d = document;
    const s = d.createElement("script");
    s.src = "https://client.crisp.chat/l.js";
    s.async = true;
    d.getElementsByTagName("head")[0].appendChild(s);
  }, []);

  const t = translations[lang] || translations.de;

  useEffect(() => {
    // Show banner on initial visit if not consented
    const stored = localStorage.getItem('atzold_cookie_consent_v1');
    if (!stored) {
      const timer = setTimeout(() => {
        setShowCookieBanner(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  // Auto-dismiss push notification alerts after 7 seconds
  useEffect(() => {
    if (activeNotification) {
      const timer = setTimeout(() => {
        setActiveNotification(null);
      }, 7500);
      return () => clearTimeout(timer);
    }
  }, [activeNotification]);

  // Hook up restocking trigger notifier
  const handleTriggerNotification = (message: string) => {
    setActiveNotification(message);
    playNotificationChime();
  };

  const handleLanguageSwitch = () => {
    setLang(prev => (prev === 'de' ? 'en' : 'de'));
  };

  const handleAdminLogin = (key: string) => {
    localStorage.setItem('ag_admin_key', key);
    setAdminApiKey(key);
    setIsAdmin(true);
  };

  const handleCheckoutClose = () => {
    setCheckoutOrderId(null);
    setShowCheckoutCancel(false);
    window.location.hash = '';
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('ag_admin_key');
    setAdminApiKey(null);
    setIsAdmin(false);
    setAdminSection('dashboard');
  };

  // Skip verified status if bypassed in development
  const handleVerified = () => {
    setIsVerified(true);
  };

  // Admin mode: full-screen overlay replacing the normal app
  if (isAdmin) {
    if (!adminApiKey) {
      return <AdminLogin onLogin={handleAdminLogin} />;
    }
    return (
      <AdminLayout activeSection={adminSection} onNavigate={setAdminSection} onLogout={handleAdminLogout}>
        {adminSection === 'dashboard' && <AdminDashboard onNavigate={setAdminSection} />}
        {adminSection === 'venues' && <AdminVenues apiKey={adminApiKey} />}
        {adminSection === 'story' && <AdminStory apiKey={adminApiKey} />}
        {adminSection === 'merch' && <AdminMerch apiKey={adminApiKey} />}
        {adminSection === 'orders' && <AdminOrders apiKey={adminApiKey} />}
        {adminSection === 'testimonials' && <AdminTestimonials apiKey={adminApiKey} />}
        {adminSection === 'beer-profile' && <AdminBeerProfile apiKey={adminApiKey} />}
        {adminSection === 'brandhub' && <AdminBrandHub apiKey={adminApiKey} />}
        {adminSection === 'brand-guidelines' && <AdminBrandGuidelines lang={lang} />}
        {adminSection === 'translations' && <AdminTranslations apiKey={adminApiKey} />}
        {adminSection === 'settings' && <AdminSettings apiKey={adminApiKey} />}
      </AdminLayout>
    );
  }

  return (
    <div className={`min-h-screen font-sans scroll-smooth ${
      theme === 'light' 
        ? 'light' 
        : 'dark'
    }`}>
      
      {/* Global raw film-grain texture overlay */}
      <div className="noise-overlay" />
      
      {/* 0. Cookie Consent Manager Banner Popup */}
      <CookieBanner 
        lang={lang} 
        isOpen={showCookieBanner}
        onClose={() => setShowCookieBanner(false)}
        onConsentSaved={(consents) => {
          console.log('Active cookie consents:', consents);
        }} 
        onTriggerNotification={handleTriggerNotification}
        onShowPrivacy={() => setShowDatenschutz(true)}
        onShowImpressum={() => setShowImpressum(true)}
      />

      {/* 0.5. Interactive Brand & Design Guidelines System Hub Overlay */}
      <BrandHub 
        lang={lang}
        isOpen={showBrandHub}
        onClose={() => setShowBrandHub(false)}
        onTriggerNotification={handleTriggerNotification}
      />

      {/* 0.7. Fully Accessible Datenschutz Privacy Policy Overlay */}
      <Datenschutz 
        lang={lang}
        isOpen={showDatenschutz}
        onClose={() => setShowDatenschutz(false)}
      />

      {/* 0.8. Fully Accessible Impressum Legal Disclosure Overlay */}
      <Impressum 
        lang={lang}
        isOpen={showImpressum}
        onClose={() => setShowImpressum(false)}
      />
      
      {/* 1. On-Brand Age Gate popup check */}
      {!isVerified && (
        <AgeGate lang={lang} onVerified={handleVerified} />
      )}

      {/* 2. Main Navigation Bar */}
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          showHeader ? 'translate-y-0' : 'translate-y-[-140px]'
        } ${
          scrolled 
            ? 'bg-canvas/90 dark:bg-primary-deep/90 backdrop-blur-md border-b border-ink/10 dark:border-canvas/10 shadow-md' 
            : 'bg-transparent border-b border-transparent shadow-none'
        }`}
      >
        <div className="max-w-7xl mx-auto w-full h-16 sm:h-20 flex items-center px-4 sm:px-8 relative">
          
          {/* Brand Logo Banner - breaks out of height and oversized on the left */}
          <a href="#" className="absolute left-4 sm:left-8 top-2.5 sm:top-3 z-50 flex flex-col items-center justify-center group py-1 transition-all duration-200">
            <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3">
              {/* Left Gold Bar Pile Motif */}
              <GoldBarsSVG
                className="w-8 h-6 sm:w-12 sm:h-9 md:w-15 md:h-11 shrink-0 select-none opacity-90 group-hover:opacity-100 group-hover:scale-x-[-1.05] group-hover:scale-y-[1.05] transition-all filter drop-shadow-[0_0_4px_oklch(0.77_0.155_81.1/0.15)]"
              />

              {/* Main GIF Logo - oversized to break out */}
              <img 
                src="https://static.wixstatic.com/media/f8d233_2bc00a5305a64a5da3d407506a80df3c~mv2.gif" 
                alt="Atzengold Logo" 
                className="h-14 sm:h-20 md:h-26 w-auto object-contain filter drop-shadow-[0_0_10px_oklch(0.77_0.155_81.1/0.35)] transition-transform duration-200 group-hover:scale-[1.04]"
                referrerPolicy="no-referrer"
              />

              {/* Right Gold Bar Pile Motif */}
              <GoldBarsSVG
                mirrored={true}
                className="w-8 h-6 sm:w-12 sm:h-9 md:w-15 md:h-11 shrink-0 select-none opacity-90 group-hover:opacity-100 group-hover:scale-x-[1.05] group-hover:scale-y-[1.05] transition-all filter drop-shadow-[0_0_4px_oklch(0.77_0.155_81.1/0.15)]"
              />
            </div>
          </a>

          {/* Right Header actions (Language switch + Quick cta + Hamburger menu) */}
          <div className="hidden md:flex items-center gap-4 ml-auto">
            <button
              id="lang-switcher"
              onClick={() => setLang(prev => prev === 'en' ? 'de' : 'en')}
              className="w-10 h-10 rounded-full border border-ink/20 shadow-md hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer bg-transparent p-0 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none text-ink"
              aria-label={lang === 'en' ? "Auf Deutsch umstellen" : "Switch to English"}
              title={lang === 'en' ? "Auf Deutsch umstellen" : "Switch to English"}
            >
              <span className="text-xs font-bold font-mono tracking-wide">
                {lang === 'en' ? 'EN' : 'DE'}
              </span>
            </button>
            
            <a
              href="#map-finder"
              className="bg-accent text-on-accent px-5 h-10 rounded-full text-button-md hover:bg-accent-hover transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Compass className="h-4 w-4" />
              {t.heroCtaFind}
            </a>

            {/* Desktop Hamburger menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="text-ink dark:text-canvas hover:text-accent transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none bg-transparent border-none p-0 flex items-center justify-center"
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile responsive hamburger menu trigger */}
          <div className="flex items-center gap-4 md:hidden ml-auto">
            <button
              onClick={() => setLang(prev => prev === 'en' ? 'de' : 'en')}
              className="w-9 h-9 rounded-full border border-ink/20 dark:border-canvas/20 shadow-md hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer bg-transparent p-0 flex items-center justify-center focus:outline-none text-ink dark:text-canvas"
              aria-label={lang === 'en' ? "Auf Deutsch umstellen" : "Switch to English"}
              title={lang === 'en' ? "Auf Deutsch umstellen" : "Switch to English"}
            >
              <span className="text-xs font-bold font-mono tracking-wide">
                {lang === 'en' ? 'EN' : 'DE'}
              </span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="text-ink dark:text-canvas hover:text-accent transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none bg-transparent border-none p-0 flex items-center justify-center"
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>

      </header>

      {/* Full Screen Menu Overlay acting as a canvas for art and narrative */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 z-50 overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row ${
              theme === 'light'
                ? 'bg-canvas text-ink'
                : 'bg-primary-deep text-canvas'
            }`}
          >
            {/* Left Panel: Graphic Art & Narrative Canvas (visible on lg screens, stacks on mobile) */}
            <div className="relative w-full lg:w-[45%] h-auto lg:h-full p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-ink/10 bg-texture-paper min-h-[350px] lg:min-h-0">
              {/* Slow spinning sunburst background inside the art canvas */}
              <SunburstBg animated={true} className="opacity-[0.35] dark:opacity-[0.25] scale-150 pointer-events-none" />
              
              {/* Top: Art Branding & Badge */}
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-handwritten text-primary font-bold tracking-normal leading-none">
                    Atzengold
                  </span>
                  <span className="text-[10px] font-mono border border-accent/20 px-2 py-0.5 rounded text-accent bg-accent/5 select-none uppercase font-bold tracking-wider">
                    HELL
                  </span>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <div className="inline-block bg-ink text-canvas font-display text-sm px-3 py-1 skew-x-3 leading-none">
                    Lecker Bierchen //
                  </div>
                  <div className="font-handwritten text-2xl sm:text-3xl normal-case tracking-normal text-accent font-bold mt-1">
                    Franken x Berlin
                  </div>
                </div>
              </div>

              {/* Middle: Poetry Narrative & Sketch */}
              <div className="relative z-10 my-8 max-w-md">
                <p className="font-heading uppercase italic text-lg sm:text-2xl font-black mb-3 tracking-tight">
                  {lang === 'en' ? 'Unfiltered Heritage' : 'Das ehrliche Pavement-Bier'}
                </p>
                <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-75 mb-6">
                  {lang === 'en'
                    ? 'Brewed with absolute respect. Shared over concrete. Atzengold is the unfiltered Franconian Kellerbier for best friends catching the first warm sunrays sitting on the pavement.'
                    : 'Braut mit reinem Respekt. Getrunken auf dem Pflaster. Atzengold ist das unfiltrierte fränkische Kellerbier für beste Freunde, die den ersten warmen Sonnenstrahl auf der Bordsteinkante genießen.'}
                </p>
                
                {/* Small decorative sketch/watermark */}
                <div className="border-t border-dashed border-ink/20 pt-4 flex items-center gap-4 text-[10px] font-mono opacity-50 uppercase">
                  <span>Code: AG-ST-998</span>
                  <span>•</span>
                  <span>Sude 14</span>
                  <span>•</span>
                  <span>Batch: Unfiltered</span>
                </div>
              </div>

              {/* Bottom: Mini-Newsletter Block embedded in the canvas */}
              <div className="relative z-10 border-t border-ink/10 pt-6">
                <h4 className="font-mono text-xs uppercase tracking-wider font-bold mb-3 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-accent" />
                  {lang === 'en' ? 'Join the corner list' : 'Pavement-Kanal abonnieren'}
                </h4>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const emailInput = form.elements.namedItem('menu-email') as HTMLInputElement;
                    if (emailInput && emailInput.value) {
                      handleTriggerNotification(
                        lang === 'en' 
                          ? '✉️ Welcome to the corner crew! You have successfully subscribed.'
                          : '✉️ Willkommen in der Pflaster-Crew! Erfolgreich abonniert.'
                      );
                      emailInput.value = '';
                    }
                  }}
                  className="flex max-w-sm gap-2"
                >
                  <input 
                    type="email" 
                    name="menu-email"
                    required
                    placeholder="deine.mail@domain.de"
                    className="flex-1 bg-transparent border-2 border-ink/20 rounded-xl px-4 py-2 text-xs font-mono focus:outline-none focus:border-accent transition-colors"
                  />
                  <button 
                    type="submit"
                    className="bg-brand-dark-900 text-canvas hover:bg-accent hover:text-on-accent rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {lang === 'en' ? 'JOIN' : 'ABO'}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Panel: Immersive Navigation Links */}
            <div className="w-full lg:w-[55%] min-h-[450px] lg:h-full p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative">
              
              {/* Top: Close Button */}
              <div className="flex justify-end items-center absolute top-6 right-6 lg:top-10 lg:right-10 z-20">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="p-3 rounded-full bg-ink text-canvas hover:scale-105 hover:bg-accent hover:text-on-accent transition-all duration-200 cursor-pointer shadow-lg flex items-center justify-center focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Middle: Immersive Navigation Links (joyfully animated) */}
              <div className="my-auto pt-12 lg:pt-0">
                <motion.nav 
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.08
                      }
                    }
                  }}
                  className="flex flex-col gap-6 lg:gap-8"
                >
                  {[
                    { href: "#story-narrative", label: t.navStory, desc: lang === 'en' ? 'Our Heritage' : 'Unsere Geschichte' },
                    { href: "#utz-beer-profile", label: t.navBeer, desc: lang === 'en' ? 'Franconian Kellerbier' : 'Fränkisches Kellerbier' },
                    { href: "#map-finder", label: t.navMap, desc: lang === 'en' ? 'Find Us Near You' : 'Späti & Kneipenfinder' },
                    { href: "#merch-shop", label: t.navShop, desc: lang === 'en' ? 'Corner Goods' : 'Atzenmerch Shop' },
                    // B2B-Portal-Navlink auskommentiert (vorerst deaktiviert, nicht gelöscht)
                    // { href: "#b2b-gastronomy", label: t.navB2b, desc: lang === 'en' ? 'Gastro & Retail' : 'Gastro & Handel Portal' },
                    { href: "#instagram-feed", label: "Instagram", desc: lang === 'en' ? 'Corner Life' : 'Pavement Kultur' }
                  ].map((link, idx) => (
                    <motion.div
                      key={idx}
                      variants={{
                        hidden: { y: 40, opacity: 0, rotate: -1 },
                        visible: { y: 0, opacity: 1, rotate: 0, transition: { type: "spring", damping: 15 } }
                      }}
                    >
                      <a
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="group inline-flex flex-col text-left focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                      >
                        <span className="text-4xl sm:text-5.5xl font-black uppercase italic tracking-tighter transition-all duration-200 group-hover:text-accent group-hover:translate-x-3 group-hover:skew-x-3 inline-block whitespace-nowrap">
                          {link.label}
                        </span>
                        <span className="text-[10px] font-mono tracking-widest uppercase opacity-40 group-hover:opacity-100 group-hover:text-accent transition-all duration-200 mt-1 pl-1 whitespace-nowrap">
                          // {link.desc}
                        </span>
                      </a>
                    </motion.div>
                  ))}
                </motion.nav>
              </div>

              {/* Bottom: Social Media and Disclaimer links */}
              <div className="border-t border-ink/10 pt-8 mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                {/* Social links */}
                <div className="flex items-center gap-6">
                  <a
                    href="https://www.instagram.com/atzengold/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider font-bold hover:text-accent transition-colors whitespace-nowrap"
                  >
                    <Instagram className="h-4.5 w-4.5 text-accent" />
                    <span>Instagram</span>
                  </a>
                </div>

                {/* Footnote */}
                <p className="text-[9px] font-mono uppercase tracking-wider opacity-50 italic max-w-xs leading-normal select-none">
                  Kenner trinken verantwortungsvoll. Abgabe erst ab 16 Jahren.
                </p>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Hero Visual Canvas Showcase Area */}
      <section className="relative min-h-screen pt-28 pb-20 overflow-hidden flex items-center">
        {/* Swirling sunburst centered on logo */}
        <SunburstBg animated={true} className="hero-sunburst" />

        {/* Soft edge-softening overlay at section level */}
        <div className="absolute inset-0 bg-linear-to-t from-canvas via-transparent to-canvas dark:from-primary-deep dark:to-primary-deep opacity-65 pointer-events-none z-0"></div>
        
        {/* Gritty urban texture overlay */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply dark:mix-blend-screen pointer-events-none">
          <img src="/images/hero-bg.png" alt="" className="w-full h-full object-cover" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="flex flex-col items-start pt-12 lg:pt-0">
            <div className="flex items-center gap-3 mb-8 animate-ink-reveal" style={{ animationDelay: '0.1s' }}>
              <span className="bg-ink text-canvas font-display text-lg px-5 py-2 leading-none relative shadow-md select-none transform -rotate-1 border border-canvas/10" style={{ clipPath: 'polygon(0 0, 100% 0%, 95% 100%, 0% 100%)' }}>
                <span className="text-accent mr-1">✦</span> {lang === 'en' ? 'Unfiltered Heritage' : 'Lecker Bierchen'}
              </span>
            </div>

            <h1 className="font-handwritten text-[2.5rem] sm:text-[4rem] md:text-[5.2rem] text-ink leading-[1.05] mb-6 animate-flutter normal-case tracking-normal text-balance" style={{ textShadow: '-2px 2px 0px oklch(0.85 0.04 75.0), 2px -2px 0px oklch(0.42 0.13 165.0 / 0.2)', animationDelay: '0.2s' }}>
              Atzen<span className="text-accent animate-misregistration">gold</span>{lang === 'en' ? ' Kellerbier Culture' : '-Bierkultur'}
            </h1>

            <p className="text-xl md:text-2xl text-ink-secondary dark:text-canvas/80 max-w-2xl mb-10 animate-ink-reveal text-pretty font-sans font-medium leading-relaxed" style={{ animationDelay: '0.3s' }}>
              {t.heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 animate-ink-reveal" style={{ animationDelay: '0.4s' }}>
              <a
                href="#map-finder"
                className="group relative inline-flex items-center justify-center gap-3 bg-accent text-on-accent px-10 py-4 text-button-md border-4 border-ink rounded-xl shadow-[4px_4px_0px_oklch(0.15_0.01_150.0)] transition-all hover:bg-accent-hover hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0px_oklch(0.15_0.01_150.0)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-[2px_2px_0px_oklch(0.15_0.01_150.0)] whitespace-nowrap focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-accent focus-visible:outline-none before:absolute before:inset-[3px] before:border before:border-ink before:rounded-[8px] before:pointer-events-none"
              >
                <Compass className="h-5 w-5 group-hover:rotate-45 transition-transform duration-300 relative z-10" />
                <span className="relative z-10">{t.heroCtaFind}</span>
              </a>
            </div>
            
            {/* Soft Stats - styled as a collage of German street and transit signs */}
            <div className="flex flex-wrap gap-4 sm:gap-6 mt-12 pt-8 border-t border-dashed border-ink/20 dark:border-canvas/20 w-full select-none">
              
              {/* Sticker 1: ABV (Yellow German Place Sign / Ortsschild) */}
              <motion.div 
                initial={{ opacity: 0, scale: 1.4, rotate: -15, y: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: -3, y: 0 }}
                whileHover={{ scale: 1.05, rotate: -1, zIndex: 10 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 500, damping: 25, delay: 0.5 }}
                className="relative bg-accent text-on-accent px-5 py-3.5 shadow-md border-4 border-ink rounded-lg flex flex-col justify-center min-w-[120px] cursor-pointer origin-center before:absolute before:inset-[3px] before:border before:border-ink before:rounded-[4px] before:pointer-events-none"
              >
                <span className="relative z-10 text-2xl font-extrabold font-sans leading-none tracking-tight text-on-accent">5.2%</span>
                <span className="relative z-10 text-[9px] font-mono font-bold tracking-widest text-on-accent/80 mt-2 uppercase leading-none">ABV SPEC //</span>
              </motion.div>

              {/* Sticker 2: Unfiltered (Green German Autobahn Direction Sign) */}
              <motion.div 
                initial={{ opacity: 0, scale: 1.4, rotate: 15, y: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 2, y: 0 }}
                whileHover={{ scale: 1.05, rotate: 4, zIndex: 10 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 500, damping: 25, delay: 0.65 }}
                className="relative bg-primary text-canvas px-5 py-3.5 shadow-md border-4 border-canvas rounded-lg flex flex-col justify-center min-w-[120px] cursor-pointer origin-center before:absolute before:inset-[3px] before:border before:border-canvas before:rounded-[4px] before:pointer-events-none"
              >
                <span className="relative z-10 text-2xl font-extrabold font-sans leading-none tracking-tight text-canvas">100%</span>
                <span className="relative z-10 text-[9px] font-mono font-bold tracking-widest text-canvas/90 mt-2 uppercase leading-none">UNFILTERED</span>
              </motion.div>

              {/* Sticker 3: Cuckoo Brewed (Blue Berlin U-Bahn Sign) */}
              <motion.div 
                initial={{ opacity: 0, scale: 1.4, rotate: -12, y: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: -1, y: 0 }}
                whileHover={{ scale: 1.05, rotate: 1, zIndex: 10 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 500, damping: 25, delay: 0.8 }}
                className="relative bg-ink text-canvas px-5 py-3.5 shadow-md border-4 border-canvas rounded-lg flex flex-col justify-center min-w-[120px] cursor-pointer origin-center before:absolute before:inset-[3px] before:border before:border-canvas before:rounded-[4px] before:pointer-events-none"
              >
                <span className="relative z-10 text-2xl font-extrabold font-sans leading-none tracking-tight text-canvas">Cuckoo</span>
                <span className="relative z-10 text-[9px] font-mono font-bold tracking-widest text-canvas/90 mt-2 uppercase leading-none">BREWED</span>
              </motion.div>

            </div>
          </div>
          
          <div className="relative flex justify-center items-center lg:justify-end animate-ink-reveal" style={{ animationDelay: '0.3s' }}>
            {/* The brewer character replacing the simple background watermark */}
            <img 
              src="/atzengold-logo.webp" 
              alt="Atzengold Character" 
              className="w-full max-w-[500px] h-auto object-contain filter drop-shadow-xl"
            />
          </div>

        </div>
      </section>


      {/* 4. Interactive Timeline Narrative Story & Ingredient Flavor breakdown */}
      <StoryAndBrew lang={lang} />

      {/* Testimonials section */}
      <Testimonials lang={lang} />

      {/* 5. Isometric Radar locator Map with Stocks & restock trigger notifications */}
      <ThreeDMap
        onOpenDatenschutz={() => setShowDatenschutz(true)}
      />

      {/* 6. Merchandise Catalog & checkout modal flow */}
      <MerchShop 
        lang={lang} 
        onAddCartFeedback={handleTriggerNotification} 
      />

      {/* 6.5. Stripe Checkout Success Confirmation Overlay */}
      {checkoutOrderId && (
        <CheckoutSuccess
          lang={lang}
          orderId={checkoutOrderId}
          onClose={handleCheckoutClose}
        />
      )}

      {/* 6.6. Stripe Checkout Cancel Message */}
      {showCheckoutCancel && (
        <div className="fixed inset-0 z-50 bg-canvas dark:bg-primary-deep flex items-center justify-center p-4">
          <div className="max-w-md text-center space-y-6">
            <h2 className="text-3xl font-handwritten font-bold text-ink dark:text-canvas normal-case">
              {lang === 'en' ? 'Checkout Cancelled' : 'Zahlung abgebrochen'}
            </h2>
            <p className="text-ink/70 dark:text-canvas/70">
              {lang === 'en'
                ? 'Your payment was not completed. No charges have been made. You can try again anytime.'
                : 'Deine Zahlung wurde nicht abgeschlossen. Es wurden keine Kosten berechnet. Du kannst es jederzeit erneut versuchen.'}
            </p>
            <button
              onClick={handleCheckoutClose}
              className="rounded-xl bg-ink dark:bg-accent text-canvas dark:text-on-accent font-display font-bold uppercase py-3 px-8 transition-all hover:shadow-lg cursor-pointer border-none"
            >
              {lang === 'en' ? 'Back to Shop' : 'Zurück zum Shop'}
            </button>
          </div>
        </div>
      )}

      {/* 6.7. Widerrufsrecht Legal Overlay */}
      <Widerrufsrecht
        lang={lang}
        isOpen={showWiderrufsrecht}
        onClose={() => setShowWiderrufsrecht(false)}
      />

      {/* 6.8. AGB Legal Overlay */}
      <AGB
        lang={lang}
        isOpen={showAGB}
        onClose={() => setShowAGB(false)}
      />

      {/* 7. Frictionless Gastronomy & Retail Portal — auskommentiert, vorerst deaktiviert (Gabriel: "vielleicht benötigen wir das später") */}
      {/* <B2BPortal lang={lang} /> */}

      {/* 7.5. Dynamic Instagram Channel Feed Showcase Section */}
      <InstagramFeed lang={lang} />

      {/* 8. Active Push Notification banner popup overlays */}
      {activeNotification && (
        <NotificationToast 
          message={activeNotification} 
          lang={lang}
          onClose={() => setActiveNotification(null)} 
        />
      )}


      {/* 9. Site Footer */}
      {/* 9. Site Footer */}
      <footer className="bg-canvas dark:bg-primary-deep/10 border-t border-hairline py-16 px-4 md:px-8 relative overflow-hidden transition-colors duration-200">
        
        {/* Wheatpaste paper poster card container - faded, frayed edges and dot matrix textures */}
        <div className="relative mx-auto max-w-7xl overflow-visible bg-canvas-soft p-[3px] sm:p-[5px] wheatpaste-poster">

          {/* Inner printed dark green poster layer */}
          <div className="bg-primary-deep dark:bg-brand-dark-900 text-canvas p-8 md:p-12 w-full h-full relative z-10">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* Left Column: Logo & Tagline & Contact info */}
              <div className="lg:col-span-4 space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
                {/* Logo block */}
                <div className="flex flex-col items-center lg:items-start group select-none">
                  <div className="flex items-center gap-1.5 sm:gap-3">
                    <GoldBarsSVG className="w-8 h-6 sm:w-10 sm:h-7.5 shrink-0 select-none opacity-80 group-hover:opacity-100 group-hover:scale-x-[-1.05] group-hover:scale-y-[1.05] transition-all filter drop-shadow-[0_0_4px_var(--color-accent)]" />
                    <img
                      src="/atzengold-logo.webp"
                      alt="Atzengold Logo"
                      className="h-12 md:h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                    />
                    <GoldBarsSVG mirrored={true} className="w-8 h-6 sm:w-10 sm:h-7.5 shrink-0 select-none opacity-80 group-hover:opacity-100 group-hover:scale-x-[1.05] group-hover:scale-y-[1.05] transition-all filter drop-shadow-[0_0_4px_var(--color-accent)]" />
                  </div>
                  <span className="text-xl sm:text-2xl font-handwritten text-accent mt-3 leading-none">
                    Franken x Berlin
                  </span>
                </div>

                {/* Tagline */}
                <p className="text-sm text-canvas/70 font-medium max-w-sm">
                  {lang === 'en' 
                    ? 'Traditional unfiltered cellar beer culture. Brewed with heritage ingredients for authentic flavor.' 
                    : 'Naturtrübe Kellerbier-Kultur für beste Atzen. Traditionell handwerklich gebraut mit echten Werten.'}
                </p>

                {/* Contact info (compact mono specs) */}
                <div className="text-[11px] text-canvas/50 font-mono space-y-1 pt-2">
                  <div>
                    E-Mail: <a href="mailto:info@atzengold.net" className="hover:text-accent underline transition-colors">info@atzengold.net</a>
                  </div>
                  <div>
                    Tel: <a href="tel:+4917662345740" className="hover:text-accent underline transition-colors">+49 (0) 176 623 457 40</a>
                  </div>
                  <div>
                    {lang === 'en' ? 'Address: Atzenhofer Str. 76, 90768 Fürth' : 'Adresse: Atzenhofer Str. 76, 90768 Fürth (Atzenhof)'}
                  </div>
                </div>
              </div>

              {/* Right Area: Menus + Newsletter underneath */}
              <div className="lg:col-span-8 flex flex-col gap-8">
                {/* Menu columns */}
                <div className="grid grid-cols-1 gap-8 w-full md:px-4">

                  {/* Legal column */}
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs uppercase tracking-wider text-accent font-bold font-sans">
                      {lang === 'en' ? 'Legal' : 'Rechtliches'}
                    </h4>
                    <div className="flex flex-col gap-2 text-sm text-canvas/70 font-medium items-start">
                  <button 
                    onClick={() => setShowImpressum(true)} 
                    className="hover:text-accent transition-colors cursor-pointer text-left focus:outline-none"
                  >
                    Impressum
                  </button>
                  <button 
                    onClick={() => setShowDatenschutz(true)} 
                    className="hover:text-accent transition-colors cursor-pointer text-left focus:outline-none"
                  >
                    Datenschutz
                  </button>
                  <button 
                    onClick={() => setShowAGB(true)} 
                    className="hover:text-accent transition-colors cursor-pointer text-left focus:outline-none"
                  >
                    AGB
                  </button>
                  <button 
                    onClick={() => setShowWiderrufsrecht(true)} 
                    className="hover:text-accent transition-colors cursor-pointer text-left focus:outline-none"
                  >
                    {lang === 'en' ? 'Right of Withdrawal' : 'Widerrufsrecht'}
                  </button>
                  <button 
                    onClick={() => setShowCookieBanner(true)} 
                    className="hover:text-accent transition-colors cursor-pointer text-left focus:outline-none"
                  >
                    {lang === 'en' ? 'Cookies' : 'Cookie-Einstellungen'}
                  </button>

                  {/* Admin-CMS-Einstieg auskommentiert (Gabriel: "Nur auskommentieren") — Code bleibt erhalten.
                  <button
                    onClick={() => setIsAdmin(true)}
                    className="text-[10px] text-canvas/30 hover:text-accent transition-colors cursor-pointer text-left font-mono focus:outline-none opacity-40 hover:opacity-100"
                  >
                    Admin
                  </button>
                  */}
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* Bottom Bar: Divider, Copyright, Centered Socials, Age check */}
            <div className="mt-12 pt-8 border-t border-canvas/10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-canvas/50">
              
              {/* Copyright */}
              <div className="text-center md:text-left font-mono">
                © {new Date().getFullYear()} Atzengold GbR. {lang === 'en' ? 'All rights reserved.' : 'Alle Rechte vorbehalten.'}
              </div>

              {/* Centered Socials & Circular Flag Language Switcher */}
              <div className="flex gap-4 items-center justify-center">
                <a 
                  href="https://www.instagram.com/atzengold/" 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="Instagram"
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-canvas/10 hover:bg-accent hover:text-ink text-canvas transition-all duration-200 border border-canvas/20 shadow-sm"
                >
                  <Instagram className="h-4.5 w-4.5" />
                </a>
                <button 
                  onClick={() => setLang(prev => prev === 'en' ? 'de' : 'en')}
                  aria-label={lang === 'en' ? "Switch to German" : "Switch to English"}
                  title={lang === 'en' ? "Switch to German" : "Switch to English"}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-canvas/10 hover:scale-105 active:scale-95 transition-all duration-200 border border-canvas/20 shadow-sm p-0 cursor-pointer focus:outline-none text-canvas"
                >
                  <span className="text-xs font-bold font-mono tracking-wide">
                    {lang === 'en' ? 'EN' : 'DE'}
                  </span>
                </button>
                <a 
                  href="mailto:info@atzengold.net" 
                  aria-label="E-Mail"
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-canvas/10 hover:bg-accent hover:text-ink text-canvas transition-all duration-200 border border-canvas/20 shadow-sm"
                >
                  <Mail className="h-4.5 w-4.5" />
                </a>
              </div>

              {/* Responsible drinking notice & age reset */}
              <div className="flex flex-col sm:flex-row gap-4 items-center md:items-end text-right text-[11px] font-mono">
                <button 
                  onClick={() => {
                    localStorage.removeItem('atzengold_age_verified');
                    window.location.reload();
                  }} 
                  className="hover:text-accent underline transition-colors cursor-pointer text-left"
                >
                  {lang === 'en' ? 'Reset Age Check' : 'Altersprüfung zurücksetzen'}
                </button>
                <div className="flex items-center gap-1.5 justify-center sm:justify-end text-accent/80">
                  <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    {lang === 'en' ? 'Drink responsibly. Age 16+' : 'Genuss ab 16 Jahren.'}
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </footer>

    </div>
  );
}
