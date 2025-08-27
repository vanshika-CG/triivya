'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, Package, Truck } from 'lucide-react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import api from '@/lib/api';

interface Order {
  _id: string;
  orderId: string;
  items: Array<{
    _id?: string;
    product: string | null;
    quantity: number;
    price?: number;
    color?: string;
    size?: string;
    name?: string;
    images?: string[];
  }>;
  total: number;
  shippingCost: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    pincode?: string;
  };
  paymentDetails: {
    status: string;
    razorpay_payment_id?: string;
    razorpay_order_id?: string;
  };
  shiprocketDetails?: {
    orderId: string;
    shipmentId: string;
    status: string;
    trackingUrl: string;
  };
  status: string;
}

function OrderConfirmationContent() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!orderId) {
      toast.error('Invalid order ID');
      router.push('/cart');
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        console.log('Fetching order:', orderId);
        const response = await api.get(`/orders/${orderId}`);
        console.log('Order data:', JSON.stringify(response.data, null, 2));
        response.data.items.forEach((item, index) => {
          console.log(`Item ${index}:`, { price: item.price, quantity: item.quantity, name: item.name });
        });
        setOrder(response.data);
      } catch (err: any) {
        console.error('Fetch order error:', err.response?.data || err.message);
        toast.error(err.response?.data?.msg || 'Failed to load order');
        router.push('/cart');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'rgb(140,77,100)' }}>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
          <p className="text-white font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const calculatedTotal = order.items.reduce((sum, item) => {
    const price = item.price ?? 0;
    const quantity = item.quantity ?? 0;
    return sum + (price * quantity);
  }, 0) + (order.shippingCost || 0);

  console.log('Calculated Total:', calculatedTotal, 'Shipping Cost:', order.shippingCost, 'Items:', order.items);

  const displayTotal = isNaN(calculatedTotal) || calculatedTotal === 0 ? order.total || 0 : calculatedTotal;
  const displaySubtotal = isNaN(calculatedTotal) || calculatedTotal === 0 ? (order.total || 0) - (order.shippingCost || 0) : calculatedTotal - (order.shippingCost || 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(140,77,100)' }}>
      <div className="bg-white/95 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">Order Confirmation</h1>
              <nav className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
                <Home className="w-4 h-4" />
                <Package className="w-4 h-4" />
                <span className="text-gray-800 font-medium">Order Confirmation</span>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/95 rounded-lg shadow-lg border border-white/20 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Order #{order.orderId}</h2>
          <p className="text-green-600 font-medium">Thank you for your order!</p>
          <p className="text-sm text-gray-600 mt-2">
            Payment Status: {order.paymentDetails.status === 'COD' ? 'Cash on Delivery' : order.paymentDetails.status}
          </p>
          {order.paymentDetails.status !== 'COD' && (
            <p className="text-sm text-gray-600">Payment ID: {order.paymentDetails.razorpay_payment_id || 'N/A'}</p>
          )}

          {order.shiprocketDetails && (
            <div className="mt-4">
              <h3 className="text-base font-semibold text-gray-800 flex items-center">
                <Truck className="w-5 h-5 mr-2" /> Shipping Status
              </h3>
              <p className="text-sm text-gray-600">
                Shiprocket Order ID: {order.shiprocketDetails.orderId || 'N/A'}<br />
                Status: {order.shiprocketDetails.status || 'Pending'}<br />
                {order.shiprocketDetails.trackingUrl ? (
                  <a
                    href={order.shiprocketDetails.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Track Your Order
                  </a>
                ) : (
                  'Tracking not available'
                )}
              </p>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-base font-semibold text-gray-800">Shipping Address</h3>
            <p className="text-sm text-gray-600">
              {order.shippingAddress.name}<br />
              {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.pincode}<br />
              {order.shippingAddress.country}, {order.shippingAddress.phone}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-base font-semibold text-gray-800">Order Items</h3>
            <div className="divide-y divide-gray-200">
              {order.items.map((item, index) => {
                const productId = item._id || `fallback-${index}`;
                return (
                  <div key={`${productId}-${item.quantity}`} className="py-4 flex items-start space-x-4">
                    <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={item.images && item.images.length > 0 ? item.images[0] : '/placeholder.svg'}
                        alt={item.name || 'Unknown Product'}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-medium text-gray-800">{item.name || 'Unknown Product'}</h4>
                      <p className="text-sm text-gray-600">
                        {item.color && `Color: ${item.color}, `} {item.size && `Size: ${item.size}`}
                      </p>
                      <p className="text-lg font-semibold text-gray-800">
                        {(item.price ?? 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                      </p>
                      <p className="text-md text-gray-600">Quantity: {item.quantity ?? 0}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-base font-semibold text-gray-800">Order Summary</h3>
            <div className="space-y-2 mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">
                  {displaySubtotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">
                  {order.shippingCost === 0 ? 'Free' : order.shippingCost.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">
                  {displayTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={() => router.push('/products')}
              className="w-full bg-[rgb(140,77,100)] text-white py-3 text-base hover:bg-[rgb(140,77,100)]/90"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmation() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}