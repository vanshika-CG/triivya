
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getLocalCart, setLocalCart, addToLocalCart, updateLocalCartItem, removeFromLocalCart } from '@/lib/localStorage';
import { toast } from 'react-toastify';

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

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const isAuthenticated = useAuth();

  useEffect(() => {
    const fetchCart = async () => {
      if (isAuthenticated) {
        const token = localStorage.getItem('token');
        try {
          const res = await fetch('https://triivya-clothing.onrender.com/api/cart', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (res.ok) {
            setCart(data.items || []);
          } else {
            toast.error(data.msg || 'Failed to fetch cart');
          }
        } catch (err) {
          toast.error('Something went wrong');
        }
      } else {
        setCart(getLocalCart());
      }
    };
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (item: CartItem) => {
    if (typeof window === 'undefined') {
      toast.error('Local storage is not available.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    if (isAuthenticated) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('https://triivya-clothing.onrender.com/api/cart', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            productId: item.productId, 
            quantity: item.quantity,
            color: item.color,
            size: item.size 
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setCart(data.items || []);
          toast.success(`${item.name} added to cart`);
        } else {
          toast.error('Failed to add to cart');
        }
      } catch (err) {
        toast.error('Something went wrong');
      }
    } else {
      addToLocalCart(item);
      setCart(getLocalCart());
      toast.success(`${item.name} added to cart`);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (isAuthenticated) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`https://triivya-clothing.onrender.com/api/cart/${itemId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity }),
        });
        if (res.ok) {
          setCart(cart.map((item) => (item._id === itemId ? { ...item, quantity } : item)));
          toast.success('Quantity updated');
        } else {
          toast.error('Failed to update quantity');
        }
      } catch (err) {
        toast.error('Something went wrong');
      }
    } else {
      updateLocalCartItem(itemId, quantity);
      setCart(getLocalCart());
      toast.success('Quantity updated');
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (isAuthenticated) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`https://triivya-clothing.onrender.com/api/cart/${itemId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          setCart(cart.filter((item) => item._id !== itemId));
          toast.success('Item removed from cart');
        } else {
          toast.error('Failed to remove item');
        }
      } catch (err) {
        toast.error('Something went wrong');
      }
    } else {
      removeFromLocalCart(itemId);
      setCart(getLocalCart());
      toast.success('Item removed from cart');
    }
  };

  return { cart, addToCart, updateQuantity, removeFromCart };
};
