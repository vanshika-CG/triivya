'use client';
import * as React from 'react';
import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingBag, User, Search, Heart, Menu, X, LogOut, Home, Store, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader, SheetDescription } from '@/components/ui/sheet';
import { AuthContext } from '../app/context/AuthContext';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export default React.memo(function Navbar() {
  const { isAuthenticated, setIsAuthenticated, isAdmin, setIsAdmin } = useContext(AuthContext);
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const lastScrollYRef = useRef(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounce function
  const debounce = (func: (...args: any[]) => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Handle scroll with debouncing for header visibility
  const handleScroll = useCallback(
    debounce(() => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);

      if (Math.abs(currentScrollY - lastScrollYRef.current) > 50) {
        if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
          setIsHeaderVisible(false);
        } else if (currentScrollY < lastScrollYRef.current) {
          setIsHeaderVisible(true);
        }
      }
      lastScrollYRef.current = currentScrollY;
    }, 100),
    []
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Handle click outside for dropdown
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  // Focus search input when search is opened
  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  // Memoized logout handler
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setIsAdmin(false);
    router.replace('/login');
  }, [router, setIsAuthenticated, setIsAdmin]);

  // Memoized toggle dropdown
  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const routes = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Shop' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/track-order', label: 'Track Order' },
  ];

  const bottomNavItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/products', label: 'Shop', icon: Store },
    { href: '/wishlist', label: 'Wishlist', icon: Heart },
    { href: '/cart', label: 'Cart', icon: ShoppingBag },
    { href: '/track-order', label: 'Track Order', icon: Package },
    { href: isAuthenticated ? '/profile' : '/login', label: 'Account', icon: User }, // Updated to dynamically set href
  ];

  return (
    <>
      <header
        className={cn(
          "sticky top-0 w-full transition-all duration-300 transform",
          isScrolled
            ? "border-b border-gray-200 bg-white/90 backdrop-blur-lg shadow-sm z-50"
            : "bg-white/80 backdrop-blur-md z-50",
          isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="container flex h-20 items-center justify-between px-4 md:px-6 mx-auto">
          {/* Left Section: Mobile Menu Toggle and Navigation */}
          <div className="flex items-center gap-6">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden hover:bg-gray-100 transition-colors"
                >
                  <Menu className="h-5 w-5 text-gray-700" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[280px] sm:w-[350px] border-r border-gray-200 flex flex-col"
              >
                <SheetHeader className="pb-4">
                  <div className="flex justify-between items-center pr-2">
                    <Link href="/" className="flex items-center" onClick={() => setIsSheetOpen(false)}>
                      <Image
                        src="/images/logo.webp"
                        alt="Triivya Logo"
                        width={120}
                        height={40}
                        className="object-contain"
                        style={{ filter: 'drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.1))' }}
                      />
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsSheetOpen(false)}
                      className="hover:bg-gray-100 transition-colors"
                    >
                      <X className="h-5 w-5 text-gray-700" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </div>
                  <VisuallyHidden>
                    <SheetTitle>Navigation Menu</SheetTitle>
                    <SheetDescription>Main navigation and account options.</SheetDescription>
                  </VisuallyHidden>
                </SheetHeader>

                <nav className="flex flex-col gap-8 flex-grow overflow-y-auto pr-2 pb-4">
                  <div className="flex flex-col space-y-1">
                    {routes.map((route) => (
                      <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                          'flex items-center px-2 py-3 text-base font-medium rounded-md transition-colors hover:bg-gray-100',
                          pathname === route.href
                            ? 'text-primary bg-gray-50 font-semibold'
                            : 'text-gray-700',
                        )}
                        onClick={() => setIsSheetOpen(false)}
                      >
                        {route.label}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 pt-4 pb-2">
                    <p className="px-2 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                      Account
                    </p>
                    <div className="flex flex-col space-y-1">
                      {isAuthenticated ? (
                        <>
                          <Link
                            href="/profile"
                            className="flex items-center gap-2 px-2 py-3 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                            onClick={() => setIsSheetOpen(false)}
                          >
                            <User className="h-5 w-5 text-gray-700" />
                            <span>Profile</span>
                          </Link>
                          <Link
                            href="/track-order"
                            className="flex items-center gap-2 px-2 py-3 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                            onClick={() => setIsSheetOpen(false)}
                          >
                            <Package className="h-5 w-5 text-gray-700" />
                            <span>Track Order</span>
                          </Link>
                          {isAdmin && (
                            <Link
                              href="/admin/dashboard"
                              className="flex items-center gap-2 px-2 py-3 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                              onClick={() => setIsSheetOpen(false)}
                            >
                              <User className="h-5 w-5 text-gray-700" />
                              <span>Admin Dashboard</span>
                            </Link>
                          )}
                          <button
                            onClick={() => {
                              handleLogout();
                              setIsSheetOpen(false);
                            }}
                            className="flex items-center gap-2 px-2 py-3 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors w-full text-left"
                          >
                            <LogOut className="h-5 w-5 text-gray-700" />
                            <span>Logout</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/login"
                            className="flex items-center gap-2 px-2 py-3 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                            onClick={() => setIsSheetOpen(false)}
                          >
                            <User className="h-4 w-4 text-gray-700" />
                            <span>Login</span>
                          </Link>
                          <Link
                            href="/register"
                            className="flex items-center gap-2 px-2 py-3 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                            onClick={() => setIsSheetOpen(false)}
                          >
                            <User className="h-4 w-4 text-gray-700" />
                            <span>Register</span>
                          </Link>
                        </>
                      )}
                      <Link
                        href="/wishlist"
                        className="flex items-center gap-2 px-2 py-3 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        <Heart className="h-5 w-5 text-gray-700" />
                        <span>Wishlist</span>
                      </Link>
                      <Link
                        href="/cart"
                        className="flex items-center gap-2 px-2 py-3 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        <ShoppingBag className="h-5 w-5 text-gray-700" />
                        <span>Cart</span>
                      </Link>
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
            <nav className="hidden lg:flex lg:gap-6">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    'relative text-sm font-medium transition-colors hover:text-primary py-1',
                    pathname === route.href
                      ? 'text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary after:content-[""]'
                      : 'text-gray-600',
                  )}
                >
                  {route.label}
                </Link>
              ))}
              {isAuthenticated && isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className={cn(
                    'relative text-sm font-medium transition-colors hover:text-primary py-1',
                    pathname === '/admin/dashboard'
                      ? 'text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary after:content-[""]'
                      : 'text-gray-600',
                  )}
                >
                  Admin Dashboard
                </Link>
              )}
            </nav>
          </div>

          {/* Center Section: Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
            <Link href="/" className="flex items-center" onClick={() => setIsSheetOpen(false)}>
              <Image
                src="/images/logo.webp"
                alt="Triivya Logo"
                width={140}
                height={48}
                className="object-contain hover:opacity-90 transition-opacity"
                style={{ filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1))' }}
              />
            </Link>
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            {isSearchOpen ? (
              <div className="relative flex items-center md:w-80">
                <Input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search for products..."
                  className="pr-8 border-gray-300 focus:border-primary focus:ring-primary transition-all"
                  autoFocus
                  onBlur={() => setIsSearchOpen(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      // Implement search logic here, e.g., router.push(`/search?q=${e.currentTarget.value}`);
                      setIsSearchOpen(false);
                      e.currentTarget.blur();
                    }
                  }}
                />
                <X
                  className="absolute right-2 h-5 w-5 cursor-pointer text-gray-700 hover:text-gray-900 transition-colors"
                  onClick={() => setIsSearchOpen(false)}
                />
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="rounded-full hover:bg-gray-100 transition-colors"
              >
                <Search className="h-5 w-5 text-gray-700" />
                <span className="sr-only">Search</span>
              </Button>
            )}
            <Link href="/wishlist" className="hidden md:block">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-gray-100 transition-colors relative"
              >
                <Heart className="h-5 w-5 text-gray-700 hover:text-primary transition-colors" />
                <span className="sr-only">Wishlist</span>
              </Button>
            </Link>
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2 relative" ref={dropdownRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-gray-100 transition-colors"
                  onClick={toggleDropdown}
                >
                  <User className="h-5 w-5 text-gray-700" />
                  <span className="sr-only">Profile</span>
                </Button>
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-10 origin-top-right animate-in fade-in-0 zoom-in-95">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/track-order"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Track Order
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-primary hover:bg-primary/90 transition-colors"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full hover:bg-gray-100 transition-colors"
              >
                <ShoppingBag className="h-5 w-5 text-gray-700 hover:text-primary transition-colors" />
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Bottom Navbar for Mobile */}
      <nav
        className={cn(
          'lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg z-[60] h-16'
        )}
      >
        <div className="flex justify-around items-center h-full px-4">
          {bottomNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center space-y-1 p-2 w-16 rounded-lg transition-all duration-200 relative',
                pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                  ? 'text-primary bg-gray-50'
                  : 'text-gray-600 hover:text-primary hover:bg-gray-50'
              )}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
      `}</style>
    </>
  );
});