export interface Product {
  id: string;
  name: string;
  category: "Espresso" | "Cold Brew" | "Pastries" | "Sandwiches" | "Tea";
  price: number;
  uom: string;
  tax: string;
  active: boolean;
}
