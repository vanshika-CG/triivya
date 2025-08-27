'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/api';

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface Address {
  _id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  phone: string;
  country: string;
  isDefault: boolean;
}

interface Order {
  _id: string;
  orderId: string;
  items: Array<{
    product: string | null;
    name: string;
    quantity: number;
    price: number;
    images?: string[];
    color?: string;
    size?: string;
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
  createdAt: string;
}

interface WishlistItem {
  product: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [addressModal, setAddressModal] = useState(false);
  const [editAddressId, setEditAddressId] = useState<string | null>(null);
  const [cancelConfirm, setCancelConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [newAddress, setNewAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    phone: '',
    country: '',
    isDefault: false,
  });
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [orderFilter, setOrderFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        setLoadingUser(true);
        const userRes = await axios.get('/auth/me');
        const userData = userRes.data;
        setUser(userData);
        setFormData({ name: userData.name, email: userData.email });

        setLoadingOrders(true);
        const ordersRes = await axios.get('/orders');
        setOrders(ordersRes.data);
        setFilteredOrders(ordersRes.data);

        setLoadingAddresses(true);
        const addressesRes = await axios.get('/addresses');
        setAddresses(addressesRes.data);

        setLoadingWishlist(true);
        const wishlistRes = await axios.get('/wishlist');
        setWishlist(wishlistRes.data);
      } catch (err: any) {
        setError(err.response?.data?.msg || 'Something went wrong');
      } finally {
        setLoadingUser(false);
        setLoadingOrders(false);
        setLoadingAddresses(false);
        setLoadingWishlist(false);
      }
    };
    fetchUserData();
  }, [router]);

  useEffect(() => {
    if (orderFilter === 'All') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === orderFilter));
    }
    setCurrentPage(1);
  }, [orderFilter, orders]);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\+?\d{10,15}$/.test(phone);
  const validateAddress = (address: Address) =>
    address.name.trim() &&
    address.street.trim() &&
    address.city.trim() &&
    address.state.trim() &&
    address.phone.trim() &&
    validatePhone(address.phone) &&
    address.country.trim();

  const handleEditProfile = async () => {
    if (!validateEmail(formData.email)) {
      setError('Invalid email address');
      return;
    }
    try {
      const res = await axios.put('/auth/me', formData);
      setUser({ ...user!, ...res.data });
      setEditMode(false);
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }
    try {
      const res = await axios.put('/auth/change-password', passwordData);
      setPasswordMode(false);
      setPasswordData({ currentPassword: '', newPassword: '' });
      setSuccess('Password changed successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to change password');
    }
  };

  const handleAddOrEditAddress = async () => {
    if (!validateAddress(newAddress)) {
      setError('All address fields are required and phone must be valid');
      return;
    }
    try {
      const url = editAddressId ? `/addresses/${editAddressId}` : '/addresses';
      const method = editAddressId ? 'put' : 'post';
      const res = await axios[method](url, newAddress);
      if (editAddressId) {
        setAddresses(addresses.map((addr) => (addr._id === editAddressId ? res.data : addr)));
        setEditAddressId(null);
      } else {
        setAddresses([...addresses, res.data]);
      }
      setNewAddress({
        name: '',
        street: '',
        city: '',
        state: '',
        phone: '',
        country: '',
        isDefault: false,
      });
      setAddressModal(false);
      setSuccess(editAddressId ? 'Address updated successfully' : 'Address added successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.msg || `Failed to ${editAddressId ? 'update' : 'add'} address`);
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditAddressId(address._id);
    setNewAddress(address);
    setAddressModal(true);
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await axios.delete(`/addresses/${id}`);
      setAddresses(addresses.filter((addr) => addr._id !== id));
      setSuccess('Address deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to delete address');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await axios.put(`/orders/${orderId}/cancel`);
      setOrders(orders.map((order) => (order._id === orderId ? { ...order, status: 'Cancelled' } : order)));
      setFilteredOrders(filteredOrders.map((order) => (order._id === orderId ? { ...order, status: 'Cancelled' } : order)));
      setSuccess('Order cancelled successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to cancel order');
    } finally {
      setCancelConfirm(null);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await axios.delete(`/wishlist/${productId}`);
      setWishlist(wishlist.filter((item) => item.product !== productId));
      setSuccess('Item removed from wishlist');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to remove from wishlist');
    }
  };

  const handleFilterChange = (status: string) => {
    setOrderFilter(status);
  };

  const statusColors: { [key: string]: string } = {
    Processing: 'bg-yellow-600',
    confirmed: 'bg-blue-600',
    Delivered: 'bg-green-600',
    Cancelled: 'bg-red-600',
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  if (loadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
        <div className="text-lg sm:text-xl font-medium text-gray-700 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6" style={{ fontFamily: 'serif' }}>
            Your Profile
          </h1>
        </div>
      </div>

      {/* Toast Notifications */}
      {error && (
        <div className="fixed top-4 sm:top-6 right-4 sm:right-6 bg-red-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-lg sm:shadow-2xl flex items-center transition-all duration-300 z-50 border border-red-500">
          <span className="text-sm sm:text-base font-medium">{error}</span>
          <button className="ml-3 sm:ml-4 text-white font-bold text-lg sm:text-xl hover:text-red-200" onClick={() => setError('')}>
            ×
          </button>
        </div>
      )}
      {success && (
        <div className="fixed top-4 sm:top-6 right-4 sm:right-6 bg-green-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-lg sm:shadow-2xl flex items-center transition-all duration-300 z-50 border border-green-500">
          <span className="text-sm sm:text-base font-medium">{success}</span>
          <button className="ml-3 sm:ml-4 text-white font-bold text-lg sm:text-xl hover:text-green-200" onClick={() => setSuccess('')}>
            ×
          </button>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 sm:bg-opacity-60 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 sm:p-8 rounded-lg sm:rounded-2xl shadow-lg sm:shadow-2xl max-w-md w-full mx-4 border border-gray-200">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6" style={{ fontFamily: 'serif' }}>
              Confirm Cancellation
            </h3>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">Are you sure you want to cancel this order?</p>
            <div className="flex justify-end space-x-3 sm:space-x-4">
              <button
                onClick={() => handleCancelOrder(cancelConfirm)}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg sm:rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold text-sm sm:text-base"
              >
                Yes, Cancel
              </button>
              <button
                onClick={() => setCancelConfirm(null)}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 text-gray-800 rounded-lg sm:rounded-xl hover:bg-gray-200 transition-colors duration-200 font-semibold text-sm sm:text-base"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address Modal */}
      {addressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 sm:bg-opacity-60 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 sm:p-8 rounded-lg sm:rounded-2xl shadow-lg sm:shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8" style={{ fontFamily: 'serif' }}>
              {editAddressId ? 'Edit Address' : 'Add New Address'}
            </h3>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Name</label>
                <input
                  type="text"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Street</label>
                <input
                  type="text"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">City</label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">State</label>
                  <input
                    type="text"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent-adaptive transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Phone</label>
                <input
                  type="text"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Country</label>
                <input
                  type="text"
                  value={newAddress.country}
                  onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="flex items-center space-x-2 sm:space-x-3">
                  <input
                    type="checkbox"
                    checked={newAddress.isDefault}
                    onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                    className="rounded border-gray-300 focus:ring-purple-500 w-4 sm:w-5 h-4 sm:h-5"
                  />
                  <span className="text-sm font-semibold text-gray-700">Set as Default Address</span>
                </label>
              </div>
              <div className="flex justify-end space-x-3 sm:space-x-4 pt-3 sm:pt-4">
                <button
                  onClick={handleAddOrEditAddress}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-semibold text-sm sm:text-base"
                >
                  {editAddressId ? 'Update Address' : 'Add Address'}
                </button>
                <button
                  onClick={() => {
                    setAddressModal(false);
                    setEditAddressId(null);
                    setNewAddress({
                      name: '',
                      street: '',
                      city: '',
                      state: '',
                      phone: '',
                      country: '',
                      isDefault: false,
                    });
                  }}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 text-gray-800 rounded-lg sm:rounded-xl hover:bg-gray-200 transition-colors duration-200 font-semibold text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        {/* Profile Section */}
        <div className="bg-white p-6 sm:p-8 rounded-lg sm:rounded-2xl shadow-md sm:shadow-xl mb-6 sm:mb-10 border border-gray-200">
          <div className="flex items-center mb-6 sm:mb-8">
            <div className="w-3 sm:w-4 h-6 sm:h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full mr-3 sm:mr-4"></div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800" style={{ fontFamily: 'serif' }}>
              Personal Information
            </h2>
          </div>
          {editMode ? (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 sm:space-x-4 pt-3 sm:pt-4">
                <button
                  onClick={handleEditProfile}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-semibold text-sm sm:text-base"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 text-gray-800 rounded-lg sm:rounded-xl hover:bg-gray-200 transition-colors duration-200 font-semibold text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : passwordMode ? (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 sm:space-x-4 pt-3 sm:pt-4">
                <button
                  onClick={handleChangePassword}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-semibold text-sm sm:text-base"
                >
                  Change Password
                </button>
                <button
                  onClick={() => {
                    setPasswordMode(false);
                    setPasswordData({ currentPassword: '', newPassword: '' });
                  }}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 text-gray-800 rounded-lg sm:rounded-xl hover:bg-gray-200 transition-colors duration-200 font-semibold text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-purple-100">
                  <p className="text-xs sm:text-sm font-semibold text-purple-600 mb-1">Name</p>
                  <p className="text-base sm:text-lg font-bold text-gray-800">{user.name}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-blue-100">
                  <p className="text-xs sm:text-sm font-semibold text-blue-600 mb-1">Email</p>
                  <p className="text-base sm:text-lg font-bold text-gray-800">{user.email}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-green-100">
                  <p className="text-xs sm:text-sm font-semibold text-green-600 mb-1">Role</p>
                  <p className="text-base sm:text-lg font-bold text-gray-800">{user.isAdmin ? 'Admin' : 'User'}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-3 sm:space-x-4 pt-3 sm:pt-4">
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-semibold text-sm sm:text-base"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setPasswordMode(true)}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold text-sm sm:text-base"
                >
                  Change Password
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order History Section */}
        <div className="bg-white p-6 sm:p-8 rounded-lg sm:rounded-2xl shadow-md sm:shadow-xl mb-6 sm:mb-10 border border-gray-200">
          <div className="flex items-center mb-6 sm:mb-8">
            <div className="w-3 sm:w-4 h-6 sm:h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full mr-3 sm:mr-4"></div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800" style={{ fontFamily: 'serif' }}>
              Order History
            </h2>
          </div>
          <div className="mb-6 sm:mb-8 flex flex-wrap gap-2 sm:gap-3">
            {['All', 'Processing', 'confirmed', 'Delivered', 'Cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => handleFilterChange(status)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 ${
                  orderFilter === status
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          {loadingOrders ? (
            <div className="text-center text-gray-600 animate-pulse text-base sm:text-lg font-medium">
              Loading orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <p className="text-gray-600 text-base sm:text-lg text-center">No orders found.</p>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {currentOrders.map((order) => (
                <div
                  key={order._id}
                  className="border border-gray-200 p-4 sm:p-6 rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-50 to-white hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 sm:space-x-6">
                    {order.items.length > 0 && (
                      <div className="relative flex-shrink-0">
                        <img
                          src={
                            order.items[0].images && order.items[0].images.length > 0
                              ? order.items[0].images[0]
                              : '/placeholder.svg'
                          }
                          alt={order.items[0].name || 'Unknown Product'}
                          className="w-16 sm:w-20 h-16 sm:h-20 object-cover rounded-lg sm:rounded-xl border border-gray-200"
                        />
                        {order.items.length > 1 && (
                          <span
                            className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full w-5 sm:w-6 h-5 sm:h-6 flex items-center justify-center shadow"
                            title={`${order.items.length} items`}
                          >
                            +{order.items.length - 1}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <p className="text-gray-700 text-sm sm:text-base">
                          <strong className="font-semibold">Order ID:</strong> {order.orderId}
                        </p>
                        <span
                          className={`px-3 sm:px-4 py-1 rounded-full text-white text-xs sm:text-sm font-medium mt-2 sm:mt-0 ${statusColors[order.status] || 'bg-gray-500'}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm sm:text-base">
                        <strong className="font-semibold">Product:</strong>{' '}
                        {order.items[0]?.name || 'Unknown Product'}
                        {order.items.length > 1 && (
                          <span className="text-gray-500"> (+{order.items.length - 1} more)</span>
                        )}
                      </p>
                      <p className="text-gray-700 text-sm sm:text-base">
                        <strong className="font-semibold">Date:</strong>{' '}
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-gray-700 text-sm sm:text-base">
                        <strong className="font-semibold">Total:</strong>{' '}
                        {(order.total || 0).toLocaleString('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                        })}
                      </p>
                      {order.shippingCost > 0 && (
                        <p className="text-gray-700 text-sm sm:text-base">
                          <strong className="font-semibold">Shipping Cost:</strong>{' '}
                          {order.shippingCost.toLocaleString('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                          })}
                        </p>
                      )}
                      <p className="text-gray-700 text-sm sm:text-base">
                        <strong className="font-semibold">Payment:</strong>{' '}
                        {order.paymentDetails.status === 'COD'
                          ? 'Cash on Delivery'
                          : order.paymentDetails.status}
                      </p>
                      {order.shiprocketDetails?.trackingUrl && (
                        <p className="text-gray-700 text-sm sm:text-base">
                          <strong className="font-semibold">Tracking:</strong>{' '}
                          <a
                            href={order.shiprocketDetails.trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-800 underline"
                          >
                            Track Order
                          </a>
                        </p>
                      )}
                      <div className="flex space-x-3 sm:space-x-4 mt-3 sm:mt-4">
                        <button
                          onClick={() => router.push(`/order-confirmation?orderId=${order.orderId}`)}
                          className="text-purple-600 hover:text-purple-800 font-semibold text-sm sm:text-base"
                        >
                          View Details
                        </button>
                        {order.status === 'Processing' && (
                          <button
                            onClick={() => setCancelConfirm(order._id)}
                            className="text-red-600 hover:text-red-800 font-semibold text-sm sm:text-base"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-center space-x-2 mt-6 sm:mt-8">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Address Management Section */}
        <div className="bg-white p-6 sm:p-8 rounded-lg sm:rounded-2xl shadow-md sm:shadow-xl mb-6 sm:mb-10 border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="w-3 sm:w-4 h-6 sm:h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full mr-3 sm:mr-4"></div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800" style={{ fontFamily: 'serif' }}>
                Saved Addresses
              </h2>
            </div>
            <button
              onClick={() => setAddressModal(true)}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-semibold text-sm sm:text-base"
            >
              Add New Address
            </button>
          </div>
          {loadingAddresses ? (
            <div className="text-center text-gray-600 animate-pulse text-base sm:text-lg font-medium">
              Loading addresses...
            </div>
          ) : addresses.length === 0 ? (
            <p className="text-gray-600 text-base sm:text-lg text-center">No addresses saved.</p>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
              {addresses.map((address) => (
                <div
                  key={address._id}
                  className="border border-gray-200 p-4 sm:p-6 rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-50 to-white hover:shadow-lg transition-all duration-200"
                >
                  <p className="text-gray-700 text-sm sm:text-base">
                    <strong className="font-semibold">{address.name}</strong>
                    {address.isDefault && (
                      <span className="ml-2 inline-block bg-green-100 text-green-600 text-xs font-semibold px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </p>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">{address.street}</p>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {address.city}, {address.state}, {address.country}
                  </p>
                  <p className="text-gray-600 text-sm sm:text-base">
                    <strong className="font-semibold">Phone:</strong> {address.phone}
                  </p>
                  <div className="flex space-x-3 sm:space-x-4 mt-3 sm:mt-4">
                    <button
                      onClick={() => handleEditAddress(address)}
                      className="text-purple-600 hover:text-purple-800 font-semibold text-sm sm:text-base"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address._id)}
                      className="text-red-600 hover:text-red-800 font-semibold text-sm sm:text-base"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Wishlist Section */}
        <div className="bg-white p-6 sm:p-8 rounded-lg sm:rounded-2xl shadow-md sm:shadow-xl mb-6 sm:mb-10 border border-gray-200">
          <div className="flex items-center mb-6 sm:mb-8">
            <div className="w-3 sm:w-4 h-6 sm:h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full mr-3 sm:mr-4"></div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800" style={{ fontFamily: 'serif' }}>
              Wishlist
            </h2>
          </div>
          {loadingWishlist ? (
            <div className="text-center text-gray-600 animate-pulse text-base sm:text-lg font-medium">
              Loading wishlist...
            </div>
          ) : wishlist.length === 0 ? (
            <p className="text-gray-600 text-base sm:text-lg text-center">Your wishlist is empty.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {wishlist.map((item) => (
                <div
                  key={item.product}
                  className="border border-gray-200 p-4 sm:p-6 rounded-lg sm:rounded-xl flex flex-col sm:flex-row items-start sm:items-center bg-gradient-to-br from-gray-50 to-white hover:shadow-lg transition-all duration-200"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 sm:w-20 h-16 sm:h-20 object-cover rounded-lg sm:rounded-xl mr-0 sm:mr-4 mb-3 sm:mb-0 border border-gray-200"
                  />
                  <div className="flex-1">
                    <p className="text-base sm:text-lg font-semibold text-gray-800">{item.name}</p>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {item.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    </p>
                    <p className="text-gray-600 text-sm sm:text-base">{item.category}</p>
                  </div>
                  <button
                    className="text-red-600 hover:text-red-800 font-semibold text-sm sm:text-base mt-3 sm:mt-0"
                    onClick={() => handleRemoveFromWishlist(item.product)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              localStorage.removeItem('token');
              router.push('/login');
            }}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg sm:rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold text-base sm:text-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}