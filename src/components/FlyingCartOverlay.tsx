import { motion, AnimatePresence } from 'motion/react';

export interface FlyingItem {
  id: string;
  image: string;
  startX: number;
  startY: number;
  startW: number;
  startH: number;
  endX: number;
  endY: number;
}

interface FlyingCartOverlayProps {
  flyingItems: FlyingItem[];
}

export function FlyingCartOverlay({ flyingItems }: FlyingCartOverlayProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
      <AnimatePresence>
        {flyingItems.map((fly) => (
          <motion.div
            key={fly.id}
            initial={{
              position: 'fixed',
              left: fly.startX,
              top: fly.startY,
              width: fly.startW,
              height: fly.startH,
              scale: 1,
              opacity: 1,
              borderRadius: '16px',
            }}
            animate={{
              left: [fly.startX, (fly.startX + fly.endX) / 2, fly.endX - 18],
              top: [fly.startY, Math.min(fly.startY, fly.endY) - 60, fly.endY - 18],
              width: [fly.startW, 76, 36],
              height: [fly.startH, 76, 36],
              scale: [1, 1.16, 0.38],
              opacity: [1, 0.96, 0.25],
              borderRadius: ['16px', '999px', '999px'],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.6,
              times: [0, 0.45, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
            className="overflow-hidden shadow-2xl ring-2 ring-red-500 bg-black"
          >
            <img
              src={fly.image}
              alt=""
              className="h-full w-full object-cover"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
