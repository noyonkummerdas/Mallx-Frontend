export interface Category {
  _id: string;
  name: string;
  parent?: string;
}

export interface ProductVariant {
  _id?: string;
  productId?: string;
  name: string; // e.g. Color
  value: string; // e.g. Red
  price?: number;
  stock?: number;
  sku?: string;
}

export interface ProductImage {
  _id?: string;
  productId?: string;
  imageUrl: string;
  isPrimary: boolean;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  categoryId: any; // Can be object or string depending on populate
  vendorId: any;
  sku: string;
  status: 'Pending' | 'Active' | 'Inactive';
  variants?: ProductVariant[];
  images?: ProductImage[];
  isFeatured: boolean;
  isNewArrival: boolean;
  createdAt: string;
}
