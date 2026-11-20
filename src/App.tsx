import { useCallback, useEffect, useRef, useState } from 'react';
import { FirebaseProvider, useFirebase } from './context/FirebaseContext';
import { KARACHI_AREAS } from './data/karachiAreas';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SplashScreen } from './components/SplashScreen';
import { PromoBanner } from './components/PromoBanner';
import { Navbar } from './components/Navbar';
import { HeroSlider } from './components/HeroSlider';
import { MenuSection } from './components/MenuSection';
import { LocationModal } from './components/LocationModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AuthModal } from './components/AuthModal';
import { CustomerDashboard } from './components/CustomerDashboard';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { FlyingCartOverlay, type FlyingItem } from './components/FlyingCartOverlay';
import { Footer } from './components/Footer';
import type {
  CartItem,
  KarachiArea,
  MenuCategory,
  MenuItem,
  OrderRecord,
  OrderType,
  ThemeMode,
} from './types';

function DannyPizzaApp() {
  const { user, profile, toggleFavorite, updateProfileData } = useFirebase();

  const [splashVisible, setSplashVisible] = useState(true);
  const [promoVisible, setPromoVisible] = useState(true);

  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('danny_pizza_theme');
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  // Sync theme with <html> class and localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('danny_pizza_theme', theme);
    } catch {}
  }, [theme]);

  const handleToggleTheme = () => {
    const next: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (user) {
      updateProfileData({ preferredTheme: next }).catch(() => {});
    }
  };

  // Location & Fulfillment State (First Visit Only Prompt)
  const [hasSavedLocation, setHasSavedLocation] = useState<boolean>(() => {
    try {
      return localStorage.getItem('danny_location_selected') === '1';
    } catch {
      return false;
    }
  });

  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const [selectedArea, setSelectedArea] = useState<KarachiArea>(() => {
    try {
      const savedId = localStorage.getItem('danny_area_id');
      return KARACHI_AREAS.find((a) => a.id === savedId) || KARACHI_AREAS[0];
    } catch {
      return KARACHI_AREAS[0];
    }
  });

  const [orderType, setOrderType] = useState<OrderType>(() => {
    try {
      const saved = localStorage.getItem('danny_order_type') as OrderType | null;
      return saved === 'takeaway' || saved === 'dine-in' ? saved : 'delivery';
    } catch {
      return 'delivery';
    }
  });

  const [detectedCoords, setDetectedCoords] = useState<{ lat: number; lng: number } | undefined>(() => {
    try {
      const raw = localStorage.getItem('danny_detected_coords');
      if (!raw) return undefined;
      const parsed = JSON.parse(raw);
      if (typeof parsed?.lat === 'number' && typeof parsed?.lng === 'number') {
        return { lat: parsed.lat, lng: parsed.lng };
      }
      return undefined;
    } catch {
      return undefined;
    }
  });
  const [detectedAddress, setDetectedAddress] = useState<string | undefined>(() => {
    try {
      return localStorage.getItem('danny_detected_address') || undefined;
    } catch {
      return undefined;
    }
  });

  // Open Location Modal ONLY on first visit after splash screen completes
  useEffect(() => {
    if (!splashVisible && !hasSavedLocation) {
      setLocationModalOpen(true);
    }
  }, [splashVisible, hasSavedLocation]);

  const handleConfirmLocation = ({
    area,
    orderType: type,
    coords,
    detectedAddress: addrLabel,
  }: {
    area: KarachiArea;
    orderType: OrderType;
    coords?: { lat: number; lng: number };
    detectedAddress?: string;
  }) => {
    setSelectedArea(area);
    setOrderType(type);
    setDetectedCoords(coords);
    setDetectedAddress(addrLabel);
    setHasSavedLocation(true);
    setLocationModalOpen(false);
    try {
      localStorage.setItem('danny_location_selected', '1');
      localStorage.setItem('danny_area_id', area.id);
      localStorage.setItem('danny_order_type', type);
      if (coords) {
        localStorage.setItem('danny_detected_coords', JSON.stringify(coords));
      } else {
        localStorage.removeItem('danny_detected_coords');
      }
      if (addrLabel) {
        localStorage.setItem('danny_detected_address', addrLabel);
      } else {
        localStorage.removeItem('danny_detected_address');
      }
    } catch {}
  };

  // Menu & Cart State
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('Pizza Deals');
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem('danny_cart');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('danny_cart', JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<OrderRecord | null>(null);

  // Flying Add-to-Cart Animation State
  const cartBtnRef = useRef<HTMLButtonElement | null>(null);
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [cartWiggle, setCartWiggle] = useState(false);

  const launchFlyToCart = useCallback((imgRect: DOMRect | null, image: string) => {
    if (!imgRect || !cartBtnRef.current) return;
    const cartRect = cartBtnRef.current.getBoundingClientRect();
    const id = `fly_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    const flyItem: FlyingItem = {
      id,
      image,
      startX: imgRect.left + imgRect.width * 0.15,
      startY: imgRect.top + imgRect.height * 0.1,
      startW: Math.min(120, imgRect.width * 0.7),
      startH: Math.min(95, imgRect.height * 0.7),
      endX: cartRect.left + cartRect.width / 2,
      endY: cartRect.top + cartRect.height / 2,
    };

    setFlyingItems((prev) => [...prev, flyItem]);

    setTimeout(() => {
      setCartWiggle(true);
      setTimeout(() => setCartWiggle(false), 750);
    }, 1420);

    setTimeout(() => {
      setFlyingItems((prev) => prev.filter((f) => f.id !== id));
    }, 1720);
  }, []);

  const handleAddToCart = useCallback(
    (
      item: MenuItem,
      selectedSize: string | undefined,
      selectedFlavor: string | undefined,
      unitPrice: number,
      imgRect: DOMRect | null
    ) => {
      const cartKey = `${item.id}__${selectedSize || ''}__${selectedFlavor || ''}`;
      setCartItems((prev) => {
        const existing = prev.find((c) => c.cartKey === cartKey);
        if (existing) {
          return prev.map((c) =>
            c.cartKey === cartKey ? { ...c, quantity: c.quantity + 1 } : c
          );
        }
        return [
          ...prev,
          {
            cartKey,
            itemId: item.id,
            name: item.name,
            image: item.image,
            unitPrice,
            quantity: 1,
            selectedSize,
            selectedFlavor,
          },
        ];
      });

      launchFlyToCart(imgRect, item.image);
    },
    [launchFlyToCart]
  );

  const handleUpdateQuantity = useCallback((cartKey: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((c) => (c.cartKey === cartKey ? { ...c, quantity: c.quantity + delta } : c))
        .filter((c) => c.quantity > 0)
    );
  }, []);

  const handleRemoveItem = useCallback((cartKey: string) => {
    setCartItems((prev) => prev.filter((c) => c.cartKey !== cartKey));
  }, []);

  const handleToggleFavorite = (itemId: string) => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    toggleFavorite(itemId).catch(() => {});
  };

  const handleQuickAddFromDashboard = (item: MenuItem) => {
    const defaultSize = item.sizes ? item.sizes[0].label : undefined;
    const defaultFlavor = item.flavorOptions ? item.flavorOptions[0] : undefined;
    const price = item.sizes ? item.sizes[0].price : item.price;
    handleAddToCart(item, defaultSize, defaultFlavor, price, null);
  };

  const cartCount = cartItems.reduce((sum, it) => sum + it.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col brand-canvas-bg text-[#1F0B0D] dark:text-white transition-colors duration-300">
      <SplashScreen visible={splashVisible} onComplete={() => setSplashVisible(false)} />

      <PromoBanner
        visible={promoVisible}
        onDismiss={() => setPromoVisible(false)}
        onOrderDeals={() => {
          setActiveCategory('Pizza Deals');
          document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <Navbar
        theme={theme}
        onToggleTheme={handleToggleTheme}
        cartCount={cartCount}
        cartWiggle={cartWiggle}
        cartBtnRef={cartBtnRef}
        onOpenCart={() => setCartOpen(true)}
        onOpenAuth={() => setAuthOpen(true)}
        onOpenDashboard={() => setDashboardOpen(true)}
        onSelectCategory={setActiveCategory}
      />

      <main className="flex-1">
        <HeroSlider
          selectedAreaName={detectedAddress || selectedArea.name}
          orderType={orderType}
          onChangeLocation={() => setLocationModalOpen(true)}
          onExploreCategory={setActiveCategory}
        />

        <MenuSection
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          cartItems={cartItems}
          favoriteIds={profile?.favoriteItemIds || []}
          onToggleFavorite={handleToggleFavorite}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
        />
      </main>

      <Footer />

      <FloatingWhatsApp autoExpandTooltip={true} />
      <FlyingCartOverlay flyingItems={flyingItems} />

      <LocationModal
        open={locationModalOpen}
        initialAreaId={selectedArea.id}
        initialOrderType={orderType}
        initialDetectedCoords={detectedCoords}
        initialDetectedAddress={detectedAddress}
        canClose={hasSavedLocation}
        onClose={() => setLocationModalOpen(false)}
        onConfirm={handleConfirmLocation}
      />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
        selectedArea={selectedArea}
        onSelectArea={(area) => {
          setSelectedArea(area);
          setDetectedCoords(undefined);
          setDetectedAddress(undefined);
          try {
            localStorage.setItem('danny_area_id', area.id);
            localStorage.removeItem('danny_detected_coords');
            localStorage.removeItem('danny_detected_address');
          } catch {}
        }}
        detectedCoords={detectedCoords}
        orderType={orderType}
        onChangeOrderType={setOrderType}
        onOrderPlaced={(order) => setTrackingOrder(order)}
      />

      <OrderTrackingModal
        order={trackingOrder}
        onClose={() => setTrackingOrder(null)}
      />

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

      <CustomerDashboard
        open={dashboardOpen}
        onClose={() => setDashboardOpen(false)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onTrackOrder={(ord) => setTrackingOrder(ord)}
        onQuickAdd={handleQuickAddFromDashboard}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <FirebaseProvider>
        <DannyPizzaApp />
      </FirebaseProvider>
    </ErrorBoundary>
  );
}
