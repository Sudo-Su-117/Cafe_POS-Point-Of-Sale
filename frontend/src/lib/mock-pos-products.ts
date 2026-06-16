import { POSProduct } from "./pos-product-types";

export const POS_PRODUCTS: POSProduct[] = [
  { id: 1,  name: "Espresso Shot",    price: 280.00, category: "Espresso",   emoji: "☕" },
  { id: 2,  name: "Americano",        price: 240.00, category: "Espresso",   emoji: "☕" },
  { id: 3,  name: "Flat White",       price: 320.00, category: "Espresso",   emoji: "☕" },
  { id: 4,  name: "Cappuccino",       price: 360.00, category: "Espresso",   emoji: "☕" },
  { id: 5,  name: "Oat Milk Latte",   price: 440.00, category: "Espresso",   emoji: "☕" },
  { id: 6,  name: "Cortado",          price: 320.00, category: "Espresso",   emoji: "☕" },
  { id: 7,  name: "Cold Brew",        price: 400.00, category: "Cold Brew",  emoji: "🧊" },
  { id: 8,  name: "Nitro Cold Brew",  price: 440.00, category: "Cold Brew",  emoji: "🧊" },
  { id: 9,  name: "Iced Latte",       price: 360.00, category: "Cold Brew",  emoji: "🧊" },
  { id: 10, name: "Cold Brew Tonic",  price: 400.00, category: "Cold Brew",  emoji: "🧊" },
  { id: 11, name: "Chai Latte",       price: 384.00, category: "Tea",        emoji: "🍵" },
  { id: 12, name: "Matcha Latte",     price: 400.00, category: "Tea",        emoji: "🍵" },
  { id: 13, name: "Chamomile",        price: 280.00, category: "Tea",        emoji: "🍵" },
  { id: 14, name: "Earl Grey",        price: 280.00, category: "Tea",        emoji: "🍵" },
  { id: 15, name: "Butter Croissant", price: 280.00, category: "Pastries",   emoji: "🥐" },
  { id: 16, name: "Blueberry Muffin", price: 240.00, category: "Pastries",   emoji: "🧁" },
  { id: 17, name: "Cinnamon Roll",    price: 280.00, category: "Pastries",   emoji: "🥐" },
  { id: 18, name: "Almond Danish",    price: 320.00, category: "Pastries",   emoji: "🥐" },
  { id: 19, name: "Avocado Toast",    price: 680.00, category: "Sandwiches", emoji: "🥑" },
  { id: 20, name: "BLT Club",         price: 720.00, category: "Sandwiches", emoji: "🥪" },
  { id: 21, name: "Side Salad",       price: 360.00, category: "Sides",      emoji: "🥗" },
  { id: 22, name: "Fries",            price: 280.00, category: "Sides",      emoji: "🍟" },
];

export const POS_CATEGORIES = [
  "All",
  "Espresso",
  "Cold Brew",
  "Tea",
  "Pastries",
  "Sandwiches",
  "Sides",
] as const;
