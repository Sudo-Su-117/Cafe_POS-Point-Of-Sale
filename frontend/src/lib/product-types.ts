export type ProductViewMode = "grid" | "list";

export interface Product {
  id: string;
  name: string;
  category: "Espresso" | "Cold Brew" | "Pastries" | "Sandwiches" | "Tea";
  price: number;
  uom: string;
  tax: string;
  active: boolean;
  imageUrl: string;
  sizes: string[];
  defaultSize?: string;
}

export type ProductFormData = Pick<
  Product,
  "name" | "category" | "price" | "uom" | "tax" | "active"
> & {
  id?: string;
};
