'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Heart, ShoppingBag, Trash2, ChevronRight, Home } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import { getLocalWishlist, setLocalWishlist, addToLocalWishlist, removeFromLocalWishlist, getLocalCart, setLocalCart } from '@/lib/localStorage';
import api from '@/lib/api';

interface WishlistItem {
  _id: string;
  product: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        if (isAuthenticated) {
          const token = localStorage.getItem('token');
          if (!token) {
            setIsAuthenticated(false);
            setWishlist(getLocalWishlist());
            return;
          }
          const response = await api.get('/wishlist');
          setWishlist(response.data || []);
        } else {
          setWishlist(getLocalWishlist());
        }
      } catch (err: any) {
        console.error('Error fetching wishlist:', err);
        if (err.response?.status === 401 || err.message.includes('No authentication token found')) {
          setIsAuthenticated(false);
          localStorage.removeItem('token');
          setWishlist(getLocalWishlist());
        } else {
          setError(err.response?.data?.msg || 'Failed to fetch wishlist');
          toast.error(err.response?.data?.msg || 'Failed to fetch wishlist', {
            position: 'top-right',
            autoClose: 3000,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [isAuthenticated, setIsAuthenticated]);

  const addToCart = async (item: WishlistItem) => {
    try {
      if (isAuthenticated) {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAuthenticated(false);
          throw new Error('No authentication token found');
        }
        await api.post('/cart', { productId: item.product, quantity: 1 });
        toast.success(`${item.name} added to cart`, {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        const cartItem = {
          _id: Date.now().toString(),
          productId: item.product,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: 1,
        };
        const cart = getLocalCart();
        const existingItemIndex = cart.findIndex((i) => i.productId === item.product);
        if (existingItemIndex > -1) {
          cart[existingItemIndex].quantity += 1;
        } else {
          cart.push(cartItem);
        }
        setLocalCart(cart);
        toast.success(`${item.name} added to cart`, {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (err: any) {
      if (err.response?.status === 401 || err.message.includes('No authentication token found')) {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        const cartItem = {
          _id: Date.now().toString(),
          productId: item.product,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: 1,
        };
        const cart = getLocalCart();
        const existingItemIndex = cart.findIndex((i) => i.productId === item.product);
        if (existingItemIndex > -1) {
          cart[existingItemIndex].quantity += 1;
        } else {
          cart.push(cartItem);
        }
        setLocalCart(cart);
        toast.success(`${item.name} added to cart`, {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        toast.error(err.response?.data?.msg || 'Failed to add to cart', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      if (isAuthenticated) {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAuthenticated(false);
          throw new Error('No authentication token found');
        }
        const response = await api.delete(`/wishlist/${productId}`);
        setWishlist(response.data || []); // Update state with API response
        toast.success('Item removed from wishlist', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        removeFromLocalWishlist(productId);
        setWishlist(getLocalWishlist());
        toast.success('Item removed from wishlist', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (err: any) {
      console.error('Error removing from wishlist:', err);
      if (err.response?.status === 401 || err.message.includes('No authentication token found')) {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        removeFromLocalWishlist(productId);
        setWishlist(getLocalWishlist());
        toast.success('Item removed from wishlist', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        setError(err.response?.data?.msg || 'Failed to remove item');
        toast.error(err.response?.data?.msg || 'Failed to remove item', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-gray-900 tracking-tight">Your Wishlist</h1>
              <nav className="flex items-center space-x-2 mt-3 text-sm text-gray-500">
                <Home className="w-4 h-4" />
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium">Wishlist</span>
              </nav>
            </div>
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {wishlist.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-light text-gray-900 mb-3">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
              Discover products you love and save them to your wishlist for easy access later.
            </p>
            <button
              onClick={() => router.push('/products')}
              className="inline-flex items-center px-8 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 shadow-sm"
            >
              Start Shopping
            </button>
          </div>
        )}

        {wishlist.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {wishlist.map((item) => (
                <div key={item._id} className="p-8 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-start space-x-6">
                    <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                      <Image
                        src={item.image || '/placeholder.svg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium text-gray-900 leading-tight">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 uppercase tracking-wider">
                          {item.category}
                        </p>
                        <p className="text-xl font-semibold text-gray-900">
                          {item.price.toLocaleString('en-IN', { 
                            style: 'currency', 
                            currency: 'INR' 
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => addToCart(item)}
                        className="flex items-center justify-center w-12 h-12 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-150 shadow-sm"
                        aria-label="Add to cart"
                      >
                        <ShoppingBag className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.product)}
                        className="flex items-center justify-center w-12 h-12 bg-gray-100 text-gray-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {wishlist.length > 0 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => router.push('/products')}
              className="inline-flex items-center px-8 py-3 bg-white text-gray-900 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}