import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Minus, Plus, ShoppingCart, Check } from 'lucide-react';
import { formatPkr } from '../data/menuData';
import type { CartItem, MenuItem } from '../types';
import { SkeletonImage } from './SkeletonImage';
import { AtomicText } from './AtomicText';

interface MenuCardProps {
  item: MenuItem;
  cartItems: CartItem[];
  isFavorite: boolean;
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

export function MenuCard({
  item,
  cartItems,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onUpdateQuantity,
}: MenuCardProps) {
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    item.sizes ? item.sizes[0].label : undefined
  );
  const [selectedFlavor, setSelectedFlavor] = useState<string | undefined>(
    item.flavorOptions ? item.flavorOptions[0] : undefined
  );
  const [btnPulse, setBtnPulse] = useState(false);

  const imgContainerRef = useRef<HTMLDivElement | null>(null);

  const activePrice = item.sizes
    ? item.sizes.find((s) => s.label === selectedSize)?.price ?? item.price
    : item.price;

  const cartKey = `${item.id}__${selectedSize || ''}__${selectedFlavor || ''}`;
  const matchingCartItem = cartItems.find((c) => c.cartKey === cartKey);
  const currentQty = matchingCartItem ? matchingCartItem.quantity : 0;

  const handleAdd = () => {
    setBtnPulse(true);
    setTimeout(() => setBtnPulse(false), 580);
    const rect = imgContainerRef.current ? imgContainerRef.current.getBoundingClientRect() : null;
    onAddToCart(item, selectedSize, selectedFlavor, activePrice, rect);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col justify-between rounded-2xl border border-red-900/10 dark:border-red-500/20 bg-white dark:bg-[#19080B] shadow-sm hover:shadow-xl hover:shadow-red-950/15 dark:hover:shadow-red-950/40 transition-all duration-300 overflow-hidden"
    >
      <div>
        {/* Product Image with Skeleton Loading */}
        <div
          ref={imgContainerRef}
          className="relative aspect-[4/3] w-full overflow-hidden bg-red-50 dark:bg-[#230B0F]"
        >
          <SkeletonImage
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Tag badge placed neatly on top-left of image */}
          {item.tag && (
            <span className="absolute left-2 top-2 rounded-lg bg-black/65 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white shadow-sm whitespace-nowrap">
              {item.tag}
            </span>
          )}

          {/* Subtle Favorite Heart */}
          <button
            type="button"
            onClick={() => onToggleFavorite(item.id)}
            aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            className={`absolute right-2 top-2 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full backdrop-blur-md transition-colors cursor-pointer ${
              isFavorite
                ? 'bg-red-600 text-white'
                : 'bg-black/45 text-white/90 hover:bg-red-600'
            }`}
          >
            <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Product Details — Compact, complete phrases, unbreakable numeric+unit blocks */}
        <div className="p-2.5 sm:p-4">
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-red-700 dark:text-red-400 leading-tight whitespace-nowrap">
            {item.category}
          </p>

          <h3 className="mt-1 text-[13px] sm:text-[15px] font-bold leading-snug text-[#1F0B0D] dark:text-white">
            <AtomicText text={item.name} />
          </h3>

          <p className="mt-1 text-[11px] sm:text-xs text-[#5C3337] dark:text-red-100/75 leading-snug sm:leading-relaxed">
            <AtomicText text={item.description} />
          </p>

          {/* Smooth Animated Size Selector (S / M / L) for Signature Pizzas */}
          {item.sizes && (
            <div className="relative mt-2.5 grid grid-cols-3 rounded-xl bg-red-50/90 dark:bg-[#260C11] p-1 border border-red-900/10 dark:border-red-500/15">
              {item.sizes.map((sz) => {
                const active = selectedSize === sz.label;
                return (
                  <button
                    key={sz.label}
                    type="button"
                    onClick={() => setSelectedSize(sz.label)}
                    className={`relative z-10 rounded-lg py-1 px-1 text-[11px] sm:text-xs font-bold transition-colors duration-200 whitespace-nowrap cursor-pointer ${
                      active
                        ? 'text-white'
                        : 'text-[#5C3337] dark:text-red-200/80 hover:text-red-700 dark:hover:text-white'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId={`size-pill-${item.id}`}
                        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                        className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-red-700 to-red-600 shadow-sm"
                      />
                    )}
                    <span className="sm:hidden">{sz.label[0]}</span>
                    <span className="hidden sm:inline">{sz.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Flavor Selector for Combo Deals */}
          {item.flavorOptions && (
            <div className="mt-2.5">
              <select
                value={selectedFlavor}
                onChange={(e) => setSelectedFlavor(e.target.value)}
                aria-label={`Select flavor for ${item.name}`}
                className="w-full rounded-lg border border-red-900/15 dark:border-red-500/25 bg-red-50/70 dark:bg-[#250C11] px-2 py-1.5 text-[11px] sm:text-xs font-semibold text-[#1F0B0D] dark:text-white focus:outline-none focus:border-red-500"
              >
                {item.flavorOptions.map((flav) => (
                  <option key={flav} value={flav}>
                    Flavor: {flav}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Price & Compact Add / Added Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2 px-2.5 pb-2.5 sm:px-4 sm:pb-4 pt-0.5">
        <AnimatePresence mode="wait">
          <motion.span
            key={activePrice}
            initial={{ opacity: 0.4, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0.4, y: 4 }}
            transition={{ duration: 0.2 }}
            className="text-sm sm:text-base font-extrabold text-[#1F0B0D] dark:text-white tabular-nums whitespace-nowrap"
          >
            {formatPkr(activePrice)}
          </motion.span>
        </AnimatePresence>

        {currentQty > 0 ? (
          <div className="flex w-full sm:w-auto items-center justify-between gap-1 rounded-lg border border-emerald-600/50 bg-emerald-500/10 dark:bg-emerald-950/45 p-0.5">
            <button
              type="button"
              onClick={() => onUpdateQuantity(cartKey, -1)}
              aria-label="Decrease quantity"
              className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-md border border-emerald-600/25 bg-white dark:bg-[#192820] text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
            >
              <Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </button>

            <span className="inline-flex min-w-0 items-center justify-center gap-0.5 px-0.5 text-[10px] sm:text-xs font-extrabold text-emerald-600 dark:text-emerald-400 whitespace-nowrap tabular-nums">
              <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0 stroke-[2.7]" />
              <span>Added ({currentQty})</span>
            </span>

            <button
              type="button"
              onClick={handleAdd}
              aria-label="Increase quantity"
              className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </button>
          </div>
        ) : (
          <motion.button
            type="button"
            animate={btnPulse ? { scale: [1, 0.92, 1.05, 1] } : {}}
            transition={{ duration: 0.55 }}
            onClick={handleAdd}
            className="flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 px-3 py-2 text-xs font-bold text-white shadow-sm transition-all active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
            <span>Add to Cart</span>
          </motion.button>
        )}
      </div>
    </motion.article>
  );
}
