import React from 'react';
import { ShoppingBag, Sun, Moon, User as UserIcon } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';
import type { MenuCategory, ThemeMode } from '../types';
import { useFirebase } from '../context/FirebaseContext';

interface NavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  cartCount: number;
  cartWiggle: boolean;
  cartBtnRef: React.RefObject<HTMLButtonElement | null>;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenDashboard: () => void;
  onSelectCategory: (cat: MenuCategory) => void;
}

export function GoogleLogoIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
      />
    </svg>
  );
}

export function Navbar({
  theme,
  onToggleTheme,
  cartCount,
  cartWiggle,
  cartBtnRef,
  onOpenCart,
  onOpenAuth,
  onOpenDashboard,
  onSelectCategory,
}: NavbarProps) {
  const { user, profile } = useFirebase();

  const handleNavClick = (cat: MenuCategory) => {
    onSelectCategory(cat);
    const el = document.getElementById('menu-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-red-900/10 dark:border-red-500/20 bg-[#FFF8F8]/95 dark:bg-[#0D0406]/95 backdrop-blur-xl transition-colors duration-300">
      <div className="navbar-top-shell mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-6 px-2.5 sm:px-6 h-14 sm:h-18">
        {/* Zone 1: Brand Crest & Vertically Stacked Title + Tagline with Truncation */}
        <a
          href="#top"
          className="navbar-brand-zone flex items-center gap-2 sm:gap-2.5 min-w-0 shrink group"
        >
          <div className="h-8 w-8 sm:h-11 sm:w-11 shrink-0 rounded-full p-0.5 bg-gradient-to-tr from-red-600 to-amber-500 shadow-md">
            <img
              src={RESTAURANT_INFO.logoUrl}
              alt="DANNY PIZZA"
              className="h-full w-full rounded-full object-cover bg-black"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-display text-base sm:text-2xl font-extrabold leading-none tracking-tight text-[#1F0B0D] dark:text-white max-w-[120px] min-[400px]:max-w-[155px] sm:max-w-[240px] truncate">
              {RESTAURANT_INFO.name}
            </span>
            <span className="text-[9.5px] sm:text-[11px] font-semibold leading-tight text-red-700/80 dark:text-red-300/80 max-w-[120px] min-[400px]:max-w-[155px] sm:max-w-[240px] truncate">
              {RESTAURANT_INFO.tagline}
            </span>
          </div>
        </a>

        {/* Zone 2: Clean Desktop Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#5C3337] dark:text-red-100/80">
          {(
            [
              { label: 'Deals', cat: 'Pizza Deals' },
              { label: 'Pizzas', cat: 'Signature Pizzas' },
              { label: 'Charcoal BBQ', cat: 'Charcoal BBQ' },
              { label: 'Fast Food', cat: 'Fast Food' },
            ] as { label: string; cat: MenuCategory }[]
          ).map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => handleNavClick(link.cat)}
              className="relative py-1 hover:text-red-600 dark:hover:text-red-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Compact Theme Toggle + Sign In / Account + Cart */}
        <div className="navbar-actions-zone flex items-center justify-end gap-1.5 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-red-900/15 dark:border-red-500/25 bg-white/85 dark:bg-[#1E0A0E] text-[#1F0B0D] dark:text-amber-300 hover:border-red-500 transition-colors cursor-pointer shrink-0"
          >
            {theme === 'dark' ? <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
          </button>

          {user ? (
            <button
              type="button"
              onClick={onOpenDashboard}
              className="flex h-8 sm:h-10 items-center gap-1.5 rounded-xl border border-red-900/15 dark:border-red-500/25 bg-white/85 dark:bg-[#1E0A0E] px-2 sm:px-3 text-[11px] sm:text-sm font-semibold text-[#1F0B0D] dark:text-white hover:border-red-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={profile?.displayName || 'Account'}
                  referrerPolicy="no-referrer"
                  className="h-5 w-5 sm:h-6 sm:w-6 rounded-full object-cover"
                />
              ) : (
                <UserIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600 dark:text-red-400" />
              )}
              <span className="hidden sm:inline max-w-[100px] truncate">
                {profile?.displayName?.split(' ')[0] || 'Account'}
              </span>
              <span className="sm:hidden">Account</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="flex h-8 sm:h-10 items-center gap-1.5 rounded-xl border border-red-900/15 dark:border-red-500/25 bg-white/90 dark:bg-[#1E0A0E] px-2 sm:px-3.5 text-[11px] sm:text-sm font-semibold text-[#1F0B0D] dark:text-white hover:border-red-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <GoogleLogoIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
              <span>Sign In</span>
            </button>
          )}

          <button
            ref={cartBtnRef}
            type="button"
            onClick={onOpenCart}
            aria-label="Open shopping cart"
            className={`relative flex h-8 sm:h-10 items-center gap-1 sm:gap-1.5 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 px-2 sm:px-4 text-[11px] sm:text-sm font-bold text-white shadow-md shadow-red-900/25 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              cartWiggle ? 'animate-cart-wiggle' : ''
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
            <span className="hidden sm:inline">Cart</span>
            <span className="inline-flex h-4.5 min-w-4.5 sm:h-5 sm:min-w-5 items-center justify-center rounded-full bg-white text-red-700 px-1 text-[10px] sm:text-[11px] font-extrabold tabular-nums">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
