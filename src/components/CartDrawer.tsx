import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Minus,
  Plus,
  Trash2,
  Truck,
  ShoppingBag,
  Utensils,
  Mic,
  MicOff,
  Banknote,
  CreditCard,
  MapPin,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { formatPkr } from '../data/menuData';
import { KARACHI_AREAS } from '../data/karachiAreas';
import { useFirebase } from '../context/FirebaseContext';
import type {
  CartItem,
  DeliveryQuote,
  KarachiArea,
  OrderRecord,
  OrderType,
  PaymentMethod,
} from '../types';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartKey: string, delta: number) => void;
  onRemoveItem: (cartKey: string) => void;
  onClearCart: () => void;
  selectedArea: KarachiArea;
  onSelectArea: (area: KarachiArea) => void;
  detectedCoords?: { lat: number; lng: number };
  orderType: OrderType;
  onChangeOrderType: (type: OrderType) => void;
  onOrderPlaced: (order: OrderRecord) => void;
}

export function CartDrawer({
  open,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  selectedArea,
  onSelectArea,
  detectedCoords,
  orderType,
  onChangeOrderType,
  onOrderPlaced,
}: CartDrawerProps) {
  const { user, profile, createFirestoreOrder, updateProfileData } = useFirebase();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_delivery');
  const [quote, setQuote] = useState<DeliveryQuote | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [listeningNotes, setListeningNotes] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  // Pre-fill from authenticated profile when available
  useEffect(() => {
    if (profile) {
      if (!customerName && profile.displayName) setCustomerName(profile.displayName);
      if (!customerPhone && profile.phone) setCustomerPhone(profile.phone);
      if (!streetAddress && profile.savedAddress) setStreetAddress(profile.savedAddress);
    } else if (user && !customerName && user.displayName) {
      setCustomerName(user.displayName);
    }
  }, [profile, user, customerName, customerPhone, streetAddress]);

  // Fetch distance-based delivery quote whenever cart/area/orderType changes while drawer is open
  useEffect(() => {
    if (!open || items.length === 0) return;
    let cancelled = false;
    setQuoting(true);

    fetch('/api/delivery-quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        areaId: selectedArea.id,
        lat: detectedCoords?.lat,
        lng: detectedCoords?.lng,
        orderType,
        subtotal,
      }),
    })
      .then((r) => r.json())
      .then((data: DeliveryQuote) => {
        if (!cancelled) {
          setQuote(data);
          setQuoting(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setQuote({
            areaName: selectedArea.name,
            distanceKm: 2.0,
            deliveryFee: orderType === 'delivery' ? 80 : 0,
            estimatedMinutes: 30,
            subtotal,
            total: subtotal + (orderType === 'delivery' ? 80 : 0),
          });
          setQuoting(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open, items.length, selectedArea.id, selectedArea.name, detectedCoords, orderType, subtotal]);

  const handleVoiceNotes = () => {
    const SpeechRec =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any })
        .SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any })
        .webkitSpeechRecognition;

    if (!SpeechRec) {
      setFormError('Voice input is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRec();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    setListeningNotes(true);
    setFormError(null);

    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      if (transcript) {
        setNotes((prev) => (prev ? `${prev} ${transcript}` : transcript).slice(0, 300));
      }
      setListeningNotes(false);
    };
    recognition.onerror = () => setListeningNotes(false);
    recognition.onend = () => setListeningNotes(false);
    recognition.start();
  };

  const deliveryFee = orderType === 'delivery' ? quote?.deliveryFee ?? 80 : 0;
  const grandTotal = subtotal + deliveryFee;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanName = customerName.trim();
    const cleanPhone = customerPhone.trim();
    const cleanAddress = streetAddress.trim();

    if (!cleanName) {
      setFormError('Please enter your full name.');
      return;
    }
    if (cleanPhone.length < 7) {
      setFormError('Please enter a valid mobile number (e.g. 03XX-XXXXXXX).');
      return;
    }
    if (orderType === 'delivery' && cleanAddress.length < 4) {
      setFormError('Please enter your house/street address for delivery.');
      return;
    }

    setSubmitting(true);
    const orderId = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const orderNumber = `DP-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderPayload: OrderRecord = {
      id: orderId,
      orderNumber,
      userId: user?.uid || 'guest',
      customerName: cleanName,
      customerPhone: cleanPhone,
      customerEmail: user?.email || '',
      orderType,
      area: selectedArea.name,
      deliveryAddress: orderType === 'delivery' ? cleanAddress : orderType.toUpperCase(),
      notes: notes.trim(),
      paymentMethod,
      status: 'placed',
      items: items.slice(0, 30).map((it) => ({
        itemId: it.itemId,
        name: it.name,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        selectedSize: it.selectedSize || '',
        selectedFlavor: it.selectedFlavor || '',
        image: it.image,
      })),
      subtotal,
      deliveryFee,
      total: grandTotal,
      distanceKm: quote?.distanceKm ?? 1.5,
      estimatedMinutes: quote?.estimatedMinutes ?? 30,
      createdAtMs: Date.now(),
    };

    try {
      if (user) {
        await createFirestoreOrder(orderPayload);
        await updateProfileData({
          phone: cleanPhone,
          savedArea: selectedArea.id,
          savedAddress: cleanAddress || profile?.savedAddress || '',
        });
      } else {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
        });
        if (response.status === 503) {
          setFormError('Sign in to place an online order, or order on WhatsApp.');
          return;
        }
        if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
          throw new Error('Guest order rejected');
        }
      }

      onClearCart();
      onClose();
      onOrderPlaced(orderPayload);
    } catch {
      setFormError('Unable to place your order right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[65] flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative z-10 flex h-full w-full max-w-md flex-col bg-[#FFF8F8] dark:bg-[#140609] text-[#1F0B0D] dark:text-white shadow-2xl border-l border-red-900/15 dark:border-red-500/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-red-900/10 dark:border-red-500/20 px-4 py-4 sm:px-5">
              <div>
                <h2 className="font-display text-xl font-extrabold tracking-tight">
                  Your Order Cart
                </h2>
                <p className="text-xs text-[#5C3337] dark:text-red-200/70">
                  {items.reduce((s, i) => s + i.quantity, 0)} items selected
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close cart drawer"
                className="rounded-xl p-2 text-[#5C3337] dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-950/60 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="text-base font-bold">Your cart is empty</h3>
                <p className="mt-1 text-xs text-[#5C3337] dark:text-red-200/70 max-w-xs">
                  Add stone-baked pizzas, combo deals, or charcoal BBQ items to begin your order.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-5 rounded-xl bg-red-600 hover:bg-red-700 px-5 py-2.5 text-xs font-bold text-white cursor-pointer"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <form onSubmit={handleCheckout} className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5 space-y-5">
                  {/* Cart Item List */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.cartKey}
                        className="flex items-center gap-3 rounded-xl border border-red-900/10 dark:border-red-500/20 bg-white dark:bg-[#1E0A0E] p-2.5 shadow-sm"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-14 w-14 shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-bold truncate">{item.name}</p>
                          {(item.selectedSize || item.selectedFlavor) && (
                            <p className="text-[11px] text-[#5C3337] dark:text-red-200/70 truncate">
                              {[item.selectedSize, item.selectedFlavor].filter(Boolean).join(' · ')}
                            </p>
                          )}
                          <p className="mt-0.5 text-xs font-extrabold text-red-700 dark:text-red-400 tabular-nums">
                            {formatPkr(item.unitPrice * item.quantity)}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.cartKey, -1)}
                            aria-label="Decrease quantity"
                            className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-md border border-red-900/15 dark:border-red-500/25 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.cartKey, 1)}
                            aria-label="Increase quantity"
                            className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.cartKey)}
                            aria-label="Remove item"
                            className="ml-0.5 rounded-lg p-1.5 text-red-600/70 hover:bg-red-100 dark:hover:bg-red-950/60 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Fulfillment Type */}
                  <div>
                    <label className="block text-xs font-bold mb-1.5">Order Type</label>
                    <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-red-900/10 dark:bg-black/40 p-1">
                      {(
                        [
                          { id: 'delivery', label: 'Delivery', icon: Truck },
                          { id: 'takeaway', label: 'Takeaway', icon: ShoppingBag },
                          { id: 'dine-in', label: 'Dine-In', icon: Utensils },
                        ] as const
                      ).map((tab) => {
                        const Icon = tab.icon;
                        const active = orderType === tab.id;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => onChangeOrderType(tab.id)}
                            className={`flex items-center justify-center gap-1 rounded-lg py-2 text-xs font-bold transition-all cursor-pointer ${
                              active
                                ? 'bg-red-600 text-white shadow-sm'
                                : 'text-[#5C3337] dark:text-red-200/70'
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5 shrink-0" />
                            <span>{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Customer & Delivery Details */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Your name"
                          className="w-full rounded-xl border border-red-900/15 dark:border-red-500/25 bg-white dark:bg-[#1E0A0E] px-3 py-2 text-xs focus:border-red-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold mb-1">Mobile Number</label>
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="03XX-XXXXXXX"
                          className="w-full rounded-xl border border-red-900/15 dark:border-red-500/25 bg-white dark:bg-[#1E0A0E] px-3 py-2 text-xs focus:border-red-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    {orderType === 'delivery' && (
                      <>
                        <div>
                          <label className="block text-[11px] font-semibold mb-1">
                            Karachi Delivery Area
                          </label>
                          <div className="relative">
                            <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-red-600" />
                            <select
                              value={selectedArea.id}
                              onChange={(e) => {
                                const found = KARACHI_AREAS.find((a) => a.id === e.target.value);
                                if (found) onSelectArea(found);
                              }}
                              className="w-full rounded-xl border border-red-900/15 dark:border-red-500/25 bg-white dark:bg-[#1E0A0E] py-2 pl-8 pr-3 text-xs focus:border-red-600 focus:outline-none"
                            >
                              {KARACHI_AREAS.map((area) => (
                                <option key={area.id} value={area.id}>
                                  {area.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold mb-1">
                            House / Flat / Street Address
                          </label>
                          <input
                            type="text"
                            required
                            value={streetAddress}
                            onChange={(e) => setStreetAddress(e.target.value)}
                            placeholder="House No, Block / Sector, Landmark"
                            className="w-full rounded-xl border border-red-900/15 dark:border-red-500/25 bg-white dark:bg-[#1E0A0E] px-3 py-2 text-xs focus:border-red-600 focus:outline-none"
                          />
                        </div>
                      </>
                    )}

                    {/* Voice-Enabled Special Instructions */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-semibold">
                          Kitchen / Rider Instructions (Voice supported)
                        </label>
                        <button
                          type="button"
                          onClick={handleVoiceNotes}
                          className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] font-bold transition-colors cursor-pointer ${
                            listeningNotes
                              ? 'bg-red-600 text-white animate-pulse'
                              : 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 hover:bg-red-200'
                          }`}
                        >
                          {listeningNotes ? (
                            <>
                              <MicOff className="h-3 w-3" />
                              <span>Listening...</span>
                            </>
                          ) : (
                            <>
                              <Mic className="h-3 w-3" />
                              <span>Speak</span>
                            </>
                          )}
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Extra spicy, ring the bell, no onions..."
                        className="w-full rounded-xl border border-red-900/15 dark:border-red-500/25 bg-white dark:bg-[#1E0A0E] px-3 py-2 text-xs focus:border-red-600 focus:outline-none resize-none"
                      />
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="block text-[11px] font-semibold mb-1.5">
                        Payment Method
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('cash_on_delivery')}
                          className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 px-2.5 text-xs font-bold transition-all cursor-pointer ${
                            paymentMethod === 'cash_on_delivery'
                              ? 'border-red-600 bg-red-600 text-white'
                              : 'border-red-900/15 dark:border-red-500/25 bg-white dark:bg-[#1E0A0E]'
                          }`}
                        >
                          <Banknote className="h-3.5 w-3.5 shrink-0" />
                          <span>Cash on Delivery</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('online_payment')}
                          className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 px-2.5 text-xs font-bold transition-all cursor-pointer ${
                            paymentMethod === 'online_payment'
                              ? 'border-red-600 bg-red-600 text-white'
                              : 'border-red-900/15 dark:border-red-500/25 bg-white dark:bg-[#1E0A0E]'
                          }`}
                        >
                          <CreditCard className="h-3.5 w-3.5 shrink-0" />
                          <span>Online Transfer</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkout Summary Footer */}
                <div className="border-t border-red-900/10 dark:border-red-500/20 bg-white dark:bg-[#1A080C] px-4 py-4 sm:px-5 space-y-2.5">
                  {formError && (
                    <p className="rounded-lg bg-red-100 dark:bg-red-950/70 px-3 py-2 text-xs font-semibold text-red-700 dark:text-red-300">
                      {formError}
                    </p>
                  )}

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-[#5C3337] dark:text-red-200/75">
                      <span>Subtotal</span>
                      <span className="font-semibold tabular-nums">{formatPkr(subtotal)}</span>
                    </div>

                    {orderType === 'delivery' && (
                      <div className="flex justify-between text-[#5C3337] dark:text-red-200/75">
                        <span>Delivery Charges</span>
                        <span className="font-semibold tabular-nums">
                          {quoting ? '...' : formatPkr(deliveryFee)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between pt-1 border-t border-red-900/10 dark:border-red-500/15 text-sm font-extrabold">
                      <span>Total Payable</span>
                      <span className="text-red-700 dark:text-red-400 tabular-nums">
                        {formatPkr(grandTotal)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 py-3 text-sm font-bold text-white shadow-lg shadow-red-900/25 transition-transform active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Confirming Order...</span>
                      </>
                    ) : (
                      <>
                        <span>Place Order · {formatPkr(grandTotal)}</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
