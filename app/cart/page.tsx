'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingBag, X, Plus, Minus, ChevronRight, Trash2, Home, Heart, Star, ShieldCheck, Truck } from 'lucide-react';
import { toast } from 'react-toastify';
import { getLocalCart, setLocalCart, updateLocalCartItem, removeFromLocalCart } from '@/lib/localStorage';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  productId?: string;
  color?: string;
  size?: string;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [removingItem, setRemovingItem] = useState<string | null>(null);
  const router = useRouter();
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        if (isAuthenticated) {
          const token = localStorage.getItem('token');
          if (!token) {
            setIsAuthenticated(false);
            setCart(getLocalCart());
            return;
          }
          const response = await api.get('/cart');
          setCart(response.data.items || []);
        } else {
          setCart(getLocalCart());
        }
      } catch (err: any) {
        console.error('Error fetching cart:', err);
        if (err.response?.status === 401 || err.message.includes('No authentication token found')) {
          setIsAuthenticated(false);
          localStorage.removeItem('token');
          setCart(getLocalCart());
        } else {
          setError(err.response?.data?.msg || 'Failed to fetch cart');
          toast.error(err.response?.data?.msg || 'Failed to fetch cart', {
            position: 'top-right',
            autoClose: 3000,
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [isAuthenticated, router, setIsAuthenticated]);

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      if (isAuthenticated) {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAuthenticated(false);
          throw new Error('No authentication token found');
        }
        const response = await api.put(`/cart/${itemId}`, { quantity });
        setCart(cart.map((item) => (item._id === itemId ? { ...item, quantity } : item)));
        toast.success('Quantity updated', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        updateLocalCartItem(itemId, quantity);
        setCart(getLocalCart());
        toast.success('Quantity updated', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (err: any) {
      if (err.response?.status === 401 || err.message.includes('No authentication token found')) {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        updateLocalCartItem(itemId, quantity);
        setCart(getLocalCart());
        toast.success('Quantity updated', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        setError(err.response?.data?.msg || 'Failed to update quantity');
        toast.error(err.response?.data?.msg || 'Failed to update quantity', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      if (isAuthenticated) {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAuthenticated(false);
          throw new Error('No authentication token found');
        }
        setRemovingItem(itemId);
        await api.delete(`/cart/${itemId}`);
        setCart(cart.filter((item) => item._id !== itemId));
        toast.success('Item removed from cart', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        removeFromLocalCart(itemId);
        setCart(getLocalCart());
        toast.success('Item removed from cart', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (err: any) {
      if (err.response?.status === 401 || err.message.includes('No authentication token found')) {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        removeFromLocalCart(itemId);
        setCart(getLocalCart());
        toast.success('Item removed from cart', {
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
    } finally {
      setRemovingItem(null);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-3 border-gray-300 border-t-rose-600 rounded-full animate-spin"></div>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Loading your cart</h3>
            <p className="text-gray-600 mt-1">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Shopping Cart
              </h1>
              <nav className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
                <Home className="w-4 h-4" />
                <ChevronRight className="w-4 h-4" />
                <span className="font-medium text-rose-700">Cart</span>
              </nav>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-gray-900">{totalItems}</div>
              <div className="text-sm text-gray-600">{totalItems === 1 ? 'item' : 'items'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="ml-3 text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}
        
        {cart.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start shopping to add items to your cart.
            </p>
            <button
              onClick={() => router.push('/products')}
              className="inline-flex items-center px-6 py-3 bg-rose-700 text-white font-medium rounded-lg hover:bg-rose-800 transition-colors duration-200"
            >
              <ShoppingBag className="mr-2 w-5 h-5" />
              Continue Shopping
            </button>
          </div>
        )}

        {cart.length > 0 && (
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Cart Items
                    </h2>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                      <span>Secure checkout</span>
                    </div>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <div key={item._id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                      <div className="flex items-start space-x-4">
                        <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                          <Image 
                            src={item.image || '/placeholder.svg'} 
                            alt={item.name} 
                            fill
                            className="object-cover" 
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-medium text-gray-900 mb-1">
                            {item.name}
                          </h3>
                          {item.color && (
                            <p className="text-sm text-gray-600">Color: {item.color}</p>
                          )}
                          {item.size && (
                            <p className="text-sm text-gray-600">Size: {item.size}</p>
                          )}
                          <div className="flex items-center space-x-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3 h-3 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                            <span className="text-xs text-gray-500 ml-1">(4.2)</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-lg font-semibold text-gray-900">
                                {item.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                              </p>
                              <p className="text-xs text-green-600">In stock</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-3">
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <div className="w-12 h-8 flex items-center justify-center text-sm font-medium text-gray-900 bg-gray-50 border-x border-gray-300">
                              {item.quantity}
                            </div>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors duration-150"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(item._id)}
                            disabled={removingItem === item._id}
                            className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors duration-150 text-sm disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 mt-8 lg:mt-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-24">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                      <span className="font-medium text-gray-900">
                        {total.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center space-x-1">
                        <Truck className="w-4 h-4 text-green-600" />
                        <span className="text-gray-600">Shipping</span>
                      </div>
                      <span className="font-medium text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium text-gray-900">Included</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-semibold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-rose-700">
                        {total.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Including all taxes and fees</p>
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => router.push(isAuthenticated ? '/checkout' : '/login?redirect=/checkout')}
                      className="w-full bg-rose-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-rose-800 transition-colors duration-200 flex items-center justify-center group"
                    >
                      <span>Proceed to Checkout</span>
                      <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                    
                    <button
                      onClick={() => router.push('/shop')}
                      className="w-full py-3 px-4 text-sm font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors duration-200"
                    >
                      Continue Shopping
                    </button>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <ShieldCheck className="w-3 h-3 text-green-600" />
                        <span>Secure</span>
                      </div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="flex items-center space-x-1">
                        <Truck className="w-3 h-3 text-blue-600" />
                        <span>Fast delivery</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}