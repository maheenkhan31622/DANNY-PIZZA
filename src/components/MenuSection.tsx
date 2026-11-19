import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Mic, MicOff, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { MENU_CATEGORIES, MENU_ITEMS } from '../data/menuData';
import type { CartItem, MenuCategory, MenuItem } from '../types';
import { MenuCard } from './MenuCard';

interface MenuSectionProps {
  activeCategory: MenuCategory;
  onSelectCategory: (cat: MenuCategory) => void;
  cartItems: CartItem[];
  favoriteIds: string[];
  onToggleFavorite: (itemId: string) => void;
  onAddToCart: (
    item: MenuItem,
    selectedSize: string | undefined,
    selectedFlavor: string | undefined,
    unitPrice: number,
    imgRect: DOMRect | null
  ) => void;
  onUpdateQuantity: (cartKey: string, delta: number) => void;
}

export function MenuSection({
  activeCategory,
  onSelectCategory,
  cartItems,
  favoriteIds,
  onToggleFavorite,
  onAddToCart,
  onUpdateQuantity,
}: MenuSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [listening, setListening] = useState(false);
  const [voiceNote, setVoiceNote] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const categoryRailRef = useRef<HTMLDivElement | null>(null);
  const catBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const prevCategoryRef = useRef<MenuCategory>(activeCategory);

  // Smoothly center active category button & trigger video-matched shimmer crossfade on category switch
  useEffect(() => {
    const activeBtn = catBtnRefs.current[activeCategory];
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }

    if (prevCategoryRef.current !== activeCategory) {
      prevCategoryRef.current = activeCategory;
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 170);
      return () => clearTimeout(timer);
    }
  }, [activeCategory]);

  // Order categories so the selected category appears FIRST right under the bar,
  // followed by ALL remaining categories and items below it!
  const orderedCategories = useMemo(() => {
    return [activeCategory, ...MENU_CATEGORIES.filter((c) => c !== activeCategory)];
  }, [activeCategory]);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;
    return MENU_ITEMS.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const activeCategoryItemsCount = useMemo(
    () => MENU_ITEMS.filter((item) => item.category === activeCategory).length,
    [activeCategory]
  );

  const scrollCategories = (dir: 'left' | 'right') => {
    if (!categoryRailRef.current) return;
    const offset = dir === 'left' ? -200 : 200;
    categoryRailRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const handleVoiceSearch = () => {
    const SpeechRec =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any })
        .SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any })
        .webkitSpeechRecognition;

    if (!SpeechRec) {
      setVoiceNote('Voice search is not supported in this browser.');
      setTimeout(() => setVoiceNote(null), 3000);
      return;
    }

    const recognition = new SpeechRec();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setListening(true);
    setVoiceNote(null);

    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      if (transcript) {
        setSearchQuery(transcript);
      }
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
      setVoiceNote('Could not capture voice. Please try speaking again.');
      setTimeout(() => setVoiceNote(null), 2600);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  return (
    <section id="menu-section" className="mx-auto max-w-7xl px-3 sm:px-6 py-6 sm:py-10">
      {/* Search Bar (with Web Speech Voice-to-Text) + Item Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5">
        <div className="relative flex-1 max-w-xl">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-red-700/60 dark:text-red-300/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pizzas, deals, BBQ, zinger, rolls..."
            className="w-full rounded-xl border border-red-900/15 dark:border-red-500/25 bg-white dark:bg-[#19080B] py-2.5 pl-10 pr-20 text-sm text-[#1F0B0D] dark:text-white placeholder:text-red-900/40 dark:placeholder:text-red-200/40 focus:border-red-600 focus:outline-none shadow-sm"
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="rounded-lg p-1.5 text-red-900/50 dark:text-red-200/60 hover:bg-red-100 dark:hover:bg-red-950/60 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={handleVoiceSearch}
              aria-label="Voice search menu"
              title="Voice search"
              className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                listening
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950/60'
              }`}
            >
              {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 text-xs sm:text-sm font-bold text-[#1F0B0D] dark:text-white">
          <span className="truncate">
            {searchResults ? 'Search Results' : activeCategory}
          </span>
          <span className="text-red-700 dark:text-red-400 tabular-nums">
            ({searchResults ? searchResults.length : activeCategoryItemsCount})
          </span>
        </div>
      </div>

      {voiceNote && (
        <p className="mb-3 text-xs font-medium text-red-600 dark:text-red-400">{voiceNote}</p>
      )}

      {/* Horizontal Scrollable Category Tabs (No 'All' button) with Video-Matched Sliding Active Highlight & Centering */}
      <div className="relative flex items-center gap-1.5 sm:gap-2 mb-6">
        <button
          type="button"
          onClick={() => scrollCategories('left')}
          aria-label="Scroll categories left"
          className="flex h-9 w-8 sm:h-10 sm:w-9 shrink-0 items-center justify-center rounded-xl border border-red-900/15 dark:border-red-500/20 bg-white dark:bg-[#19080B] text-[#1F0B0D] dark:text-white hover:border-red-500 transition-colors shadow-xs cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div
          ref={categoryRailRef}
          className="no-scrollbar flex flex-1 items-center gap-2 overflow-x-auto scroll-smooth py-1 px-0.5"
        >
          {MENU_CATEGORIES.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                ref={(el) => {
                  catBtnRefs.current[cat] = el;
                }}
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  onSelectCategory(cat);
                }}
                className={`relative z-10 shrink-0 rounded-xl px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold transition-colors duration-200 whitespace-nowrap cursor-pointer border ${
                  active
                    ? 'border-transparent text-white shadow-md shadow-red-900/20'
                    : 'border-red-900/15 dark:border-red-500/20 bg-white dark:bg-[#19080B] text-[#4E2529] dark:text-red-100/80 hover:border-red-500/60 hover:text-red-700 dark:hover:text-white'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="menu-category-active-bg"
                    transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                    className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-[#B91C1C] to-[#DC2626] shadow-md shadow-red-900/25"
                  />
                )}
                {cat}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => scrollCategories('right')}
          aria-label="Scroll categories right"
          className="flex h-9 w-8 sm:h-10 sm:w-9 shrink-0 items-center justify-center rounded-xl border border-red-900/15 dark:border-red-500/20 bg-white dark:bg-[#19080B] text-[#1F0B0D] dark:text-white hover:border-red-500 transition-colors shadow-xs cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Menu Grid: Selected category first at top, followed by ALL other categories & items below */}
      <AnimatePresence mode="wait">
        {isTransitioning ? (
          <motion.div
            key="skeleton-transition"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14 }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5"
          >
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-red-900/10 dark:border-red-500/15 bg-gradient-to-b from-white via-[#FFF5F5] to-[#FDE8E8] dark:from-[#1A080C] dark:to-[#130508] overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] w-full bg-red-100/70 dark:bg-red-950/40" />
                <div className="p-3 sm:p-4 space-y-2">
                  <div className="h-2.5 w-1/3 rounded bg-red-200/70 dark:bg-red-900/40" />
                  <div className="h-3.5 w-3/4 rounded bg-red-200/80 dark:bg-red-900/50" />
                  <div className="h-2.5 w-full rounded bg-red-100/80 dark:bg-red-950/60" />
                  <div className="pt-2 h-8 w-full rounded-xl bg-red-200/60 dark:bg-red-900/35" />
                </div>
              </div>
            ))}
          </motion.div>
        ) : searchResults ? (
          <motion.div
            key={'search_' + searchQuery}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5"
          >
            {searchResults.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                cartItems={cartItems}
                isFavorite={favoriteIds.includes(item.id)}
                onToggleFavorite={onToggleFavorite}
                onAddToCart={onAddToCart}
                onUpdateQuantity={onUpdateQuantity}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 sm:space-y-10"
          >
            {orderedCategories.map((catName, sectionIdx) => {
              const catItems = MENU_ITEMS.filter((item) => item.category === catName);
              return (
                <div key={catName} className="space-y-3 sm:space-y-4">
                  <div
                    className={`flex items-center justify-between border-b pb-2 ${
                      sectionIdx === 0
                        ? 'border-red-600/30 dark:border-red-500/35'
                        : 'border-red-900/10 dark:border-red-500/15'
                    }`}
                  >
                    <h2 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-[#1F0B0D] dark:text-white">
                      {catName}
                    </h2>
                    <span className="text-xs sm:text-sm font-bold text-red-700 dark:text-red-400 tabular-nums">
                      {catItems.length} {catItems.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                    {catItems.map((item) => (
                      <MenuCard
                        key={item.id}
                        item={item}
                        cartItems={cartItems}
                        isFavorite={favoriteIds.includes(item.id)}
                        onToggleFavorite={onToggleFavorite}
                        onAddToCart={onAddToCart}
                        onUpdateQuantity={onUpdateQuantity}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {!isTransitioning && searchResults && searchResults.length === 0 && (
        <div className="my-12 rounded-2xl border border-red-900/15 dark:border-red-500/20 bg-white dark:bg-[#19080B] p-8 text-center">
          <p className="text-base font-bold text-[#1F0B0D] dark:text-white">
            No menu items matched &ldquo;{searchQuery}&rdquo;
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              onSelectCategory('Pizza Deals');
            }}
            className="mt-4 rounded-xl bg-red-600 hover:bg-red-700 px-5 py-2 text-xs font-bold text-white cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
}
