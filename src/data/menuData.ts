import type { MenuCategory, MenuItem } from '../types';

export const RESTAURANT_INFO = {
  name: 'DANNY PIZZA',
  tagline: 'Fast Food & BBQ',
  address: 'Shop No.\u00A0L-363, Sector\u00A05-A/2, Near Zahid\u00A0Biryani, North\u00A0Karachi',
  phoneDisplay: '0344-0111191',
  whatsappE164: '923440111191',
  hours: '4:30\u00A0PM – 2:00\u00A0AM',
  mapsUrl: 'https://share.google/smQlFbgl2aZgjFW4i',
  logoUrl: '/assets/aistudio/Gemini_Generated_Image_240jk8240jk8240j_1e03a631.jpg',
};

export const PIZZA_FLAVORS = [
  'Tikka',
  'Fajita',
  'Creamy Tikka',
  'Cheese Lover',
  'Supreme',
  'Chipotle',
  'Danny Special',
];

export const PIZZA_SIZES = [
  { label: 'Small' as const, price: 250 },
  { label: 'Medium' as const, price: 500 },
  { label: 'Large' as const, price: 700 },
];

export const HERO_SLIDES = [
  {
    id: 'slide-1',
    eyebrow: 'North Karachi Signature',
    title: 'Stone-Baked Pizzas & Live Charcoal BBQ',
    subtitle:
      'Fresh dough baked to order with smoky tikka, creamy fajita, and sizzling grill platters.',
    ctaText: 'Order Deals Now',
    targetCategory: 'Pizza Deals' as MenuCategory,
    image: '/src/assets/images/hero_pizza_feast_1795151005038.jpg',
  },
  {
    id: 'slide-2',
    eyebrow: 'Sizzling Off The Coals',
    title: 'Charcoal Tikka, Malai Boti & Seekh Kabab',
    subtitle:
      'Tender spice-marinated cuts grilled over glowing embers, served hot from 4:30\u00A0PM to 2:00\u00A0AM.',
    ctaText: 'Explore BBQ Menu',
    targetCategory: 'Charcoal BBQ' as MenuCategory,
    image: '/src/assets/images/hero_bbq_grill_1795151004578.jpg',
  },
  {
    id: 'slide-3',
    eyebrow: 'Value Family Bundles',
    title: 'Family Deal — 6\u00A0Pizzas & 4\u00A0Drinks for Rs.\u00A02,999',
    subtitle:
      '2\u00A0Large + 2\u00A0Medium + 2\u00A0Small pizzas in your favorite flavors with chilled Pepsi.',
    ctaText: 'Grab Family Deal',
    targetCategory: 'Pizza Deals' as MenuCategory,
    image: '/src/assets/images/hero_family_deal_1795151004901.jpg',
  },
];

export const MENU_CATEGORIES: MenuCategory[] = [
  'Pizza Deals',
  'Signature Pizzas',
  'Charcoal BBQ',
  'Fast Food',
  'Drinks & Sides',
];

export const MENU_ITEMS: MenuItem[] = [
  // Pizza Deals
  {
    id: 'deal-01',
    name: 'Deal\u00A001 — Duo\u00A0Combo',
    category: 'Pizza Deals',
    description:
      '1\u00A0Small\u00A0Pizza + 1\u00A0Medium\u00A0Pizza + 1\u00A0Chilled\u00A0Drink in your chosen flavor.',
    price: 749,
    flavorOptions: PIZZA_FLAVORS,
    image: '/src/assets/images/deal_combo_pizzas_1795151004984.jpg',
    tag: 'Best Seller',
    popular: true,
  },
  {
    id: 'deal-02',
    name: 'Deal\u00A002 — Trio\u00A0Feast',
    category: 'Pizza Deals',
    description:
      '1\u00A0Medium\u00A0Pizza + 2\u00A0Small\u00A0Pizzas + 2\u00A0Chilled\u00A0Drinks. Ideal for small gatherings.',
    price: 999,
    flavorOptions: PIZZA_FLAVORS,
    image: '/src/assets/images/pizza_fajita_supreme_1795151005073.jpg',
    tag: 'Value Pick',
    popular: true,
  },
  {
    id: 'deal-03',
    name: 'Deal\u00A003 — Grand\u00A0Sharing',
    category: 'Pizza Deals',
    description:
      '1\u00A0Large\u00A0Pizza + 2\u00A0Medium\u00A0Pizzas + 2\u00A0Chilled\u00A0Drinks with generous melted mozzarella.',
    price: 1749,
    flavorOptions: PIZZA_FLAVORS,
    image: '/src/assets/images/hero_pizza_feast_1795151005038.jpg',
    tag: 'Group Favorite',
    popular: true,
  },
  {
    id: 'family-deal',
    name: 'Family Deal — Mega\u00A0Feast',
    category: 'Pizza Deals',
    description:
      '2\u00A0Large\u00A0Pizzas + 2\u00A0Medium\u00A0Pizzas + 2\u00A0Small\u00A0Pizzas + 4\u00A0Chilled\u00A0Drinks.',
    price: 2999,
    flavorOptions: PIZZA_FLAVORS,
    image: '/src/assets/images/hero_family_deal_1795151004901.jpg',
    tag: 'Mega Saver',
    popular: true,
  },

  // Signature Pizzas
  {
    id: 'pizza-tikka',
    name: 'Chicken Tikka\u00A0Pizza',
    category: 'Signature Pizzas',
    description:
      'Smoky tandoori tikka chicken chunks, crisp red onions, green chilies, and golden mozzarella.',
    price: 250,
    sizes: PIZZA_SIZES,
    image: '/src/assets/images/pizza_chicken_tikka_1795151004508.jpg',
    tag: 'Classic',
    popular: true,
  },
  {
    id: 'pizza-fajita',
    name: 'Chicken Fajita\u00A0Pizza',
    category: 'Signature Pizzas',
    description:
      'Zesty fajita-seasoned chicken strips, bell peppers, sweet corn, and rich mozzarella.',
    price: 250,
    sizes: PIZZA_SIZES,
    image: '/src/assets/images/pizza_fajita_supreme_1795151005073.jpg',
  },
  {
    id: 'pizza-creamy-tikka',
    name: 'Creamy Tikka\u00A0Pizza',
    category: 'Signature Pizzas',
    description:
      'Velvety garlic cream base topped with spiced tikka chicken and double cheese.',
    price: 250,
    sizes: PIZZA_SIZES,
    image: '/src/assets/images/pizza_creamy_cheese_1795151005132.jpg',
    tag: 'Creamy',
    popular: true,
  },
  {
    id: 'pizza-cheese-lover',
    name: 'Cheese Lover\u00A0Pizza',
    category: 'Signature Pizzas',
    description:
      'Triple blend of mozzarella, cheddar, and creamy cheese sauce with aromatic oregano.',
    price: 250,
    sizes: PIZZA_SIZES,
    image: '/src/assets/images/pizza_creamy_cheese_1795151005132.jpg',
  },
  {
    id: 'pizza-supreme',
    name: 'Supreme\u00A0Pizza',
    category: 'Signature Pizzas',
    description:
      'Loaded with spiced chicken, smoked sausages, black olives, mushrooms, and bell peppers.',
    price: 250,
    sizes: PIZZA_SIZES,
    image: '/src/assets/images/deal_combo_pizzas_1795151004984.jpg',
  },
  {
    id: 'pizza-chipotle',
    name: 'Chipotle\u00A0Pizza',
    category: 'Signature Pizzas',
    description:
      'Smoky chipotle drizzle over grilled chicken, jalapeños, mushrooms, and melted cheese.',
    price: 250,
    sizes: PIZZA_SIZES,
    image: '/src/assets/images/pizza_chipotle_special_1795151005187.jpg',
    tag: 'Spicy Hit',
  },
  {
    id: 'pizza-danny-special',
    name: 'Danny Special\u00A0Pizza',
    category: 'Signature Pizzas',
    description:
      'Our house masterpiece combining BBQ tikka, creamy sauce, olives, jalapeños, and extra cheese.',
    price: 250,
    sizes: PIZZA_SIZES,
    image: '/src/assets/images/hero_pizza_feast_1795151005038.jpg',
    tag: 'House Chef',
    popular: true,
  },

  // Charcoal BBQ
  {
    id: 'bbq-chicken-tikka',
    name: 'Charcoal Chicken\u00A0Tikka',
    category: 'Charcoal BBQ',
    description:
      'Quarter leg or chest piece marinated overnight in Karachi spices, flame-seared over live coals.',
    price: 450,
    image: '/src/assets/images/bbq_chicken_tikka_1795151004522.jpg',
    tag: 'Live Grill',
  },
  {
    id: 'bbq-malai-boti',
    name: 'Chicken Malai\u00A0Boti',
    category: 'Charcoal BBQ',
    description:
      'Melt-in-mouth boneless chicken cubes glazed in cream, black pepper, and white butter.',
    price: 580,
    image: '/src/assets/images/bbq_seekh_kabab_1795151004924.jpg',
  },
  {
    id: 'bbq-seekh-kabab',
    name: 'Beef Seekh Kabab (4\u00A0Pcs)',
    category: 'Charcoal BBQ',
    description:
      'Hand-minced spiced beef skewers grilled smoky, served with mint raita and onion rings.',
    price: 520,
    image: '/src/assets/images/bbq_seekh_kabab_1795151004924.jpg',
  },
  {
    id: 'bbq-special-platter',
    name: 'Danny BBQ\u00A0Platter',
    category: 'Charcoal BBQ',
    description:
      '1\u00A0Chicken\u00A0Tikka, 1\u00A0Malai\u00A0Boti skewer, 2\u00A0Seekh\u00A0Kababs, 2\u00A0garlic\u00A0naans, and chutney.',
    price: 1450,
    image: '/src/assets/images/hero_bbq_grill_1795151004578.jpg',
    tag: 'For 2-3',
  },

  // Fast Food
  {
    id: 'ff-zinger-burger',
    name: 'Crispy Zinger\u00A0Burger',
    category: 'Fast Food',
    description:
      'Crunchy golden fried chicken thigh fillet with cheddar cheese, lettuce, and spicy mayo.',
    price: 480,
    image: '/src/assets/images/fastfood_zinger_burger_1795151005441.jpg',
    tag: 'Crunchy',
  },
  {
    id: 'ff-double-zinger',
    name: 'Double Crunch\u00A0Zinger',
    category: 'Fast Food',
    description:
      'Double crispy fried chicken fillets stacked with double cheddar and signature chipotle sauce.',
    price: 690,
    image: '/src/assets/images/fastfood_zinger_burger_1795151005441.jpg',
  },
  {
    id: 'ff-paratha-roll',
    name: 'Malai Boti Paratha\u00A0Roll',
    category: 'Fast Food',
    description:
      'Flaky hot paratha rolled around charcoal malai boti, crisp onions, and garlic chutney.',
    price: 360,
    image: '/src/assets/images/fastfood_paratha_roll_1795151004435.jpg',
  },
  {
    id: 'ff-loaded-fries',
    name: 'Loaded Cheese Tikka\u00A0Fries',
    category: 'Fast Food',
    description:
      'Crispy fries smothered in melted cheddar sauce, BBQ tikka chunks, jalapeños, and chipotle.',
    price: 450,
    image: '/src/assets/images/fastfood_loaded_fries_1795151004493.jpg',
    tag: 'Fan Pick',
  },

  // Drinks & Sides
  {
    id: 'drink-500ml',
    name: 'Chilled Cold Drink (500ml)',
    category: 'Drinks & Sides',
    description: 'Ice-cold Pepsi, 7Up, or Mirinda 500ml\u00A0bottle.',
    price: 140,
    image: '/src/assets/images/drinks_cold_beverages_1795151004463.jpg',
  },
  {
    id: 'drink-15l',
    name: 'Family Cold Drink (1.5\u00A0Litre)',
    category: 'Drinks & Sides',
    description: 'Chilled 1.5\u00A0Litre Pepsi or 7Up sharing\u00A0bottle.',
    price: 260,
    image: '/src/assets/images/drinks_cold_beverages_1795151004463.jpg',
  },
  {
    id: 'side-dips',
    name: 'Garlic Mayo & Chipotle Dip\u00A0Duo',
    category: 'Drinks & Sides',
    description: 'Two house-blended creamy garlic mayo and smoky chipotle dipping\u00A0cups.',
    price: 120,
    image: '/src/assets/images/fastfood_loaded_fries_1795151004493.jpg',
  },
];

export function formatPkr(amount: number): string {
  return `Rs.\u00A0${Math.round(amount).toLocaleString('en-PK')}`;
}
