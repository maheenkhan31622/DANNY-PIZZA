import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Package,
  User as UserIcon,
  Heart,
  LogOut,
  Sun,
  Moon,
  MapPin,
  Save,
  RotateCcw,
  Check,
  Navigation,
} from 'lucide-react';
import { formatPkr, MENU_ITEMS } from '../data/menuData';
import { KARACHI_AREAS } from '../data/karachiAreas';
import { useFirebase } from '../context/FirebaseContext';
import type { MenuItem, OrderRecord, ThemeMode } from '../types';

interface CustomerDashboardProps {
  open: boolean;
  onClose: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onTrackOrder: (order: OrderRecord) => void;
  onQuickAdd: (item: MenuItem) => void;
}

export function CustomerDashboard({
  open,
  onClose,
  theme,
  onToggleTheme,
  onTrackOrder,
  onQuickAdd,
}: CustomerDashboardProps) {
  const { user, profile, orders, updateProfileData, toggleFavorite, logout } = useFirebase();
  const [tab, setTab] = useState<'orders' | 'profile' | 'favorites'>('orders');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [savedArea, setSavedArea] = useState(KARACHI_AREAS[0].id);
  const [savedAddress, setSavedAddress] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setPhone(profile.phone || '');
      setSavedArea(profile.savedArea || KARACHI_AREAS[0].id);
      setSavedAddress(profile.savedAddress || '');
    }
  }, [profile]);

  if (!user) return null;

  const favoriteItems = MENU_ITEMS.filter((it) =>
    (profile?.favoriteItemIds || []).includes(it.id)
  );

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfileData({
      displayName,
      phone,
      savedArea,
      savedAddress,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] flex justify-end">
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
            className="relative z-10 flex h-full w-full max-w-lg flex-col bg-[#FFF8F8] dark:bg-[#140609] text-[#1F0B0D] dark:text-white shadow-2xl border-l border-red-900/15 dark:border-red-500/20"
          >
            {/* Header Profile Card */}
            <div className="bg-gradient-to-r from-red-800 via-red-700 to-red-800 px-5 py-5 text-white">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={profile?.displayName || 'Customer'}
                      referrerPolicy="no-referrer"
                      className="h-12 w-12 shrink-0 rounded-full border-2 border-white/60 object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20">
                      <UserIcon className="h-6 w-6" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h2 className="font-display text-xl font-extrabold truncate">
                      {profile?.displayName || user.displayName || 'Danny Pizza Customer'}
                    </h2>
                    <p className="text-xs text-red-100/85 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={onToggleTheme}
                    aria-label="Toggle theme"
                    className="rounded-xl bg-white/15 p-2 hover:bg-white/25 cursor-pointer"
                  >
                    {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close dashboard"
                    className="rounded-xl bg-white/15 p-2 hover:bg-white/25 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Quick Summary Metrics */}
              <div className="mt-4 grid grid-cols-2 gap-2.5 text-center">
                <div className="rounded-xl bg-black/25 px-3 py-2">
                  <p className="text-lg font-extrabold tabular-nums">{orders.length}</p>
                  <p className="text-[11px] text-red-100/80">Total Orders</p>
                </div>
                <div className="rounded-xl bg-black/25 px-3 py-2">
                  <p className="text-lg font-extrabold tabular-nums">{favoriteItems.length}</p>
                  <p className="text-[11px] text-red-100/80">Saved Favorites</p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="grid grid-cols-3 gap-1 border-b border-red-900/10 dark:border-red-500/20 p-2 bg-white/60 dark:bg-[#1B080C]">
              {(
                [
                  { id: 'orders', label: 'Orders', icon: Package },
                  { id: 'profile', label: 'Address', icon: UserIcon },
                  { id: 'favorites', label: 'Favorites', icon: Heart },
                ] as const
              ).map((t) => {
                const Icon = t.icon;
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-colors cursor-pointer ${
                      active
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'text-[#5C3337] dark:text-red-200/75 hover:bg-red-100 dark:hover:bg-red-950/60'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {tab === 'orders' && (
                <>
                  {orders.length === 0 ? (
                    <div className="rounded-2xl border border-red-900/10 dark:border-red-500/20 bg-white dark:bg-[#1C090D] p-8 text-center">
                      <Package className="mx-auto h-8 w-8 text-red-500 mb-2" />
                      <p className="text-sm font-bold">No orders yet</p>
                      <p className="mt-1 text-xs text-[#5C3337] dark:text-red-200/70">
                        Your past and live orders will appear here automatically.
                      </p>
                    </div>
                  ) : (
                    orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="rounded-2xl border border-red-900/10 dark:border-red-500/20 bg-white dark:bg-[#1C090D] p-4 shadow-sm space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-extrabold">Order #{ord.orderNumber}</p>
                            <p className="text-[11px] text-[#5C3337] dark:text-red-200/70 capitalize">
                              {ord.orderType} · {ord.status.replace(/_/g, ' ')}
                            </p>
                          </div>
                          <span className="text-sm font-extrabold text-red-700 dark:text-red-400 tabular-nums">
                            {formatPkr(ord.total)}
                          </span>
                        </div>

                        <p className="text-xs text-[#5C3337] dark:text-red-100/80 line-clamp-2">
                          {ord.items.map((it) => `${it.quantity}x ${it.name}`).join(', ')}
                        </p>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onTrackOrder(ord);
                            }}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 py-2 text-xs font-bold text-white cursor-pointer"
                          >
                            <Navigation className="h-3.5 w-3.5" />
                            <span>Track Live Order</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              ord.items.forEach((it) => {
                                const menuMatch = MENU_ITEMS.find((m) => m.id === it.itemId);
                                if (menuMatch) onQuickAdd(menuMatch);
                              });
                              onClose();
                            }}
                            className="flex items-center justify-center gap-1 rounded-xl border border-red-900/20 dark:border-red-500/25 px-3 py-2 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-950/60 cursor-pointer"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            <span>Reorder</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}

              {tab === 'profile' && (
                <form
                  onSubmit={handleSaveProfile}
                  className="rounded-2xl border border-red-900/10 dark:border-red-500/20 bg-white dark:bg-[#1C090D] p-4 space-y-3.5"
                >
                  <div>
                    <label className="block text-xs font-bold mb-1">Display Name</label>
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full rounded-xl border border-red-900/15 dark:border-red-500/25 bg-red-50/50 dark:bg-[#240B10] px-3 py-2 text-xs focus:border-red-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="03XX-XXXXXXX"
                      className="w-full rounded-xl border border-red-900/15 dark:border-red-500/25 bg-red-50/50 dark:bg-[#240B10] px-3 py-2 text-xs focus:border-red-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Default Karachi Area</label>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-red-600" />
                      <select
                        value={savedArea}
                        onChange={(e) => setSavedArea(e.target.value)}
                        className="w-full rounded-xl border border-red-900/15 dark:border-red-500/25 bg-red-50/50 dark:bg-[#240B10] py-2 pl-8 pr-3 text-xs focus:border-red-600 focus:outline-none"
                      >
                        {KARACHI_AREAS.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Saved Street Address</label>
                    <textarea
                      rows={2}
                      value={savedAddress}
                      onChange={(e) => setSavedAddress(e.target.value)}
                      placeholder="House/Flat No, Sector/Block, Landmark"
                      className="w-full rounded-xl border border-red-900/15 dark:border-red-500/25 bg-red-50/50 dark:bg-[#240B10] px-3 py-2 text-xs focus:border-red-600 focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 py-2.5 text-xs font-bold text-white cursor-pointer"
                  >
                    {savedNotice ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Saved to Your Account</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Delivery Profile</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {tab === 'favorites' && (
                <>
                  {favoriteItems.length === 0 ? (
                    <div className="rounded-2xl border border-red-900/10 dark:border-red-500/20 bg-white dark:bg-[#1C090D] p-8 text-center">
                      <Heart className="mx-auto h-8 w-8 text-red-500 mb-2" />
                      <p className="text-sm font-bold">No favorite dishes yet</p>
                      <p className="mt-1 text-xs text-[#5C3337] dark:text-red-200/70">
                        Tap the heart icon on any pizza or deal to save it here.
                      </p>
                    </div>
                  ) : (
                    favoriteItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-2xl border border-red-900/10 dark:border-red-500/20 bg-white dark:bg-[#1C090D] p-3"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-14 w-14 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-bold truncate">{item.name}</p>
                          <p className="text-xs font-extrabold text-red-700 dark:text-red-400 tabular-nums">
                            {formatPkr(item.price)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onQuickAdd(item)}
                          className="rounded-xl bg-red-600 hover:bg-red-700 px-3 py-1.5 text-xs font-bold text-white cursor-pointer shrink-0"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleFavorite(item.id)}
                          aria-label="Remove favorite"
                          className="rounded-lg p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-950/60 cursor-pointer"
                        >
                          <Heart className="h-4 w-4 fill-current" />
                        </button>
                      </div>
                    ))
                  )}
                </>
              )}
            </div>

            {/* Footer Sign Out */}
            <div className="border-t border-red-900/10 dark:border-red-500/20 p-4">
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  onClose();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-900/20 dark:border-red-500/25 py-2.5 text-xs font-bold text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950/60 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
