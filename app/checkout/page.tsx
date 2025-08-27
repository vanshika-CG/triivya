'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronRight, Home, X, MapPin, CreditCard, Package, Shield } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import Image from 'next/image';
import PaymentButton from '@/components/PaymentButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CartItem {
  _id: string;
  product: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color?: string;
  size?: string;
}

interface Address {
  _id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  pincode?: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [newAddress, setNewAddress] = useState<Address>({
    _id: '',
    name: '',
    street: '',
    city: '',
    state: '',
    country: '',
    phone: '',
    pincode: '',
    isDefault: false,
  });
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // Validation patterns
  const lettersOnlyPattern = /^[A-Za-z\s]+$/;
  const digitsOnlyPattern = /^\d+$/;
  const phonePattern = /^\d{10}$/;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login?redirect=/checkout');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [cartResponse, addressesResponse] = await Promise.all([
          api.get('/cart'),
          api.get('/addresses'),
        ]);
        setCart(cartResponse.data.items || []);
        setAddresses(addressesResponse.data || []);
        const defaultAddress = addressesResponse.data.find((addr: Address) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id);
        }
      } catch (err: any) {
        setError(err.response?.data?.msg || 'Failed to load data');
        toast.error(err.response?.data?.msg || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Validate input based on field
    if (name === 'name' || name === 'city' || name === 'state' || name === 'country') {
      if (value && !lettersOnlyPattern.test(value)) {
        toast.error(`${name.charAt(0).toUpperCase() + name.slice(1)} can only contain letters and spaces`);
        return;
      }
    } else if (name === 'phone') {
      if (value && !digitsOnlyPattern.test(value)) {
        toast.error('Phone number can only contain digits');
        return;
      }
      if (value.length > 10) {
        toast.error('Phone number must be exactly 10 digits');
        return;
      }
    } else if (name === 'pincode') {
      if (value && !digitsOnlyPattern.test(value)) {
        toast.error('Pincode can only contain digits');
        return;
      }
    }

    setNewAddress({ ...newAddress, [name]: value });
  };

  const handleSaveNewAddress = async () => {
    // Final validation before saving
    if (!lettersOnlyPattern.test(newAddress.name)) {
      toast.error('Name can only contain letters and spaces');
      return;
    }
    if (!phonePattern.test(newAddress.phone)) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }
    if (!lettersOnlyPattern.test(newAddress.city)) {
      toast.error('City can only contain letters and spaces');
      return;
    }
    if (!lettersOnlyPattern.test(newAddress.state)) {
      toast.error('State can only contain letters and spaces');
      return;
    }
    if (!lettersOnlyPattern.test(newAddress.country)) {
      toast.error('Country can only contain letters and spaces');
      return;
    }
    if (!digitsOnlyPattern.test(newAddress.pincode || '')) {
      toast.error('Pincode can only contain digits');
      return;
    }

    try {
      const response = await api.post('/addresses', { ...newAddress, isDefault: addresses.length === 0 });
      setAddresses([...addresses, response.data]);
      setSelectedAddressId(response.data._id);
      setUseNewAddress(false);
      toast.success('Address saved successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.msg || 'Failed to save address');
    }
  };

  const selectedAddress = addresses.find((addr: Address) => addr._id === selectedAddressId) || newAddress;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0;
  const total = subtotal;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center space-y-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Preparing your checkout</h3>
            <p className="text-slate-600">Please wait while we load your information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Secure Checkout
              </h1>
              <nav className="flex items-center space-x-2 mt-2 text-sm text-slate-500">
                <Home className="w-4 h-4" />
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-700 font-medium">Checkout</span>
              </nav>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span className="font-medium">SSL Secured</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-start">
              <div className="bg-red-100 rounded-full p-1 mr-3">
                <X className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="lg:grid lg:grid-cols-12 lg:gap-10">
          {/* Main Content */}
          <div className="lg:col-span-7">
            {/* Shipping Address Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200/50">
                <div className="flex items-center space-x-3">
                  <div className="bg-emerald-500 rounded-full p-2">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800">Shipping Address</h2>
                    <p className="text-sm text-slate-600">Where should we deliver your order?</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {addresses.length > 0 && !useNewAddress ? (
                  <div className="space-y-4">
                    <Select value={selectedAddressId} onValueChange={setSelectedAddressId}>
                      <SelectTrigger className="h-12 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500">
                        <SelectValue placeholder="Select a saved address" />
                      </SelectTrigger>
                      <SelectContent>
                        {addresses.map((addr: Address) => (
                          <SelectItem key={addr._id} value={addr._id} className="py-3">
                            <div className="flex flex-col">
                              <span className="font-medium">{addr.name}</span>
                              <span className="text-sm text-slate-600">{addr.street}, {addr.city}, {addr.pincode}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300"
                      onClick={() => setUseNewAddress(true)}
                    >
                      + Add New Address
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={newAddress.name}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                        <input
                          type="text"
                          name="phone"
                          value={newAddress.phone}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                          placeholder="Enter your phone number"
                          maxLength={10}
                        />
                      </div>
                      <div className="sm:col-span-2 space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Street Address</label>
                        <input
                          type="text"
                          name="street"
                          value={newAddress.street}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                          placeholder="Enter your street address"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">City</label>
                        <input
                          type="text"
                          name="city"
                          value={newAddress.city}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                          placeholder="Enter your city"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">State</label>
                        <input
                          type="text"
                          name="state"
                          value={newAddress.state}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                          placeholder="Enter your state"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Pincode</label>
                        <input
                          type="text"
                          name="pincode"
                          value={newAddress.pincode}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                          placeholder="Enter your pincode"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Country</label>
                        <input
                          type="text"
                          name="country"
                          value={newAddress.country}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                          placeholder="Enter your country"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={handleSaveNewAddress}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Save Address
                      </Button>
                      {addresses.length > 0 && (
                        <Button
                          variant="outline"
                          className="border-slate-300 text-slate-700 hover:bg-slate-50"
                          onClick={() => setUseNewAddress(false)}
                        >
                          Use Saved Address
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200/50">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-500 rounded-full p-2">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800">Order Summary</h2>
                    <p className="text-sm text-slate-600">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  {cart.map((item, index) => (
                    <div key={item._id} className={`flex items-start space-x-4 ${index !== cart.length - 1 ? 'pb-6 border-b border-slate-100' : ''}`}>
                      <div className="relative w-20 h-20 flex-shrink-0 bg-slate-100 rounded-xl overflow-hidden">
                        <Image
                          src={item.image || '/placeholder.svg'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-slate-800 mb-1">{item.name}</h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {item.color && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                              {item.color}
                            </span>
                          )}
                          {item.size && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                              Size {item.size}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-slate-800">
                            {item.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                          </span>
                          <span className="text-sm text-slate-600 bg-slate-50 px-3 py-1 rounded-full">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden sticky top-24">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200/50">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-500 rounded-full p-2">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800">Payment Summary</h2>
                    <p className="text-sm text-slate-600">Review your order details</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-semibold text-slate-800">
                      {subtotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Shipping</span>
                    <span className="font-semibold text-emerald-600">Free</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Tax</span>
                    <span className="font-semibold text-slate-800">Included</span>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-slate-800">Total</span>
                    <span className="text-2xl font-bold text-slate-900">
                      {total.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Including all applicable taxes</p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method</label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger className="h-12 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="razorpay">Pay with Razorpay</SelectItem>
                      <SelectItem value="cod">Cash on Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <PaymentButton
                  amount={total}
                  cart={cart}
                  shippingAddress={{
                    name: selectedAddress.name,
                    street: selectedAddress.street,
                    city: selectedAddress.city,
                    state: selectedAddress.state,
                    country: selectedAddress.country,
                    phone: selectedAddress.phone,
                    pincode: selectedAddress.pincode,
                  }}
                  paymentMethod={paymentMethod}
                />
                
                <div className="mt-4 text-center">
                  <p className="text-xs text-slate-500">
                    By proceeding, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}