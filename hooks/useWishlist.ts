'use client';
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getLocalWishlist, addToLocalWishlist, removeFromLocalWishlist } from '@/lib/localStorage';
import { toast } from 'react-toastify';

interface WishlistItem {
  _id: string;
  product: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (isAuthenticated) {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAuthenticated(false);
          setWishlist(getLocalWishlist());
          return;
        }
        try {
          const res = await fetch('https://triivya-clothing.onrender.com/api/wishlist', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (res.ok) {
            setWishlist(data || []);
          } else {
            console.error('API error:', data);
            toast.error(data.msg || 'Failed to fetch wishlist', { position: 'top-right', autoClose: 3000 });
          }
        } catch (err) {
          console.error('Error fetching wishlist:', err);
          toast.error('Something went wrong', { position: 'top-right', autoClose: 3000 });
        }
      } else {
        setWishlist(getLocalWishlist());
      }
    };
    fetchWishlist();
  }, [isAuthenticated, setIsAuthenticated]);

  const addToWishlist = async (item: WishlistItem) => {
    if (typeof window === 'undefined') {
      toast.error('Local storage is not available.', { position: 'top-right', autoClose: 3000 });
      return;
    }
    if (isAuthenticated) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        const res = await fetch('https://triivya-clothing.onrender.com/api/wishlist', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId: item.product }),
        });
        const data = await res.json();
        if (res.ok) {
          setWishlist(data || []);
          toast.success(`${item.name} added to wishlist`, { position: 'top-right', autoClose: 3000 });
        } else {
          console.error('API error:', data);
          toast.error(data.msg || 'Failed to add to wishlist', { position: 'top-right', autoClose: 3000 });
        }
      } catch (err: any) {
        console.error('Error adding to wishlist:', err);
        if (err.message.includes('No authentication token found')) {
          addToLocalWishlist(item);
          setWishlist(getLocalWishlist());
          toast.success(`${item.name} added to wishlist`, { position: 'top-right', autoClose: 3000 });
        } else {
          toast.error('Failed to add to wishlist', { position: 'top-right', autoClose: 3000 });
        }
      }
    } else {
      addToLocalWishlist(item);
      setWishlist(getLocalWishlist());
      toast.success(`${item.name} added to wishlist`, { position: 'top-right', autoClose: 3000 });
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (isAuthenticated) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        const res = await fetch(`https://triivya-clothing.onrender.com/api/wishlist/${productId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setWishlist(data || []); // Update state with API response
          toast.success('Item removed from wishlist', { position: 'top-right', autoClose: 3000 });
        } else {
          console.error('API error:', data);
          toast.error(data.msg || 'Failed to remove item from wishlist', { position: 'top-right', autoClose: 3000 });
        }
      } catch (err: any) {
        console.error('Error removing from wishlist:', err);
        if (err.message.includes('No authentication token found')) {
          removeFromLocalWishlist(productId);
          setWishlist(getLocalWishlist());
          toast.success('Item removed from wishlist', { position: 'top-right', autoClose: 3000 });
        } else {
          toast.error('Failed to remove item from wishlist', { position: 'top-right', autoClose: 3000 });
        }
      }
    } else {
      removeFromLocalWishlist(productId);
      setWishlist(getLocalWishlist());
      toast.success('Item removed from wishlist', { position: 'top-right', autoClose: 3000 });
    }
  };

  return { wishlist, addToWishlist, removeFromWishlist };
};