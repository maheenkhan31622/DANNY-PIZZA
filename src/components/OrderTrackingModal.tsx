import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Flame,
  Bike,
  PackageCheck,
  X,
  Clock,
  MapPin,
  MessageCircle,
} from 'lucide-react';
import { formatPkr, RESTAURANT_INFO } from '../data/menuData';
import { useFirebase } from '../context/FirebaseContext';
import type { OrderRecord, OrderStatus } from '../types';

interface OrderTrackingModalProps {
  order: OrderRecord | null;
  onClose: () => void;
}

const STAGES: { key: OrderStatus; label: string; sub: string; icon: typeof Flame }[] = [
  { key: 'placed', label: 'Order Placed', sub: 'Received by Danny Pizza', icon: CheckCircle2 },
  { key: 'cooking', label: 'Cooking', sub: 'Baking & grilling fresh', icon: Flame },
  { key: 'out_for_delivery', label: 'Out for Delivery', sub: 'Rider on the way', icon: Bike },
  { key: 'delivered', label: 'Delivered', sub: 'Enjoy your meal!', icon: PackageCheck },
];

export function OrderTrackingModal({ order, onClose }: OrderTrackingModalProps) {
  const { user, orders, advanceOrderStatus } = useFirebase();
  const [localStatus, setLocalStatus] = useState<OrderStatus>('placed');

  // Sync with live Firestore snapshot if signed in
  const liveOrder = order ? orders.find((o) => o.id === order.id) || order : null;
  const activeStatus: OrderStatus = liveOrder ? liveOrder.status : localStatus;

  useEffect(() => {
    if (!order) return;
    setLocalStatus(order.status);
  }, [order]);

  // Smooth stage progression demonstration so customer experiences live order tracking right after placing an order
  useEffect(() => {
    if (!liveOrder || liveOrder.status === 'delivered') return;

    const nextMap: Record<OrderStatus, OrderStatus | null> = {
      placed: 'cooking',
      cooking: 'out_for_delivery',
      out_for_delivery: 'delivered',
      delivered: null,
    };

    const nextStage = nextMap[liveOrder.status];
    if (!nextStage) return;

    const timer = setTimeout(() => {
      if (user && liveOrder.userId === user.uid) {
        advanceOrderStatus(liveOrder.id, nextStage).catch(() => {});
      } else {
        setLocalStatus(nextStage);
      }
    }, 5500);

    return () => clearTimeout(timer);
  }, [liveOrder, user, advanceOrderStatus]);

  if (!liveOrder) return null;

  const currentIdx = STAGES.findIndex((s) => s.key === activeStatus);
  const progressPct = ((currentIdx + 1) / STAGES.length) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[75] flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-lg rounded-2xl border border-red-500/25 bg-[#FFF8F8] dark:bg-[#16070A] text-[#1F0B0D] dark:text-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-red-800 via-red-700 to-red-800 px-5 py-4 text-white">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                Live Order Tracking
              </p>
              <h2 className="font-display text-2xl font-extrabold">
                Order #{liveOrder.orderNumber}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close tracking modal"
              className="rounded-xl p-2 text-white/80 hover:bg-white/15 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="overflow-y-auto p-5 space-y-5">
            {/* Framer Motion Animated Progress Bar */}
            <div className="rounded-2xl border border-red-900/10 dark:border-red-500/20 bg-white dark:bg-[#1F0A0E] p-4">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="flex items-center gap-1.5 text-red-700 dark:text-red-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span>ETA: {liveOrder.estimatedMinutes} mins</span>
                </span>
                <span className="tabular-nums text-[#5C3337] dark:text-red-200/80">
                  {Math.round(progressPct)}% Complete
                </span>
              </div>

              <div className="h-3 w-full overflow-hidden rounded-full bg-red-100 dark:bg-red-950/80">
                <motion.div
                  initial={{ width: '10%' }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full bg-gradient-to-r from-red-700 via-red-500 to-amber-400"
                />
              </div>

              {/* Stage Milestones */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STAGES.map((stage, idx) => {
                  const Icon = stage.icon;
                  const reached = idx <= currentIdx;
                  const current = idx === currentIdx;
                  const label =
                    liveOrder.orderType !== 'delivery' && stage.key === 'out_for_delivery'
                      ? 'Ready for Pickup'
                      : liveOrder.orderType !== 'delivery' && stage.key === 'delivered'
                      ? 'Completed'
                      : stage.label;
                  return (
                    <motion.div
                      key={stage.key}
                      animate={{ scale: current ? 1.03 : 1 }}
                      transition={{ duration: 0.3 }}
                      className={`rounded-xl border p-2.5 text-center transition-colors ${
                        reached
                          ? 'border-red-500/40 bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-white'
                          : 'border-red-900/10 dark:border-red-500/10 opacity-45'
                      }`}
                    >
                      <Icon
                        className={`mx-auto h-4 w-4 mb-1 ${
                          current ? 'text-red-600 dark:text-amber-400 animate-bounce' : ''
                        }`}
                      />
                      <p className="text-[11px] font-bold leading-tight">{label}</p>
                      <p className="mt-0.5 text-[10px] opacity-75 line-clamp-1">{stage.sub}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Delivery & Payment Info */}
            <div className="rounded-2xl border border-red-900/10 dark:border-red-500/20 bg-white dark:bg-[#1F0A0E] p-4 text-xs space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                <div>
                  <p className="font-bold capitalize">
                    {liveOrder.orderType} · {liveOrder.area || 'North Karachi'}
                  </p>
                  {liveOrder.deliveryAddress && (
                    <p className="text-[#5C3337] dark:text-red-200/75">
                      {liveOrder.deliveryAddress}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-red-900/10 dark:border-red-500/15 pt-2 space-y-1">
                {liveOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="truncate pr-2">
                      {item.quantity}x {item.name}
                      {item.selectedSize ? ` (${item.selectedSize})` : ''}
                    </span>
                    <span className="font-semibold tabular-nums shrink-0">
                      {formatPkr(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}

                {liveOrder.deliveryFee > 0 && (
                  <div className="flex justify-between text-[#5C3337] dark:text-red-200/75">
                    <span>Delivery Fee ({liveOrder.distanceKm} km)</span>
                    <span className="tabular-nums">{formatPkr(liveOrder.deliveryFee)}</span>
                  </div>
                )}

                <div className="flex justify-between pt-1.5 border-t border-red-900/10 dark:border-red-500/15 text-sm font-extrabold">
                  <span>
                    Total (
                    {liveOrder.paymentMethod === 'cash_on_delivery'
                      ? 'Cash on Delivery'
                      : 'Online Payment'}
                    )
                  </span>
                  <span className="text-red-700 dark:text-red-400 tabular-nums">
                    {formatPkr(liveOrder.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Support CTA */}
            <div className="flex items-center justify-between gap-3">
              <a
                href={`https://wa.me/${RESTAURANT_INFO.whatsappE164}?text=${encodeURIComponent(
                  `Hello Danny Pizza! Checking on my order #${liveOrder.orderNumber}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] py-2.5 text-xs font-bold text-white transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp Support</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-red-900/20 dark:border-red-500/25 px-5 py-2.5 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-950/60 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
