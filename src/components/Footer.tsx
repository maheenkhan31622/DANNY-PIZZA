import { MapPin, Phone, Clock, MessageCircle } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';
import { AtomicText } from './AtomicText';

export function Footer() {
  return (
    <footer className="mt-10 border-t border-red-900/15 dark:border-red-500/20 bg-white/80 dark:bg-[#0E0406] text-[#1F0B0D] dark:text-white transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Brand */}
          <div className="flex items-start gap-3.5">
            <div className="h-14 w-14 shrink-0 rounded-full p-0.5 bg-gradient-to-tr from-red-600 to-amber-500 shadow-md">
              <img
                src={RESTAURANT_INFO.logoUrl}
                alt="DANNY PIZZA"
                loading="lazy"
                className="h-full w-full rounded-full object-cover bg-black"
              />
            </div>
            <div>
              <h3 className="font-display text-2xl font-extrabold tracking-tight">
                {RESTAURANT_INFO.name}
              </h3>
              <p className="text-xs font-semibold text-red-700 dark:text-red-400">
                {RESTAURANT_INFO.tagline}
              </p>
              <p className="mt-2 text-xs text-[#5C3337] dark:text-red-200/70">
                Dine-In · Takeaway · Home Delivery · Online Ordering
              </p>
            </div>
          </div>

          {/* Location & Hours */}
          <div className="space-y-2.5 text-xs sm:text-sm text-[#5C3337] dark:text-red-100/80">
            <a
              href={RESTAURANT_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2.5 hover:text-red-700 dark:hover:text-white transition-colors"
            >
              <MapPin className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
              <span>
                <AtomicText text={RESTAURANT_INFO.address} />
              </span>
            </a>
            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
              <span>
                Open Daily: <AtomicText text={RESTAURANT_INFO.hours} />
              </span>
            </div>
          </div>

          {/* Direct Contact */}
          <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2.5">
            <a
              href={`tel:${RESTAURANT_INFO.phoneDisplay}`}
              className="inline-flex items-center gap-2 rounded-xl border border-red-900/15 dark:border-red-500/25 bg-red-50 dark:bg-[#1E0A0E] px-4 py-2 text-xs sm:text-sm font-bold hover:border-red-500 transition-colors"
            >
              <Phone className="h-4 w-4 text-red-600 dark:text-red-400" />
              <span>Call: {RESTAURANT_INFO.phoneDisplay}</span>
            </a>
            <a
              href={`https://wa.me/${RESTAURANT_INFO.whatsappE164}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] px-4 py-2 text-xs sm:text-sm font-bold text-white transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Order on WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-red-900/10 dark:border-red-500/15 pt-5 text-center text-xs text-[#5C3337] dark:text-red-200/60">
          &copy; {new Date().getFullYear()} {RESTAURANT_INFO.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
