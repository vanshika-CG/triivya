'use client';
import { useState, useEffect, Suspense } from 'react'; // Add Suspense import
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Order {
  _id: string;
  orderId: string;
  date: string;
  status: string;
  total: number;
}

interface Address {
  _id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

interface User {
  name: string;
  email: string;
  phone?: string;
}

// Child component to handle useSearchParams
function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'orders';
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch user
        const userRes = await fetch('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        if (!userRes.ok) throw new Error(userData.msg || 'Failed to fetch user');
        setUser(userData);

        // Fetch orders
        const ordersRes = await fetch('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ordersData = await ordersRes.json();
        if (ordersRes.ok) setOrders(ordersData);

        // Fetch addresses
        const addressesRes = await fetch('http://localhost:5000/api/addresses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const addressesData = await addressesRes.json();
        if (addressesRes.ok) setAddresses(addressesData);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      }
    };
    fetchData();
  }, [router]);

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedUser = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
    };
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/me', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        alert('Profile updated successfully');
      } else {
        setError(data.msg || 'Failed to update profile');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const passwordData = {
      currentPassword: formData.get('current-password'),
      newPassword: formData.get('new-password'),
      confirmPassword: formData.get('confirm-password'),
    };
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/password', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Password updated successfully');
      } else {
        setError(data.msg || 'Failed to update password');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900">My Account</h1>
      {error && <p className="text-red-500">{error}</p>}
      <Tabs defaultValue={defaultTab} className="space-y-8">
        <TabsList className="w-full justify-start border-b p-0">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          <div className="rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50 text-sm">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-900">Order ID</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-900">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-900">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-900">Total</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{order.orderId}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">
                      {order.total.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Button variant="link" className="h-auto p-0 text-primary">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <form onSubmit={handleProfileUpdate} className="rounded-lg border border-gray-200 p-6">
            <h2 className="mb-4 text-lg font-medium text-gray-900">Personal Information</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={user?.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" defaultValue={user?.email} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" defaultValue={user?.phone || ''} />
              </div>
            </div>
            <Button type="submit" className="mt-6 bg-blue-600 text-white/underlined hover:bg-blue-700">
              Save Changes
            </Button>
          </form>

          <form onSubmit={handlePasswordUpdate} className="rounded-lg border border-gray-200 p-6">
            <h2 className="mb-4 text-lg font-medium text-gray-900">Change Password</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" name="current-password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" name="new-password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" name="confirm-password" type="password" required />
              </div>
            </div>
            <Button type="submit" className="mt-6 bg-blue-600 text-white hover:bg-blue-700">
              Update Password
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="addresses" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {addresses.map((address) => (
              <div key={address._id} className="rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{address.name}</h3>
                  {address.isDefault && (
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      Default
                    </span>
                  )}
                </div>
                <div className="mt-4 space-y-1 text-sm text-gray-600">
                  <p>{address.street}</p>
                  <p>{`${address.city}, ${address.state}`}</p>
                  <p>{address.country}</p>
                  <p>Phone: {address.phone}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700">
                    Delete
                  </Button>
                  {!address.isDefault && (
                    <Button variant="outline" size="sm">
                      Set as Default
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-6 text-center">
              <h3 className="mt-4 font-medium text-gray-900">Add New Address</h3>
              <Button className="mt-4 bg-blue-600 text-white hover:bg-blue-700">Add Address</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="wishlist">
          <p>Redirect to <a href="/wishlist" className="text-blue-600">Wishlist Page</a></p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Wrap AccountContent with Suspense in the default export
export default function AccountPage() {
  return (
    <Suspense fallback={<div>Loading account...</div>}>
      <AccountContent />
    </Suspense>
  );
}