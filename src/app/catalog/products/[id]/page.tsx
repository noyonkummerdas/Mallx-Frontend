import { Metadata } from 'next';
import ProductDetailClient from './ProductDetailClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/products/${id}`);
  const data = await res.json();
  const product = data?.data?.product;
  
  return {
    title: product ? `${product.name} | MallX` : 'Product Details | MallX',
    description: product?.description || 'View product details on MallX',
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetailClient id={id} />;
}
