import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Clock, Send, X, HelpCircle, Pizza, MapPin } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

interface FloatingWhatsAppProps {
  autoExpandTooltip?: boolean;
}

const POP_SOUND_DATA_URI =
  'data:audio/wav;base64,UklGRpAAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YWwAAAB9fX5/gYOEh4qNkJOUlpeYmJqbmZqYl5STkI6LiIaDgH16eHZ0cW9ubm1ub3BydXh7f4KGio6SlZqeoKKjpKOgnpuYlZKQjYmHg4B8enh2dHJxcXFyc3Z5fIGFiI2SlJianZ+goaCempeUkI2Jh4B8d3NubQ==';

function getDynamicWaitTime(): { label: string; minutes: string } {
  const now = new Date();
  const hour = now.getHours();
  if (hour >= 20 && hour <= 23) {
    return { label: 'Peak Dinner Rush', minutes: '35–45 mins' };
  }
  if ((hour >= 16 && hour < 20) || (hour >= 0 && hour < 2)) {
    return { label: 'Kitchen Express', minutes: '20–30 mins' };
  }
  return { label: 'Opens at 4:30 PM', minutes: '20–25 mins (Pre-Order)' };
}

const WHATSAPP_TEMPLATES = [
  {
    id: 'track',
    title: 'How to track my order',
    message: 'Hello Danny Pizza! Can you help me check how to track my order status?',
    icon: HelpCircle,
  },
  {
    id: 'deals',
    title: 'Menu & Pizza Deals inquiry',
    message: 'Hello Danny Pizza! I would like to ask about Deal 01, Deal 02, Deal 03, or the Family Deal.',
    icon: Pizza,
  },
  {
    id: 'delivery',
    title: 'Delivery time to my area',
    message: 'Hello Danny Pizza! What is the current delivery time to my area in Karachi?',
    icon: MapPin,
  },
  {
    id: 'support',
    title: 'Talk to Danny Pizza support',
    message: 'Hello Danny Pizza! I want to place an order or speak with your team.',
    icon: MessageCircle,
  },
];

export function FloatingWhatsApp({ autoExpandTooltip = true }: FloatingWhatsAppProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [autoTooltipVisible, setAutoTooltipVisible] = useState(autoExpandTooltip);
  const [greetingVisible, setGreetingVisible] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const soundPlayedRef = useRef(false);

  const waitTime = useMemo(() => getDynamicWaitTime(), []);

  useEffect(() => {
    audioRef.current = new Audio(POP_SOUND_DATA_URI);
    audioRef.current.volume = 0.25;
  }, []);

  // Auto 3-second tooltip expansion on mount for Wait Time awareness
  useEffect(() => {
    if (!autoExpandTooltip) {
      setAutoTooltipVisible(false);
      return;
    }
    setAutoTooltipVisible(true);
    const timer = setTimeout(() => {
      setAutoTooltipVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [autoExpandTooltip]);

  // Slide-in "Need help?" greeting 3 seconds after mount + subtle notification pop sound
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setGreetingVisible(true);
      if (!soundPlayedRef.current && audioRef.current) {
        soundPlayedRef.current = true;
        audioRef.current.play().catch(() => {
          // Browsers may block audio until first user gesture; fail silently
        });
      }
    }, 3000);

    const hideTimer = setTimeout(() => {
      setGreetingVisible(false);
    }, 8500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const showWaitTooltip = (hovered || autoTooltipVisible) && !menuOpen;

  return (
    <div
      className="fixed left-3.5 bottom-3.5 sm:left-6 sm:bottom-6 z-40 flex flex-col items-start gap-2.5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* All WhatsApp cards, tooltips, and greetings render STRICTLY ABOVE the icon on both mobile & desktop */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.94 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="w-[290px] max-w-[calc(100vw-2rem)] sm:w-[320px] rounded-2xl border border-red-500/25 bg-white/90 dark:bg-[#1a080b]/90 backdrop-blur-xl shadow-2xl shadow-black/30 overflow-hidden"
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-[#168A45] to-[#128C7E] px-4 py-3 text-white">
              <div className="min-w-0">
                <p className="text-sm font-bold truncate">DANNY PIZZA WhatsApp</p>
                <p className="text-[11px] text-emerald-100 truncate">
                  Wait Time: {waitTime.minutes}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close WhatsApp menu"
                className="rounded-lg p-1 text-white/85 hover:bg-white/15 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-3 space-y-2">
              <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-red-900/60 dark:text-red-200/60">
                Quick WhatsApp Messages
              </p>
              {WHATSAPP_TEMPLATES.map((tpl) => {
                const Icon = tpl.icon;
                const href = `https://wa.me/${RESTAURANT_INFO.whatsappE164}?text=${encodeURIComponent(
                  tpl.message
                )}`;
                return (
                  <a
                    key={tpl.id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between gap-2.5 rounded-xl border border-red-900/10 dark:border-red-400/15 bg-white/70 dark:bg-white/5 px-3 py-2.5 text-left text-xs font-medium text-[#1F0B0D] dark:text-white hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-colors"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <Icon className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span className="truncate">{tpl.title}</span>
                    </span>
                    <Send className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Wait Time Tooltip ABOVE the icon */}
      <AnimatePresence>
        {showWaitTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.22 }}
            className="pointer-events-none flex items-center gap-2 rounded-xl border border-red-500/20 bg-white/95 dark:bg-[#1C0A0D]/95 backdrop-blur-md px-3 py-2 text-xs shadow-lg max-w-[calc(100vw-2rem)]"
          >
            <Clock className="h-3.5 w-3.5 shrink-0 text-red-600 dark:text-red-400" />
            <div className="leading-snug">
              <span className="font-semibold text-[#1F0B0D] dark:text-white">
                Wait Time: {waitTime.minutes}
              </span>
              <span className="ml-1.5 text-[11px] text-red-900/65 dark:text-red-200/70">
                · {waitTime.label}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* "Need help?" Greeting ABOVE the icon */}
      <AnimatePresence>
        {greetingVisible && !showWaitTooltip && !menuOpen && (
          <motion.button
            type="button"
            onClick={() => {
              setMenuOpen(true);
              setGreetingVisible(false);
            }}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-xl border border-emerald-500/35 bg-white/95 dark:bg-[#1C0A0D]/95 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-[#1F0B0D] dark:text-white shadow-lg hover:border-emerald-500 transition-colors whitespace-nowrap cursor-pointer"
          >
            Need help?
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Icon Button */}
      <button
        type="button"
        onClick={() => {
          setMenuOpen((v) => !v);
          setGreetingVisible(false);
          setAutoTooltipVisible(false);
        }}
        aria-label="Contact Danny Pizza on WhatsApp"
        className="relative flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-xl shadow-emerald-950/35 ring-2 ring-white/80 dark:ring-red-950/70 transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
      >
        <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7 fill-current" />
      </button>
    </div>
  );
}
