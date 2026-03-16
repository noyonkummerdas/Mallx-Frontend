/**
 * Product Interface based on MallX Mongoose Model
 */
export interface Product {
    _id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    categoryId: string | any;
    vendorId: string | any;
    images?: ProductImage[];
    variants?: ProductVariant[];
    ratingsAverage?: number;
    ratingsQuantity?: number;
    status: 'Pending' | 'Active' | 'Inactive';
}

export interface ProductImage {
    _id: string;
    url: string;
    isPrimary: boolean;
}

export interface ProductVariant {
    _id: string;
    variantName: string;
    sku: string;
    price?: number;
    stock: number;
}
