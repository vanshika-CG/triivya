'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { useRazorpay } from 'react-razorpay';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';

interface PaymentButtonProps {
  amount: number;
  cart: Array<{
    _id: string;
    product: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    color?: string;
    size?: string;
  }>;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    pincode?: string;
  };
  paymentMethod: string;
}

export default function PaymentButton({ amount, cart, shippingAddress, paymentMethod }: PaymentButtonProps) {
  const { Razorpay } = useRazorpay();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const checkServiceability = async () => {
    try {
      const response = await api.post('/shiprocket/check-serviceability', {
        pickupPincode: '400001',
        deliveryPincode: shippingAddress.pincode,
        weight: 0.5,
        cod: paymentMethod === 'cod' ? 1 : 0,
      });
      console.log('Serviceability response:', response.data);
      if (response.data.data.available_courier_companies.length === 0) {
        toast.error('COD is not available for this pincode');
        return false;
      }
      return true;
    } catch (err: any) {
      console.error('Serviceability check error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      toast.error(err.response?.data?.msg || 'Failed to check serviceability');
      return false;
    }
  };

  const handlePayment = async () => {
    console.log('Place Order clicked at', new Date().toISOString(), { isAuthenticated, user, amount, cart, shippingAddress, paymentMethod });
    if (!isAuthenticated) {
      toast.error('Please log in to proceed with order');
      router.push('/login?redirect=/checkout');
      return;
    }

    if (
      !shippingAddress.name ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.country ||
      !shippingAddress.phone ||
      !shippingAddress.pincode
    ) {
      toast.error('Please fill in all address fields, including pincode');
      return;
    }

    if (!cart.length) {
      toast.error('Your cart is empty');
      return;
    }

    if (paymentMethod === 'cod') {
      const isServiceable = await checkServiceability();
      if (!isServiceable) {
        return;
      }
    }

    setLoading(true);

    if (paymentMethod === 'razorpay') {
      try {
        const requestBody = {
          amount,
          cartItems: cart.map((item) => ({
            product: item.product,
            quantity: item.quantity,
            price: item.price,
            color: item.color,
            size: item.size,
            name: item.name,
          })),
          shippingAddress: {
            ...shippingAddress,
            locationId: 'PRIMARY',
          },
        };
        console.log('Sending request to /razorpay/create-order with body:', JSON.stringify(requestBody, null, 2));
        const orderResponse = await api.post('/razorpay/create-order', requestBody);
        console.log('Order response:', orderResponse.data);
        const { id: razorpayOrderId, orderId } = orderResponse.data;

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOdBaQ9YJ',
          amount: amount * 100,
          currency: 'INR',
          name: 'Triivya Clothing',
          description: 'Purchase of clothing items',
          order_id: razorpayOrderId,
          handler: async (response: any) => {
            try {
              console.log('Verifying payment:', response);
              const verifyResponse = await api.post('/razorpay/verify-payment', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId,
              });
              console.log('Verification response:', verifyResponse.data);
              if (verifyResponse.data.status !== 'success') {
                throw new Error('Payment verification failed');
              }

              toast.success('Payment successful! Order placed.');
              router.push(`/order-confirmation?orderId=${orderId}`);
            } catch (err: any) {
              console.error('Payment verification error:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
              });
              toast.error(err.response?.data?.message || 'Failed to complete payment');
            }
          },
          prefill: {
            name: shippingAddress.name,
            email: user?.email || '',
            contact: shippingAddress.phone,
          },
          theme: {
            color: '#8C4D64',
          },
        };

        console.log('Opening Razorpay modal with options:', options);
        if (!options.key) {
          console.error('Razorpay key ID is missing');
          toast.error('Payment configuration error. Please contact support.');
          return;
        }

        const rzp = new Razorpay(options);
        rzp.on('payment.failed', (response: any) => {
          console.error('Payment failed:', response.error);
          toast.error(`Payment failed: ${response.error.description}`);
        });
        rzp.open();
      } catch (err: any) {
        console.error('Create order error:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        toast.error(err.response?.data?.message || 'Failed to initiate payment');
      } finally {
        setLoading(false);
      }
    } else if (paymentMethod === 'cod') {
      const requestBody = {
        amount,
        cartItems: cart.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          color: item.color,
          size: item.size,
          name: item.name,
        })),
        shippingAddress: {
          ...shippingAddress,
          locationId: 'PRIMARY',
        },
        paymentMethod: 'COD',
      };
      try {
        console.log('Sending request to /orders/create-cod with body:', JSON.stringify(requestBody, null, 2));
        const orderResponse = await api.post('/orders/create-cod', requestBody);
        console.log('COD Order response:', orderResponse.data);
        toast.success('COD order placed successfully!');
        router.push(`/order-confirmation?orderId=${orderResponse.data.orderId}`);
      } catch (err: any) {
        console.error('COD order error:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          requestBody: JSON.stringify(requestBody, null, 2),
        });
        toast.error(err.response?.data?.message || 'Failed to place COD order');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-[rgb(140,77,100)] text-white py-3 text-base hover:bg-[rgb(140,77,100)]/90"
    >
      <CreditCard className="w-5 h-5 mr-2" />
      {loading ? 'Processing...' : paymentMethod === 'cod' ? 'Place COD Order' : 'Pay Now'}
    </Button>
  );
}