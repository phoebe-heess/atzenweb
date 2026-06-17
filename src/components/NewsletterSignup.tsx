import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ArrowRight, Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface NewsletterSignupProps {
  lang: 'de' | 'en' | 'de-BY';
  theme: 'dark' | 'light';
}

const LOCAL_TRANSLATIONS = {
  de: {
    title: "Post vom Späti-Eck",
    subtitle: "Trag dich für den Atzengold-Ticker ein. Kein Spam, nur echte Straßen-News, geheime Pop-ups und frischer Merch-Drop-Alarm.",
    placeholder: "Deine Atzen-E-Mail...",
    button: "Anmelden",
    loading: "Wird verschickt...",
    successTitle: "Einwandfrei, Atze!",
    successText: "Du bist jetzt im Ticker! Schnapp dir dein Frischbier, wir melden uns bald mit exklusiven Aktionen.",
    invalidEmail: "Gib bitte eine richtige E-Mail-Adresse ein!",
    alreadySubscribed: "Diese E-Mail ist bereits registriert!",
    disclaimer: "Abgabe von News nur an Personen im durstigen Alter. jederzeit abbestellbar."
  },
  'de-BY': {
    title: "Post vom Bier-Revier",
    subtitle: "Trag di fürn Atzengold-Kanal ei! Koa Schmarrn, bloß echte Gschichten, geheime Standorte und frischer Gwand-Drop-Alarm.",
    placeholder: "Dei Atzn-E-Mail...",
    button: "Abonnieren",
    loading: "Wird gschickt...",
    successTitle: "Aba sowas von!",
    successText: "Du bist etz im Ticker! Beidl dei Tragerl, wir meldn uns demnächst mit exklusiven Gaudi-Aktionen.",
    invalidEmail: "Sacklzement, gib a gscheide E-Mail-Adresse ei!",
    alreadySubscribed: "De E-Mail-Adress hamma fei scho!",
    disclaimer: "Abgab eh erst ab 16. Und abbestelln kannst des Gschmarri fei a jederzeit."
  },
  en: {
    title: "Asphalt Dispatches",
    subtitle: "Subscribe to the Atzengold newsletter. Zero spam, just raw pavement updates, pop-up announcements, and fresh merch alerts.",
    placeholder: "Your email adress...",
    button: "Subscribe",
    loading: "Signing up...",
    successTitle: "Outstanding, Atze!",
    successText: "You are on the list! Grab a cold unfiltered one, we'll keep you posted with secret corner drops soon.",
    invalidEmail: "Please enter a valid email address!",
    alreadySubscribed: "This email is already subscribed!",
    disclaimer: "Dispatches intended for thirsty folks. Opt-out anytime."
  }
};

export default function NewsletterSignup({ lang, theme }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const t = LOCAL_TRANSLATIONS[lang] || LOCAL_TRANSLATIONS.de;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Native validation
    if (!email) {
      setStatus('error');
      setErrorMessage(t.invalidEmail);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setErrorMessage(t.invalidEmail);
      return;
    }

    setStatus('loading');

    // Perform serverless email forwarding request
    fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'newsletter',
        email
      })
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Subscription failed');
        }
        setStatus('success');
        setEmail('');
      })
      .catch((err) => {
        setStatus('error');
        setErrorMessage(t.invalidEmail);
      });
  };

  // The wrapper styling uses the new organic theme: rounded corners, soft shadows, and paper texture
  return (
    <div 
      id="newsletter-signup-box"
      className="relative w-full p-8 md:p-12 rounded-3xl border border-ink/10 bg-accent shadow-xl overflow-hidden texture-paper transition-all"
    >
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          /* Animated high-fidelity success state view representation */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center text-center py-6 space-y-4"
          >
            <div className="w-16 h-16 bg-canvas/90 rounded-full flex items-center justify-center text-ink shadow-md border border-ink/10 animate-bounce">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-display font-black tracking-widest flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-ink animate-pulse" />
                {t.successTitle}
              </h3>
              <p className="text-xs max-w-sm font-sans font-bold text-ink/80">
                {t.successText}
              </p>
            </div>

            <button
              onClick={() => setStatus('idle')}
              className="mt-2 cursor-pointer text-xs font-mono font-bold uppercase underline tracking-wider text-ink hover:bg-ink hover:text-accent px-2 py-1 transition-colors animate-snap"
            >
              {lang === 'en' ? 'Register another email' : 'Weitere E-Mail eintragen'}
            </button>
          </motion.div>
        ) : (
          /* Main Interactive Newsletter Signup Input fields section */
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h3 className="text-[2rem] sm:text-[2.375rem] font-handwritten font-bold tracking-normal flex items-center gap-2 text-ink">
                <Mail className="h-6 w-6 text-ink" />
                {t.title}
              </h3>
              <p className="text-sm font-bold font-sans max-w-lg leading-snug text-ink">
                {t.subtitle}
              </p>
            </div>
 
            <form onSubmit={handleSubscribe} className="space-y-4 relative z-10">
              <div className="flex flex-col sm:flex-row gap-4 relative">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/60">
                    <Mail className="h-5 w-5" />
                  </span>
                  
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    placeholder={t.placeholder}
                    disabled={status === 'loading'}
                    className="w-full py-4 pl-12 pr-4 bg-canvas/90 backdrop-blur-sm rounded-xl border border-ink/20 text-ink font-mono font-bold text-sm placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-ink focus:bg-white transition-all shadow-inner"
                  />
                </div>
 
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="shrink-0 cursor-pointer bg-[#0033A0] hover:bg-[#002a80] text-white px-8 py-4 text-xs font-sans font-black uppercase tracking-wider transition-all duration-200 shadow-md hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-wait rounded-lg border-4 border-white relative before:absolute before:inset-[3px] before:border before:border-white before:rounded-[3px] before:pointer-events-none"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="font-mono text-xs">{t.loading}</span>
                    </>
                  ) : (
                    <span>{t.button}</span>
                  )}
                </button>
              </div>

              {/* Error feedback alert popup banner inline */}
              <AnimatePresence>
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex items-center gap-2 text-xs font-mono font-bold text-red-800 bg-red-50 rounded-xl border border-red-200 p-3 shadow-sm"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink/70">
              {t.disclaimer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
