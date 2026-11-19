import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Clock, MapPin, ChevronLeft, ChevronRight, Phone } from 'lucide-react';
import { HERO_SLIDES, RESTAURANT_INFO } from '../data/menuData';
import type { MenuCategory, OrderType } from '../types';
import { SkeletonImage } from './SkeletonImage';
import { AtomicText } from './AtomicText';

interface HeroSliderProps {
  selectedAreaName: string;
  orderType: OrderType;
  onChangeLocation: () => void;
  onExploreCategory: (cat: MenuCategory) => void;
}

export function HeroSlider({
  selectedAreaName,
  orderType,
  onChangeLocation,
  onExploreCategory,
}: HeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Continuous 3-second infinite auto-slide loop
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentSlide = HERO_SLIDES[activeIndex];

  const handleOrderNow = () => {
    onExploreCategory(currentSlide.targetCategory);
    const el = document.getElementById('menu-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="top"
      className="relative w-full overflow-hidden border-b border-red-900/10 dark:border-red-500/20"
    >
      <div className="relative h-[380px] sm:h-[460px] lg:h-[520px] w-full overflow-hidden bg-[#FFF4F4] dark:bg-[#160508] transition-colors duration-300">
        <AnimatePresence mode="sync">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 h-full w-full"
          >
            <SkeletonImage
              src={currentSlide.image}
              alt={currentSlide.title}
              priority={activeIndex === 0}
              className="h-full w-full object-cover brightness-105 contrast-[0.98] dark:brightness-90 dark:contrast-100 transition-[filter] duration-300"
            />
          </motion.div>
        </AnimatePresence>

        {/* Dual-theme adaptive scrims: Bright airy blush-cream wash in Light Mode, deep crimson-obsidian in Dark Mode */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#FFF8F8]/95 via-[#FCEEEE]/82 to-[#FFF8F8]/15 dark:from-[#090203]/95 dark:via-[#140407]/72 dark:to-transparent transition-colors duration-300" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#FBEBEB]/90 via-transparent to-white/35 dark:from-[#0A0304]/90 dark:via-transparent dark:to-black/35 transition-colors duration-300" />

        {/* Hero Copy Overlay */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-between px-4 py-6 sm:px-6 sm:py-10">
          {/* Top Location & Fulfillment Selector Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={onChangeLocation}
              className="inline-flex max-w-full items-center gap-2 rounded-xl border border-red-900/15 bg-white/85 hover:bg-white text-[#1F0B0D] dark:border-white/25 dark:bg-black/45 dark:text-white dark:hover:bg-black/65 backdrop-blur-md px-3 py-1.5 text-xs sm:text-sm font-medium shadow-sm transition-colors cursor-pointer"
            >
              <MapPin className="h-3.5 w-3.5 shrink-0 text-red-600 dark:text-amber-300" />
              <span className="capitalize font-bold text-red-700 dark:text-amber-200 shrink-0">
                {orderType}
              </span>
              <span className="text-red-900/35 dark:text-white/50">·</span>
              <span className="truncate max-w-[170px] sm:max-w-[300px]">{selectedAreaName}</span>
              <span className="text-red-600 dark:text-red-300 text-[11px] font-bold shrink-0">
                Change
              </span>
            </button>

            <a
              href={`tel:${RESTAURANT_INFO.phoneDisplay}`}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-red-900/15 bg-white/85 hover:bg-white text-[#1F0B0D] dark:border-white/20 dark:bg-black/40 dark:text-white dark:hover:bg-black/60 backdrop-blur-md px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-red-600 dark:text-amber-300" />
              <span>{RESTAURANT_INFO.phoneDisplay}</span>
            </a>
          </div>

          {/* Center-Left Editorial Headline */}
          <div className="max-w-2xl my-auto py-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id + '-copy'}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-red-700 dark:text-amber-300 mb-2">
                  {currentSlide.eyebrow}
                </p>
                <h1 className="font-display text-3xl sm:text-5xl lg:text-[54px] font-extrabold leading-[1.05] text-[#1F0B0D] dark:text-white text-balance dark:drop-shadow-sm">
                  <AtomicText text={currentSlide.title} />
                </h1>
                <p className="mt-2.5 sm:mt-3 max-w-xl text-sm sm:text-base text-[#4E2529] dark:text-rose-100/90 leading-relaxed line-clamp-2 sm:line-clamp-none">
                  <AtomicText text={currentSlide.subtitle} />
                </p>

                <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleOrderNow}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-bold text-white shadow-lg shadow-red-900/25 dark:shadow-red-950/50 transition-transform active:scale-95 whitespace-nowrap cursor-pointer"
                  >
                    <span>{currentSlide.ctaText}</span>
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </button>

                  <a
                    href={RESTAURANT_INFO.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-red-900/20 bg-white/85 hover:bg-white text-[#1F0B0D] dark:border-white/25 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white backdrop-blur-md px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold shadow-sm transition-colors whitespace-nowrap"
                  >
                    <Clock className="h-4 w-4 text-red-600 dark:text-amber-300 shrink-0" />
                    <span>Open {RESTAURANT_INFO.hours}</span>
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Controls & Slide Progress */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {HERO_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeIndex
                      ? 'w-8 bg-red-600 dark:bg-red-500'
                      : 'w-2.5 bg-red-900/25 hover:bg-red-900/50 dark:bg-white/40 dark:hover:bg-white/70'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setActiveIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
                }
                aria-label="Previous slide"
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-red-900/15 bg-white/85 text-[#1F0B0D] dark:border-white/25 dark:bg-black/40 dark:text-white hover:bg-red-600 hover:text-white hover:border-red-500 transition-colors cursor-pointer shadow-sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length)}
                aria-label="Next slide"
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-red-900/15 bg-white/85 text-[#1F0B0D] dark:border-white/25 dark:bg-black/40 dark:text-white hover:bg-red-600 hover:text-white hover:border-red-500 transition-colors cursor-pointer shadow-sm"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
