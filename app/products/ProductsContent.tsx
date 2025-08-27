'use client';

import { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  Star,
  Heart,
  ShoppingBag,
  Grid3X3,
  List,
  Search,
  SlidersHorizontal,
  Eye,
  ArrowUpDown,
  X,
  ChevronDown,
  Plus,
  Minus,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import { addToLocalCart, getLocalWishlist, addToLocalWishlist, removeFromLocalWishlist } from '@/lib/localStorage';
import { useLoading } from '@/lib/LoadingContext';
import { debounce } from 'lodash';

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  description: string;
  category: string;
  rating: number;
  reviewCount: number;
  sku: string;
  availability: string;
  images: string[];
  colors: { name: string; value: string; selected: boolean }[];
  sizes: { value: string; selected: boolean }[];
  features: string[];
  specifications: Record<string, string>;
  createdAt: string;
}

const ProductCard = memo(({ product, wishlist, toggleWishlist, handleAddToCart, setQuickViewProduct }: { 
  product: Product; 
  wishlist: Set<string>; 
  toggleWishlist: (productId: string) => void; 
  handleAddToCart: (product: Product) => void; 
  setQuickViewProduct: (product: Product) => void; 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleMouseEnter = () => {
    if (product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const handleMouseLeave = () => {
    setCurrentImageIndex(0);
  };

  return (
    <div
      className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        <Link href={`/products/${product._id}`}>
          <Image
            src={product.images[currentImageIndex] || '/placeholder.svg'}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <button
            onClick={() => toggleWishlist(product._id)}
            className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100"
            aria-label={wishlist.has(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              className={`w-4 h-4 ${wishlist.has(product._id) ? 'fill-[var(--primary)] text-[var(--primary)]' : 'text-gray-600 hover:text-[var(--primary)]'}`}
            />
          </button>
          <button
            onClick={() => setQuickViewProduct(product)}
            className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100"
            aria-label="Quick view"
          >
            <Eye className="w-4 h-4 text-gray-600 hover:text-[var(--primary)]" />
          </button>
        </div>
      </div>
      <div className="p-3">
        <Link href={`/products/${product._id}`}>
          <span className="block text-xs text-gray-500 uppercase font-medium">{product.category}</span>
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[var(--primary)] line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-base font-bold text-gray-900">{formatPrice(product.price)}</p>
          <div className="flex items-center">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < Math.floor(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                />
              ))}
            <span className="ml-1 text-xs text-gray-500">({product.reviewCount || 0})</span>
          </div>
        </div>
        <button
          onClick={() => handleAddToCart(product)}
          className="mt-2 w-full bg-[var(--primary)] text-white py-1.5 rounded-lg font-medium text-xs hover:bg-[var(--primary-hover)] flex items-center justify-center gap-1"
        >
          <ShoppingBag className="w-3 h-3" />
          Add to Cart
        </button>
      </div>
    </div>
  );
});
ProductCard.displayName = 'ProductCard';

const ProductListItem = memo(({ product, wishlist, toggleWishlist, handleAddToCart, setQuickViewProduct }: { 
  product: Product; 
  wishlist: Set<string>; 
  toggleWishlist: (productId: string) => void; 
  handleAddToCart: (product: Product) => void; 
  setQuickViewProduct: (product: Product) => void; 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleMouseEnter = () => {
    if (product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const handleMouseLeave = () => {
    setCurrentImageIndex(0);
  };

  return (
    <div
      className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex items-center p-3"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative w-32 h-40 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50">
        <Link href={`/products/${product._id}`}>
          <Image
            src={product.images[currentImageIndex] || '/placeholder.svg'}
            alt={product.name}
            fill
            sizes="128px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
      </div>
      <div className="flex-1 pl-3">
        <Link href={`/products/${product._id}`}>
          <span className="block text-xs text-gray-500 uppercase font-medium">{product.category}</span>
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[var(--primary)]">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-xs text-gray-600 line-clamp-2">{product.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-base font-bold text-gray-900">{formatPrice(product.price)}</p>
          <div className="flex items-center">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < Math.floor(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                />
              ))}
            <span className="ml-1 text-xs text-gray-500">({product.reviewCount || 0})</span>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={() => handleAddToCart(product)}
            className="bg-[var(--primary)] text-white py-1.5 px-4 rounded-lg font-medium text-xs hover:bg-[var(--primary-hover)] flex items-center gap-1"
          >
            <ShoppingBag className="w-3 h-3" />
            Add to Cart
          </button>
          <button
            onClick={() => toggleWishlist(product._id)}
            className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100"
            aria-label={wishlist.has(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              className={`w-4 h-4 ${wishlist.has(product._id) ? 'fill-[var(--primary)] text-[var(--primary)]' : 'text-gray-600 hover:text-[var(--primary)]'}`}
            />
          </button>
          <button
            onClick={() => setQuickViewProduct(product)}
            className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100"
            aria-label="Quick view"
          >
            <Eye className="w-4 h-4 text-gray-600 hover:text-[var(--primary)]" />
          </button>
        </div>
      </div>
    </div>
  );
});
ProductListItem.displayName = 'ProductListItem';

const QuickViewModal = memo(({ product, onClose }: { product: Product; onClose: () => void }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]?.value || '');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-1/2 aspect-[3/4] sm:aspect-[4/3] bg-gray-50">
            <Image
              src={product.images[0] || '/placeholder.svg'}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-lg hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-700 hover:text-[var(--primary)]" />
            </button>
          </div>
          <div className="p-6 sm:w-1/2 flex flex-col gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{product.name}</h2>
              <p className="text-lg font-semibold text-[var(--primary)]">{formatPrice(product.price)}</p>
            </div>
            <p className="text-sm text-gray-600">{product.description}</p>
            {product.colors?.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full border-2 ${
                        selectedColor === color.name 
                          ? 'border-[var(--primary)] scale-110' 
                          : 'border-gray-200 hover:border-[var(--primary)]'
                      }`}
                      style={{ backgroundColor: color.value }}
                      aria-label={`Select ${color.name}`}
                    >
                      {selectedColor === color.name && (
                        <Check className="w-5 h-5 mx-auto text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {product.sizes?.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => setSelectedSize(size.value)}
                      className={`px-4 py-1.5 rounded-full border text-sm font-medium ${
                        selectedSize === size.value 
                          ? 'bg-[var(--primary)] text-white border-[var(--primary)]' 
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                      aria-label={`Select ${size.value}`}
                    >
                      {size.value}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Quantity</label>
              <div className="flex items-center border border-gray-200 rounded-full">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 hover:bg-gray-100"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                <span className="px-4 py-2 text-sm text-gray-900 min-w-[2.5rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 hover:bg-gray-100"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                handleAddToCart({
                  ...product,
                  colors: [{ name: selectedColor, value: selectedColor, selected: true }],
                  sizes: [{ value: selectedSize, selected: true }],
                });
                onClose();
              }}
              className="w-full bg-[var(--primary)] text-white py-3 rounded-full font-semibold text-sm hover:bg-[var(--primary-hover)] flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Category: {product.category}</span>
              <span>•</span>
              <span>SKU: {product.sku}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
QuickViewModal.displayName = 'QuickViewModal';

const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
    <div className="relative aspect-[3/4] bg-gray-200" />
    <div className="p-3 space-y-2">
      <div className="h-3 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="flex items-center gap-1">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="w-3 h-3 bg-gray-200 rounded-full" />
          ))}
        </div>
      </div>
      <div className="h-8 bg-gray-200 rounded-lg" />
    </div>
  </div>
);

const SkeletonListItem = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex p-3 animate-pulse">
    <div className="w-32 h-40 bg-gray-200 rounded-lg" />
    <div className="flex-1 pl-3 space-y-2">
      <div className="h-3 bg-gray-200 rounded w-1/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-3 bg-gray-200 rounded w-3/4" />
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="flex items-center gap-1">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="w-3 h-3 bg-gray-200 rounded-full" />
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-8 bg-gray-200 rounded-lg w-24" />
        <div className="h-8 w-8 bg-gray-200 rounded-full" />
        <div className="h-8 w-8 bg-gray-200 rounded-full" />
      </div>
    </div>
  </div>
);

export default function ProductsContent() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { setLoading } = useLoading();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFetchingProducts, setIsFetchingProducts] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 20000 });
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const categories = ['all', 'Dresses', 'Lahenga', 'Saree', "Women's Ethnic"];
  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Best Rated' },
    { value: 'popular', label: 'Most Popular' },
  ];

  const fetchProducts = debounce(async (pageNum: number, append = false, overrideCategory?: string) => {
    try {
      setIsFetchingProducts(true);
      setLoading(true);
      const categoryToFetch = overrideCategory !== undefined ? overrideCategory : selectedCategory;
      const response = await api.get('/products', {
        params: {
          page: pageNum,
          limit: 12,
          category: categoryToFetch !== 'all' ? categoryToFetch : undefined,
          search: searchTerm || undefined,
          minPrice: priceRange.min,
          maxPrice: priceRange.max,
          sort: sortBy,
        },
      });
      let fetchedProducts: Product[] = [];
      let total = 0;

      if (response.data.products && Array.isArray(response.data.products)) {
        fetchedProducts = response.data.products;
        total = response.data.total || fetchedProducts.length;
      } else {
        throw new Error('Unexpected API response structure');
      }

      setProducts((prev) => (append ? [...prev, ...fetchedProducts] : fetchedProducts));
      setHasMore(pageNum < Math.ceil(total / 12));
      if (fetchedProducts.length === 0) {
        setError('No products available at the moment.');
      }
    } catch (err: any) {
      setError('Failed to load products.');
    } finally {
      setIsFetchingProducts(false);
      setLoading(false);
    }
  }, 300);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      if (isAuthenticated) {
        const response = await api.get('/wishlist');
        setWishlist(new Set(response.data.map((item: any) => item.product)));
      } else {
        const localWishlist = getLocalWishlist();
        setWishlist(new Set(localWishlist.map((item: any) => item.product)));
      }
    } catch (err: any) {
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      if (!isAuthenticated) {
        addToLocalCart({
          _id: Date.now().toString(),
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.images[0] || '/placeholder.svg',
          quantity: 1,
          color: product.colors?.length > 0 ? product.colors[0].name : undefined,
          size: product.sizes?.length > 0 ? product.sizes[0].value : undefined,
        });
      } else {
        await api.post('/cart', {
          productId: product._id,
          quantity: 1,
          color: product.colors?.length > 0 ? product.colors[0].name : undefined,
          size: product.sizes?.length > 0 ? product.sizes[0].value : undefined,
        });
      }
      toast.success(`${product.name} added to your cart 🛍️`, {
        position: 'top-right',
        autoClose: 2000,
      });
    } catch (err: any) {
      toast.error('Failed to add product to cart.', {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  };

  const toggleWishlist = async (productId: string) => {
    const newWishlist = new Set(wishlist);
    const isAdding = !newWishlist.has(productId);
    const product = products.find((p) => p._id === productId);

    if (!product) return;

    try {
      if (isAuthenticated) {
        if (isAdding) {
          await api.post('/wishlist', { productId });
          newWishlist.add(productId);
        } else {
          await api.delete(`/wishlist/${productId}`);
          newWishlist.delete(productId);
        }
      } else {
        if (isAdding) {
          addToLocalWishlist({
            _id: Date.now().toString(),
            product: productId,
            name: product.name,
            price: product.price,
            image: product.images[0] || '/placeholder.svg',
            category: product.category,
          });
          newWishlist.add(productId);
        } else {
          removeFromLocalWishlist(productId);
          newWishlist.delete(productId);
        }
      }
      setWishlist(newWishlist);
      toast.success(isAdding ? `${product.name} added to your wishlist ❤️` : 'Product removed from your wishlist', {
        position: 'top-right',
        autoClose: 2000,
      });
    } catch (err: any) {
      console.error('Wishlist error:', err);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    const categoryFromQuery = searchParams.get('category');
    let initialCategory = 'all';
    if (categoryFromQuery) {
      const decodedCategory = decodeURIComponent(categoryFromQuery);
      const matchedCategory = categories.find(
        (cat) => cat.toLowerCase() === decodedCategory.toLowerCase()
      );
      if (matchedCategory) {
        initialCategory = matchedCategory;
      }
    }
    setSelectedCategory(initialCategory);
    fetchProducts(1, false, initialCategory);
    fetchWishlist();
  }, [authLoading, searchParams]);

  useEffect(() => {
    if (!authLoading && !isFetchingProducts) {
      fetchProducts(1);
    }
  }, [searchTerm, selectedCategory, priceRange, sortBy]);

  const debouncedSetSearchTerm = debounce((value: string) => {
    setSearchTerm(value);
    setPage(1);
  }, 300);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 [--primary:rgb(140,77,100)] [--primary-hover:rgb(120,67,90)]">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4">
          <h1 className="text-xl font-bold text-gray-900">Shop All Products</h1>
          <nav className="mt-1 flex items-center text-xs text-gray-500">
            <Link href="/" className="hover:text-[var(--primary)]">
              Home
            </Link>
            <ChevronDown className="w-3 h-3 mx-1 text-gray-400" />
            <span className="text-gray-900">Products</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:w-1/4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full bg-[var(--primary)] text-white py-1.5 px-3 rounded-lg font-medium flex items-center justify-between mb-3 hover:bg-[var(--primary-hover)]"
            >
              <span>Filters</span>
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <div
              className={`lg:block bg-white rounded-xl shadow-sm p-4 border border-gray-100 ${showFilters ? 'block' : 'hidden'}`}
            >
              <h2 className="text-base font-semibold text-gray-900 mb-3">Filters</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-medium text-gray-700 mb-1">Search</h3>
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      onChange={(e) => debouncedSetSearchTerm(e.target.value)}
                      placeholder="Search products..."
                      className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-700 mb-1">Category</h3>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center">
                        <input
                          type="radio"
                          id={category}
                          name="category"
                          value={category}
                          checked={selectedCategory === category}
                          onChange={() => {
                            setSelectedCategory(category);
                            setPage(1);
                          }}
                          className="h-3 w-3 text-[var(--primary)] focus:ring-[var(--primary)]"
                        />
                        <label htmlFor={category} className="ml-2 text-xs text-gray-600 capitalize">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-700 mb-1">Price Range</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => {
                          setPriceRange({ ...priceRange, min: Number(e.target.value) });
                          setPage(1);
                        }}
                        placeholder="Min"
                        className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                      <span className="text-gray-600">-</span>
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => {
                          setPriceRange({ ...priceRange, max: Number(e.target.value) });
                          setPage(1);
                        }}
                        placeholder="Max"
                        className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-3/4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
              <div className="flex items-center">
                <span className="text-xs text-gray-600">
                  Showing {products.length} products
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-lg border border-gray-200 bg-white p-1.5 pr-7 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-[var(--primary)] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-[var(--primary)] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            {isFetchingProducts ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
                {Array(6).fill(0).map((_, i) => (
                  viewMode === 'grid' ? <SkeletonCard key={i} /> : <SkeletonListItem key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4 text-xs">{error}</p>
                <Button
                  onClick={() => fetchProducts(1)}
                  className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-1.5 rounded-lg font-medium text-xs"
                >
                  Try Again
                </Button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4 text-xs">No products found matching your criteria.</p>
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setPriceRange({ min: 0, max: 20000 });
                    setSortBy('featured');
                    setPage(1);
                  }}
                  className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-1.5 rounded-lg font-medium text-xs"
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
                  {products.map((product) => (
                    viewMode === 'grid' ? (
                      <ProductCard 
                        key={product._id} 
                        product={product} 
                        wishlist={wishlist} 
                        toggleWishlist={toggleWishlist} 
                        handleAddToCart={handleAddToCart} 
                        setQuickViewProduct={setQuickViewProduct} 
                      />
                    ) : (
                      <ProductListItem 
                        key={product._id} 
                        product={product} 
                        wishlist={wishlist} 
                        toggleWishlist={toggleWishlist} 
                        handleAddToCart={handleAddToCart} 
                        setQuickViewProduct={setQuickViewProduct} 
                      />
                    )
                  ))}
                </div>
                {hasMore && (
                  <div className="mt-6 text-center">
                    <Button
                      onClick={() => {
                        const nextPage = page + 1;
                        setPage(nextPage);
                        fetchProducts(nextPage, true);
                      }}
                      className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-1.5 rounded-lg font-medium text-xs"
                      disabled={isFetchingProducts}
                    >
                      {isFetchingProducts ? 'Loading...' : 'Load More'}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </div>
  );
}