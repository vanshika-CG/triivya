// app/products/page.tsx
import { Suspense } from 'react';
import ProductsContent from './ProductsContent';

// This is a Server Component by default
export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}