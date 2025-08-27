// components/featured-products.tsx
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button"; // Not used directly here, but part of context
import { Badge } from "@/components/ui/badge"; // Not used directly here, but part of context
import { formatPrice } from "@/lib/utils";


interface Product {
  id: string; // Changed to string for MongoDB _id
  name: string;
  price: number;
  images: string[];
  category: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  discount?: number;
  originalPrice?: number | null; // Can be null
  description?: string;
  sizes?: { value: string; selected: boolean }[]; // Adjust to match schema
  colors?: { name: string; value: string; selected: boolean }[]; // Adjust to match schema
  color?: string; // This might be from data.js, consider if still needed or if 'colors' array is enough
  sku?: string;
}

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="group relative overflow-hidden rounded-lg border bg-white transition-all duration-300 hover:shadow-xl"
          style={{ borderColor: "#e0e0e0", borderRadius: "12px" }}
        >
          <Link href={`/products/${product.id}`}>
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
              <Image
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {product.discount && product.discount > 0 && ( // Ensure discount is valid
                <div className="absolute left-2 top-2 rounded-full bg-green-500 px-2 py-1 text-xs font-medium text-white">
                  {product.discount}% OFF
                </div>
              )}
              {product.isNew && (
                <div className="absolute right-2 top-2 rounded-full bg-blue-500 px-2 py-1 text-xs font-medium text-white">
                  NEW
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="line-clamp-2 text-sm font-medium text-gray-900">
                {product.name}
              </h3>
              {/* Display primary color if available in the 'colors' array or 'color' string */}
              {product.colors && product.colors.length > 0 && (
                <p className="mt-1 text-sm text-gray-600">
                  <span
                    className="inline-block px-2 py-1 rounded-md"
                    style={{
                      backgroundColor: product.colors[0].name.toLowerCase() === "off white" ? "#F5F5DC" : (product.colors[0].value || "#e0e0e0"), // Use value if present
                      border: "1px solid #d1d1d1",
                      fontWeight: 500,
                      color: "#2d2d2d",
                    }}
                  >
                    {product.colors[0].name}
                  </span>
                </p>
              )}
              {/* Fallback for single 'color' string if 'colors' array isn't used */}
              {!product.colors && product.color && (
                 <p className="mt-1 text-sm text-gray-600">
                 <span
                   className="inline-block px-2 py-1 rounded-md"
                   style={{
                     backgroundColor: product.color.toLowerCase() === "off white" ? "#F5F5DC" : "#e0e0e0",
                     border: "1px solid #d1d1d1",
                     fontWeight: 500,
                     color: "#2d2d2d",
                   }}
                 >
                   {product.color}
                 </span>
               </p>
              )}


              <div className="mt-2 flex items-center gap-2">
                <span className="text-base font-semibold text-pink-600">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.originalPrice && product.originalPrice > product.price && ( // Only show if original price is higher
                  <span className="text-sm text-gray-500 line-through">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviewCount})
                </span>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}