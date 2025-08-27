'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Star, ChevronRight, Sparkles, TrendingUp, Heart, ShoppingBag, Gift, Award } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import api from '@/lib/api';
import { useState, useEffect, memo } from 'react';
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

const ProductCard = memo(({ product, wishlist, toggleWishlist, handleAddToCart }: { 
  product: Product; 
  wishlist: Set<string>; 
  toggleWishlist: (productId: string, productName: string) => void; 
  handleAddToCart: (product: Product) => void; 
}) => {
  const isNew = new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
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
    <Link
      href={`/products/${product._id}`}
      className="group relative"
      aria-label={`View ${product.name}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl border border-gray-100">
        {isNew && (
          <div className="absolute left-4 top-4 z-10 rounded-full bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-md">
            NEW
          </div>
        )}
        <div className="absolute right-4 top-4 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product._id, product.name);
            }}
            className="rounded-full bg-white/90 p-2.5 backdrop-blur-md transition-all duration-300 hover:bg-white hover:scale-110 shadow-md focus:outline-none focus:ring-2 focus:ring-[rgb(140,77,100)]"
            aria-label={wishlist.has(product._id) ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          >
            <Heart
              className={`h-5 w-5 ${wishlist.has(product._id) ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'}`}
            />
          </button>
        </div>
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <Image
            src={product.images[currentImageIndex] || '/placeholder.svg'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
          />
        </div>
        <div className="p-5">
          <span className="text-xs font-medium uppercase tracking-widest text-gray-500">{product.category}</span>
          <h3 className="mt-2 text-base font-semibold text-gray-900 group-hover:text-[rgb(140,77,100)] transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</p>
            <div className="flex items-center space-x-1">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                  />
                ))}
              <span className="text-xs text-gray-500">({product.reviewCount || 0})</span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart(product);
            }}
            className="mt-4 w-full bg-[rgb(140,77,100)] hover:bg-[rgb(120,60,85)] text-white px-4 py-2.5 rounded-full font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[rgb(140,77,100)]"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
});
ProductCard.displayName = 'ProductCard';

export default function HomePage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { setLoading } = useLoading();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const heroImages = ['/images/home1.jpg', '/images/home2.jpg', '/images/home3.jpg'];
  const mobileHeroItems = ['/images/mobile1.webp', '/images/mobile2.webp'];

  const fetchProducts = debounce(async () => {
    try {
      setLoading(true);
      const response = await api.get('/products', { params: { limit: 8 } });
      let fetchedProducts: Product[] = [];

      if (response.data.products && Array.isArray(response.data.products)) {
        fetchedProducts = response.data.products;
      } else if (Array.isArray(response.data)) {
        fetchedProducts = response.data;
      } else {
        throw new Error('Unexpected API response structure');
      }

      const featured = fetchedProducts
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 4);

      const featuredIds = new Set(featured.map((p) => p._id));
      const trending = fetchedProducts
        .filter((p) => !featuredIds.has(p._id))
        .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
        .slice(0, 4);

      setFeaturedProducts(featured);
      setTrendingProducts(trending);
      if (fetchedProducts.length === 0) {
        setError('No products available at the moment.');
      }
    } catch (err: any) {
      setError('Failed to load products.');
    } finally {
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

  const toggleWishlist = async (productId: string, productName: string) => {
    const newWishlist = new Set(wishlist);
    const isAdding = !newWishlist.has(productId);
    const product = [...featuredProducts, ...trendingProducts].find((p) => p._id === productId);

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
      toast.success(isAdding ? `${productName} added to your wishlist ❤️` : 'Product removed from your wishlist', {
        position: 'top-right',
        autoClose: 2000,
      });
    } catch (err: any) {
      console.error('Wishlist error:', err);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchProducts();
      fetchWishlist();
    }
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentImageIndex]);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="hidden sm:block relative h-[90vh] min-h-[700px] overflow-hidden">
        <div className="relative w-full h-full">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                currentImageIndex === index ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={image}
                alt={`Hero Image ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-6 lg:px-12">
              <div className="max-w-2xl">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/products">
                    <Button
                      size="lg"
                      className="group bg-[rgb(140,77,100)] hover:bg-[rgb(120,60,85)] text-white px-8 py-4 text-lg font-semibold"
                      aria-label="Shop the collection"
                    >
                      <span className="flex items-center">
                        Shop Collection
                        <ShoppingBag className="ml-2 h-5 w-5" />
                      </span>
                    </Button>
                  </Link>
                  <Link href="/collections">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-2 border-white/30 bg-white/20 text-gray-900 px-8 py-4 text-lg font-semibold hover:bg-white/40"
                      aria-label="View all collections"
                    >
                      View Collections
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 space-x-3">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-2.5 w-12 rounded-full ${
                  index === currentImageIndex ? 'bg-[rgb(140,77,100)]' : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="block sm:hidden relative w-full h-[60vh] min-h-[400px] overflow-hidden">
        <div className="relative w-full h-full">
          {mobileHeroItems.map((item, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                currentImageIndex === index ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={item}
                alt={`Mobile Hero ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
            </div>
          ))}
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 space-x-2">
            {mobileHeroItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-2 w-8 rounded-full ${
                  index === currentImageIndex ? 'bg-[rgb(140,77,100)]' : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[rgb(245,240,242)]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Award, title: 'Premium Quality', desc: 'Handcrafted Excellence' },
              { icon: ShoppingBag, title: 'Free Shipping', desc: 'On orders above ₹3000' },
              { icon: Heart, title: '24/7 Support', desc: 'Dedicated customer care' },
              { icon: Gift, title: 'Easy Returns', desc: '7-day return policy' },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 rounded-xl bg-white/80 shadow-md"
              >
                <div className="p-3 rounded-full bg-[rgb(140,77,100)]/10">
                  <feature.icon className="h-6 w-6 text-[rgb(140,77,100)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-base">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center rounded-full px-6 py-2.5 bg-[rgb(140,77,100)]/10">
              <span className="text-sm font-semibold uppercase text-[rgb(140,77,100)]">Shop by Category</span>
            </div>
            <h2 className="mb-4 text-4xl sm:text-5xl font-extrabold text-gray-900">Our Collections</h2>
            <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-lg mx-auto">
              Explore our curated collections of traditional and modern ethnic wear
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Women's Ethnic", items: '250+ Items', video: '/videos/womens-ethnic.mp4' },
              { name: 'Saree', items: '180+ Items', video: '/videos/saree-collection.mp4' },
              { name: 'Dresses', items: '120+ Items', video: '/videos/designer-dresses.mp4' },
              { name: 'Lahenga', items: '95+ Items', video: '/videos/lehenga-sets.mp4' },
            ].map((category) => (
              <Link
                key={category.name}
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="group relative"
                aria-label={`Explore ${category.name}`}
              >
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg border-4 border-[rgb(140,77,100)]/20">
                  <div className="relative aspect-[1/1]">
                    <video
                      src={category.video || '/videos/placeholder.mp4'}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{category.name}</h3>
                      <p className="text-white/80 text-sm">{category.items}</p>
                      <div className="flex items-center text-white mt-3 opacity-0 group-hover:opacity-100">
                        <span className="text-sm font-medium">Shop Now</span>
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[rgb(245,240,242)]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="mb-4 inline-flex items-center rounded-full px-6 py-2.5 bg-[rgb(140,77,100)]/10">
                <Star className="mr-2 h-4 w-4 text-[rgb(140,77,100)]" />
                <span className="text-sm font-semibold uppercase text-[rgb(140,77,100)]">Best Sellers</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3">Customer Favorites</h2>
            </div>
            <Link href="/products">
              <Button
                variant="outline"
                size="lg"
                className="border-2 text-[rgb(140,77,100)] hover:bg-[rgb(140,77,100)] hover:text-white px-6 py-3"
                aria-label="View all products"
              >
                View All Products
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          {error ? (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-6 text-lg">{error}</p>
              <Button
                onClick={fetchProducts}
                className="bg-[rgb(140,77,100)] hover:bg-[rgb(120,60,85)] text-white px-8 py-3 rounded-lg"
                aria-label="Retry loading products"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  wishlist={wishlist} 
                  toggleWishlist={toggleWishlist} 
                  handleAddToCart={handleAddToCart} 
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div
            className="relative overflow-hidden rounded-3xl shadow-2xl bg-cover bg-center"
            style={{ backgroundImage: `url(/images/festive-sale-bg.webp)` }}
          >
            <div className="relative h-[500px] sm:h-[600px]">
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex items-center justify-start">
                <div className="text-left max-w-md px-8 sm:px-12">
                  <div className="mb-6 inline-flex items-center rounded-full bg-yellow-300 px-6 py-3">
                    <Sparkles className="mr-3 h-5 w-5 text-yellow-900" />
                    <span className="font-bold text-yellow-900 text-base">FESTIVE OFFER</span>
                  </div>
                  <h2 className="mb-4 text-3xl sm:text-4xl font-extrabold text-white">
                    Festive Sale
                    <span className="block text-2xl sm:text-3xl font-light mt-1">Up to 50% Off</span>
                  </h2>
                  <Link href="/products">
                    <Button
                      size="lg"
                      className="bg-yellow-300 text-gray-900 px-10 py-5 text-lg font-bold"
                      aria-label="Shop sale items"
                    >
                      Shop Sale Items
                      <Gift className="ml-3 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="mb-4 inline-flex items-center rounded-full px-6 py-2.5 bg-[rgb(140,77,100)]/10">
                <TrendingUp className="mr-2 h-4 w-4 text-[rgb(140,77,100)]" />
                <span className="text-sm font-semibold uppercase text-[rgb(140,77,100)]">Trending Now</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3">What's Popular</h2>
            </div>
            <Link href="/products">
              <Button
                variant="outline"
                size="lg"
                className="border-2 text-[rgb(140,77,100)] hover:bg-[rgb(140,77,100)] hover:text-white px-6 py-3"
                aria-label="Explore trending products"
              >
                Explore Trends
                <TrendingUp className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          {error ? (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-6 text-lg">{error}</p>
              <Button
                onClick={fetchProducts}
                className="bg-[rgb(140,77,100)] hover:bg-[rgb(120,60,85)] text-white px-8 py-3 rounded-lg"
                aria-label="Retry loading products"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingProducts.map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  wishlist={wishlist} 
                  toggleWishlist={toggleWishlist} 
                  handleAddToCart={handleAddToCart} 
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        html {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </div>
  );
}