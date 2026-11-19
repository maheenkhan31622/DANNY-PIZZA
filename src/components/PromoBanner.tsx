import { X, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PromoBannerProps {
  visible: boolean;
  onDismiss: () => void;
  onOrderDeals: () => void;
}

export function PromoBanner({ visible, onDismiss, onOrderDeals }: PromoBannerProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="relative z-50 overflow-hidden bg-gradient-to-r from-red-800 via-red-600 to-red-800 text-white"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-1.5 sm:px-6 text-xs sm:text-sm">
            <button
              type="button"
              onClick={onOrderDeals}
              className="flex min-w-0 flex-1 items-center justify-center gap-2 text-center font-medium hover:opacity-95 cursor-pointer"
            >
              <Flame className="h-3.5 w-3.5 shrink-0 text-amber-300" />
              <span className="truncate">
                Hot Deal: 1 Small + 1 Medium Pizza + Drink for{' '}
                <strong className="font-bold text-amber-200 tabular-nums">Rs. 749</strong> · Family Deal{' '}
                <strong className="font-bold text-amber-200 tabular-nums">Rs. 2,999</strong>
              </span>
            </button>

            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss promotional banner"
              className="shrink-0 rounded-md p-1 text-white/80 hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
