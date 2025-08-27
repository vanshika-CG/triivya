// protectedlayout.tsx
'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/api';
import { useLoading } from '@/lib/LoadingContext';
import { toast } from 'react-toastify';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { setLoading } = useLoading();

  const protectedRoutes = ['/profile', '/account', '/checkout', '/track-order']; // Added /track-order
  const adminRoutes = ['/admin/dashboard'];
  const publicRoutes = [
    '/',
    '/products',
    '/products/[id]',
    '/login',
    '/register',
    '/admin/login',
    '/cart',
    '/wishlist',
    '/privacy-policy',
    '/return-refund-policy',
    '/terms-conditions',
    '/faq'
  ];

  useEffect(() => {
    const checkAuth = async () => {
      // Skip authentication checks for public routes
      if (publicRoutes.includes(pathname) || pathname.startsWith('/products/')) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const token = localStorage.getItem('token');
      const isProtectedRoute = protectedRoutes.includes(pathname);
      const isAdminRoute = adminRoutes.includes(pathname) || pathname.startsWith('/admin/');

      if (isProtectedRoute && !token) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        setLoading(false);
        return;
      }

      if (isAdminRoute) {
        if (!token) {
          toast.error('Admin access required');
          router.push('/admin/login');
          setLoading(false);
          return;
        }
        try {
          const res = await api.get('/auth/me');
          if (!res.data.isAdmin) {
            toast.error('Admin access required');
            router.push('/admin/login');
          }
        } catch (err) {
          toast.error('Authentication failed. Please log in again.');
          localStorage.removeItem('token');
          router.push('/admin/login');
          setLoading(false);
          return;
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [router, pathname, setLoading]);

  return <>{children}</>;
}