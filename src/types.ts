export type ThemeMode = 'dark' | 'light';

export type OrderType = 'delivery' | 'takeaway' | 'dine-in';

export type PaymentMethod = 'cash_on_delivery' | 'online_payment';

export type OrderStatus = 'placed' | 'cooking' | 'out_for_delivery' | 'delivered';

export type MenuCategory =
  | 'Pizza Deals'
  | 'Signature Pizzas'
  | 'Charcoal BBQ'
  | 'Fast Food'
  | 'Drinks & Sides';

export interface PizzaSizeOption {
  label: 'Small' | 'Medium' | 'Large';
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  description: string;
  price: number;
  sizes?: PizzaSizeOption[];
  flavorOptions?: string[];
  image: string;
  tag?: string;
  popular?: boolean;
}

export interface CartItem {
  cartKey: string;
  itemId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  selectedSize?: string;
  selectedFlavor?: string;
}

export interface KarachiArea {
  id: string;
  name: string;
  zone: string;
  lat: number;
  lng: number;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  phone?: string;
  savedArea?: string;
  savedAddress?: string;
  favoriteItemIds?: string[];
  preferredTheme?: ThemeMode;
}

export interface OrderItemSummary {
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  selectedSize?: string;
  selectedFlavor?: string;
  image: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  orderType: OrderType;
  area?: string;
  deliveryAddress?: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  items: OrderItemSummary[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  distanceKm: number;
  estimatedMinutes: number;
  createdAtMs?: number;
}

export interface DeliveryQuote {
  areaName: string;
  distanceKm: number;
  deliveryFee: number;
  estimatedMinutes: number;
  subtotal: number;
  total: number;
}
