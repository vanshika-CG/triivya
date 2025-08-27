'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      const res = await fetch('https://triivya-clothing.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        router.push(`/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
      } else {
        setError(data.msg || 'Registration failed');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Left panel with brand identity */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-800 to-pink-800 flex-col justify-center items-center px-8 py-12">
        <div className="text-center">
          <h1 className="font-serif text-5xl font-bold text-white mb-4">TRIIVYA</h1>
          <h2 className="text-3xl font-light text-white mb-6">Elegance Redefined</h2>
          <p className="text-yellow-300 text-lg italic">For Every Occasion</p>
          <div className="mt-8 w-24 h-1 bg-yellow-300 mx-auto"></div>
          <p className="mt-8 text-white text-sm max-w-md">
            Join our exclusive community and discover curated collections that blend timeless sophistication with contemporary style.
          </p>
        </div>
      </div>

      {/* Right panel with registration form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="md:hidden text-center mb-10">
            <h1 className="font-serif text-4xl font-bold text-purple-900">TRIIVYA</h1>
            <p className="text-yellow-600 text-sm">Elegance Redefined</p>
          </div>
          
          <div className="bg-white shadow-2xl rounded-lg p-8 border-t-4 border-purple-800">
            <h2 className="text-2xl font-bold text-purple-900 mb-6">Create Your Account</h2>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                <p>{error}</p>
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
              
              <div className="pt-2">
                <button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-purple-800 to-pink-700 text-white py-3 rounded-md hover:opacity-90 transition duration-300 shadow-md"
                >
                  Create Account
                </button>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="text-purple-700 font-medium hover:text-purple-900">
                  Sign In
                </a>
              </p>
            </div>
          </div>
          
          <div className="mt-6 text-center text-gray-500 text-xs">
            <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
            <p className="mt-2">© 2025 TRIIVYA. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}