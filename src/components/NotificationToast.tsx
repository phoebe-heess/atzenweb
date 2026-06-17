import { Bell, Sparkles, X } from 'lucide-react';

interface NotificationToastProps {
  message: string;
  onClose: () => void;
  lang: 'de' | 'en' | 'de-BY';
}

export default function NotificationToast({ message, onClose, lang }: NotificationToastProps) {
  const isEn = lang === 'en';

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 max-w-md w-full sm:w-[380px] rounded-2xl border border-ink/10 dark:border-canvas/10 bg-canvas dark:bg-brand-dark-900 p-4 flex gap-3.5 items-start justify-between scroll-smooth shadow-xl animate-slideUp"
    >
      
      <div className="relative h-10 w-10 shrink-0 rounded-full border border-ink/10 bg-accent flex items-center justify-center text-ink shadow-md">
        <Bell className="h-5 w-5 animate-bounce" strokeWidth={2} />
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full bg-ink opacity-75"></span>
          <span className="relative inline-flex h-2.5 w-2.5 bg-ink"></span>
        </span>
      </div>

      <div className="flex-grow select-none">
        <div className="flex items-center gap-1 border-b border-ink/10 dark:border-canvas/10 pb-1 mb-1">
          <span className="text-[10px] font-mono font-black text-ink dark:text-canvas uppercase tracking-widest leading-none">
            {isEn ? 'PUSH ALERT' : 'PUSH BENACHRICHTIGUNG'}
          </span>
          <Sparkles className="h-3 w-3 text-accent" strokeWidth={2} />
        </div>
        
        <p className="text-xs text-ink-secondary dark:text-canvas/80 font-bold leading-relaxed mt-1">
          {message}
        </p>

        <div className="flex items-center gap-4 mt-2.5">
          <button
            onClick={onClose}
            className="cursor-pointer text-[10px] bg-ink hover:bg-black text-canvas font-black rounded-full px-3 py-1.5 border border-ink/10 shadow hover:-translate-y-0.5 hover:shadow-md uppercase tracking-wide transition-all"
          >
            {isEn ? 'Awesome, Cheers!' : 'Prost, Atze! Cheers!'}
          </button>
          
          <span className="text-[9px] font-mono text-ink-mute font-bold uppercase">Atzengold CRM v2.0</span>
        </div>
      </div>

      <button
        onClick={onClose}
        className="p-1 rounded-full border border-ink/10 bg-canvas-soft hover:bg-ink text-ink hover:text-canvas transition-colors cursor-pointer shrink-0 shadow hover:-translate-y-0.5 hover:shadow-md"
      >
        <X className="h-4 w-4" strokeWidth={2} />
      </button>

    </div>
  );
}
