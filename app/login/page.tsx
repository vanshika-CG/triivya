"use client";
import { useState, useContext, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthContext } from "../context/AuthContext";
import { getLocalCart, getLocalWishlist, setLocalCart, setLocalWishlist } from "@/lib/localStorage";
import { toast } from "react-toastify";
import { useLoading } from "@/lib/LoadingContext";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/"; // Default to /profile
  const { setIsAuthenticated, setIsAdmin } = useContext(AuthContext);
  const { setLoading } = useLoading();

  const syncLocalDataWithServer = async (token: string) => {
    try {
      const localCart = getLocalCart();
      for (const item of localCart) {
        const res = await fetch("https://triivya-clothing.onrender.com/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: item.productId,
            quantity: item.quantity,
            color: item.color,
            size: item.size,
          }),
        });
        if (!res.ok) {
          const data = await res.json();
          toast.error(`Failed to sync cart item ${item.name}: ${data.msg || "Error"}`);
        }
      }
      setLocalCart([]);

      const localWishlist = getLocalWishlist();
      for (const item of localWishlist) {
        const res = await fetch("https://triivya-clothing.onrender.com/api/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: item.product }),
        });
        if (!res.ok) {
          const data = await res.json();
          toast.error(`Failed to sync wishlist item ${item.name}: ${data.msg || "Error"}`);
        }
      }
      setLocalWishlist([]);
    } catch (err) {
      console.error("Error syncing data:", err);
      toast.error("Failed to sync cart or wishlist with server");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("https://triivya-clothing.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        setIsAuthenticated(true);
        const userRes = await fetch("https://triivya-clothing.onrender.com/api/auth/me", {
          headers: { Authorization: `Bearer ${data.token}` },
        });
        const user = await userRes.json();
        setIsAdmin(user.isAdmin || false);
        await syncLocalDataWithServer(data.token);
        // Trigger storage event to sync auth state
        window.dispatchEvent(new Event('storage'));
        router.push(redirect);
        toast.success("Logged in successfully");
      } else {
        setError(data.msg || "Login failed");
        toast.error(data.msg || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong");
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-800 to-pink-800 flex-col justify-center items-center px-8 py-12">
        <div className="text-center">
          <h1 className="font-serif text-5xl font-bold text-white mb-4">TRIIVYA</h1>
          <h2 className="text-3xl font-light text-white mb-6">Elegance Redefined</h2>
          <p className="text-yellow-300 text-lg italic">For Every Occasion</p>
          <div className="mt-8 w-24 h-1 bg-yellow-300 mx-auto"></div>
          <p className="mt-8 text-white text-sm max-w-md">
            Discover curated collections that blend timeless sophistication with contemporary style.
          </p>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="md:hidden text-center mb-10">
            <h1 className="font-serif text-4xl font-bold text-purple-900">TRIIVYA</h1>
            <p className="text-yellow-600 text-sm">Elegance Redefined</p>
          </div>
          <div className="bg-white shadow-2xl rounded-lg p-8 border-t-4 border-purple-800">
            <h2 className="text-2xl font-bold text-purple-900 mb-6">Welcome Back</h2>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                <p>{error}</p>
              </div>
            )}
            <div className="space-y-6">
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
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <a href="#" className="text-xs text-purple-700 hover:text-purple-900">
                    Forgot Password?
                  </a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
              <div>
                <button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-purple-800 to-pink-700 text-white py-3 rounded-md hover:opacity-90 transition duration-300 shadow-md"
                >
                  Sign In
                </button>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <a href="/register" className="text-purple-700 font-medium hover:text-purple-900">
                  Create Account
                </a>
              </p>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 text-xs">
            <p>© 2025 TRIIVYA. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}