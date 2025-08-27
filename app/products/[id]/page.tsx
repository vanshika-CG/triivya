
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingBag, Star, ChevronLeft, ChevronRight, ZoomIn, Truck, Shield, RefreshCw, X } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice } from '@/lib/utils';
import { useLoading } from '@/lib/LoadingContext';
import { getLocalWishlist, addToLocalWishlist, removeFromLocalWishlist, addToLocalCart } from '@/lib/localStorage';

interface Review {
  _id: string;
  user: { _id: string; name: string };
  rating: number;
  comment?: string;
  images: string[];
  createdAt: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  description: string;
  category: string;
  rating: number;
  reviewCount: number;
  sku: string;
  availability: string;
  images: string[];
  colors: { name: string; value: string; selected: boolean }[];
  sizes: { value: string; selected: boolean }[];
  features: string[];
  specifications: Record<string, string>;
  createdAt: string;
  reviews: Review[];
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const { setLoading } = useLoading();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewImages, setReviewImages] = useState<File[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setIsLoading(true);
        const response = await api.get(`/products/${id}`);
        // Ensure images is an array
        const productData = {
          ...response.data,
          images: Array.isArray(response.data.images) ? response.data.images : [],
          colors: Array.isArray(response.data.colors) ? response.data.colors : [],
          sizes: Array.isArray(response.data.sizes) ? response.data.sizes : [],
          reviews: Array.isArray(response.data.reviews) ? response.data.reviews : [],
        };
        setProduct(productData);
        setError(null);
      } catch (err: any) {
        const errorMsg = err.response?.data?.msg || 'Failed to load product';
        setError(errorMsg);
        toast.error(errorMsg, { position: 'top-right', autoClose: 3000 });
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    const fetchWishlist = async () => {
      try {
        setLoading(true);
        if (isAuthenticated) {
          const token = localStorage.getItem('token');
          if (!token) {
            setIsAuthenticated(false);
            const localWishlist = getLocalWishlist();
            setWishlist(new Set(localWishlist.map((item: any) => item.product)));
            return;
          }
          const response = await api.get('/wishlist');
          setWishlist(new Set(response.data.map((item: any) => item.product)));
        } else {
          const localWishlist = getLocalWishlist();
          setWishlist(new Set(localWishlist.map((item: any) => item.product)));
        }
      } catch (err: any) {
        console.error('Error fetching wishlist:', err);
        if (err.response?.status === 401 || err.message.includes('No authentication token found')) {
          setIsAuthenticated(false);
          localStorage.removeItem('token');
          const localWishlist = getLocalWishlist();
          setWishlist(new Set(localWishlist.map((item: any) => item.product)));
        } else {
          toast.error(err.response?.data?.msg || 'Failed to load wishlist', {
            position: 'top-right',
            autoClose: 3000,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    fetchWishlist();
  }, [id, isAuthenticated, setIsAuthenticated, setLoading]);

  const handleAddToCart = async () => {
    if (!product) return;

    if (product.colors?.length && !selectedColor) {
      toast.error('Please select a color before adding to cart.', { position: 'top-right', autoClose: 3000 });
      return;
    }

    if (product.sizes?.length && !selectedSize) {
      toast.error('Please select a size before adding to cart.', { position: 'top-right', autoClose: 3000 });
      return;
    }

    try {
      if (isAuthenticated) {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        await api.post('/cart', {
          productId: product._id,
          quantity: 1,
          color: selectedColor,
          size: selectedSize,
        });
        toast.success(`${product.name} added to your cart`, { position: 'top-right', autoClose: 3000 });
      } else {
        addToLocalCart({
          _id: Date.now().toString(),
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.images[0] || '/placeholder.svg',
          quantity: 1,
          color: selectedColor || undefined,
          size: selectedSize || undefined,
        });
        toast.success(`${product.name} added to your cart`, { position: 'top-right', autoClose: 3000 });
      }
    } catch (err: any) {
      if (err.response?.status === 401 || err.message.includes('No authentication token found')) {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        addToLocalCart({
          _id: Date.now().toString(),
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.images[0] || '/placeholder.svg',
          quantity: 1,
          color: selectedColor || undefined,
          size: selectedSize || undefined,
        });
        toast.success(`${product.name} added to your cart`, { position: 'top-right', autoClose: 3000 });
      } else {
        toast.error(err.response?.data?.msg || 'Failed to add to cart', { position: 'top-right', autoClose: 3000 });
      }
    }
  };

  const toggleWishlist = async () => {
    if (!product) return;
    const newWishlist = new Set(wishlist);
    const isAdding = !newWishlist.has(product._id);

    try {
      if (isAuthenticated) {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        if (isAdding) {
          await api.post('/wishlist', { productId: product._id });
          newWishlist.add(product._id);
          toast.success(`${product.name} added to your wishlist`, { position: 'top-right', autoClose: 3000 });
        } else {
          await api.delete(`/wishlist/${product._id}`);
          newWishlist.delete(product._id);
          toast.success(`${product.name} removed from your wishlist`, { position: 'top-right', autoClose: 3000 });
        }
      } else {
        if (isAdding) {
          addToLocalWishlist({
            _id: Date.now().toString(),
            product: product._id,
            name: product.name,
            price: product.price,
            image: product.images[0] || '/placeholder.svg',
            category: product.category,
          });
          newWishlist.add(product._id);
          toast.success(`${product.name} added to your wishlist`, { position: 'top-right', autoClose: 3000 });
        } else {
          removeFromLocalWishlist(product._id);
          newWishlist.delete(product._id);
          toast.success(`${product.name} removed from your wishlist`, { position: 'top-right', autoClose: 3000 });
        }
      }
      setWishlist(newWishlist);
    } catch (err: any) {
      console.error('Wishlist error:', err);
      if (err.response?.status === 401 || err.message.includes('No authentication token found')) {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        if (isAdding) {
          addToLocalWishlist({
            _id: Date.now().toString(),
            product: product._id,
            name: product.name,
            price: product.price,
            image: product.images[0] || '/placeholder.svg',
            category: product.category,
          });
          newWishlist.add(product._id);
          toast.success(`${product.name} added to your wishlist`, { position: 'top-right', autoClose: 3000 });
        } else {
          removeFromLocalWishlist(product._id);
          newWishlist.delete(product._id);
          toast.success(`${product.name} removed from your wishlist`, { position: 'top-right', autoClose: 3000 });
        }
        setWishlist(newWishlist);
      } else {
        toast.error(err.response?.data?.msg || 'Failed to update wishlist', { position: 'top-right', autoClose: 3000 });
      }
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to submit a review', { position: 'top-right', autoClose: 3000 });
      return;
    }
    if (!product) return;
    if (reviewRating < 1 || reviewRating > 5) {
      toast.error('Please select a rating between 1 and 5', { position: 'top-right', autoClose: 3000 });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('rating', reviewRating.toString());
      if (reviewComment) formData.append('comment', reviewComment);
      reviewImages.forEach((image) => formData.append('images', image));

      const response = await api.post(`/products/${id}/reviews`, formData);
      setProduct((prev) => {
        if (!prev) return prev;
        return { ...prev, reviews: [...prev.reviews, response.data.review] };
      });
      setReviewRating(0);
      setReviewComment('');
      setReviewImages([]);
      toast.success('Review submitted successfully', { position: 'top-right', autoClose: 3000 });
    } catch (err: any) {
      console.error('Review submission error:', err.response?.data);
      const errorMsg = err.response?.data?.msg || 'Failed to submit review';
      toast.error(errorMsg, { position: 'top-right', autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).slice(0, 3 - reviewImages.length);
      for (const file of newImages) {
        if (file.size > 2 * 1024 * 1024) {
          toast.error('Image size exceeds 2MB limit', { position: 'top-right', autoClose: 3000 });
          return;
        }
        const allowedFormats = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedFormats.includes(file.type)) {
          toast.error('Invalid image format. Use JPEG, PNG, or WebP', { position: 'top-right', autoClose: 3000 });
          return;
        }
      }
      setReviewImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeReviewImage = (index: number) => {
    setReviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Button
            onClick={() => router.push('/products')}
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium"
          >
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 p-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <div className="flex gap-4">
              <div className="flex flex-col space-y-3 w-20">
                {product.images?.length > 0 ? (
                  product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative aspect-square rounded-lg border-2 transition-all duration-200 ${
                        currentImageIndex === index ? 'border-gray-900' : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <Image
                        src={image || '/placeholder.svg'}
                        alt={`Product ${index + 1}`}
                        fill={true}
                        className="object-cover"
                      />
                    </button>
                  ))
                ) : (
                  <div className="relative aspect-square rounded-lg border-2 border-gray-200">
                    <Image
                      src="/placeholder.svg"
                      alt="No image available"
                      fill={true}
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="relative w-full h-[600px] rounded-lg overflow-hidden bg-gray-50">
                  <Image
                    src={product.images[currentImageIndex] || product.images[0] || '/placeholder.svg'}
                    alt={product.name}
                    fill={true}
                    className={`object-contain transition-transform duration-300 ${isZoomed ? 'scale-110' : 'scale-100'}`}
                  />
                  <button
                    onClick={() => setIsZoomed(!isZoomed)}
                    className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow"
                  >
                    <ZoomIn className="w-5 h-5 text-gray-600" />
                  </button>
                  {product.images?.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setCurrentImageIndex((index) => (index - 1 + product.images.length) % product.images.length)
                        }
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex((index) => (index + 1) % product.images.length)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      </button>
                    </>
                  )}
                  {product.discount && product.discount > 0 && (
                    <div className="absolute top-0 left-0 bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                      -{product.discount}% OFF
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium uppercase tracking-wide">
                  {product.category}
                </span>
                <span className="text-sm text-gray-500">SKU: {product.sku}</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="text-lg font-medium text-gray-700">{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-gray-600">({product.reviewCount} reviews)</span>
              </div>
            </div>
            <div className="border-t border-b border-gray-200 py-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xl text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                )}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-green-600 font-medium">
                  You save {formatPrice(product.originalPrice - product.price)}
                </p>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
            {product.colors?.length > 0 && (
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  Color {selectedColor && `- ${selectedColor}`}
                </label>
                <div className="flex gap-x-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                        selectedColor === color.name ? 'border-gray-900 ring-2 ring-gray-300' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}
            {product.sizes?.length > 0 && (
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  Size {selectedSize && `- ${selectedSize}`}
                </label>
                <div className="flex gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => setSelectedSize(size.value)}
                      className={`py-2 px-4 border rounded-lg font-medium transition-all duration-200 ${
                        selectedSize === size.value ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size.value}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  product.availability.toLowerCase() === 'in stock' ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className="font-medium text-gray-900">{product.availability}</span>
            </div>
            <div className="flex gap-x-4 pt-4">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-3 text-lg font-semibold rounded-lg transition-all duration-200"
                disabled={product.availability.toLowerCase() === 'out of stock'}
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                onClick={() => toggleWishlist()}
                variant="outline"
                className={`p-3 border-2 rounded-lg transition-all duration-200 ${
                  wishlist.has(product._id) ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-300 hover:border-red-500 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${wishlist.has(product._id) ? 'fill-red-500' : ''}`} />
              </Button>
            </div>
            {!isAuthenticated && (
              <p className="text-sm text-gray-500 mt-2">
                Your cart items are saved locally. Log in to sync them with your account.
              </p>
            )}
            {product.features?.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-600">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {Object.keys(product.specifications).length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <dt className="font-medium text-gray-700 text-sm uppercase tracking-wide">{key}</dt>
                      <dd className="text-gray-900 mt-1">{value}</dd>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
              {isAuthenticated ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setReviewRating(i + 1)}
                          className={`w-8 h-8 flex items-center justify-center ${
                            i < reviewRating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          <Star className="w-6 h-6" fill={i < reviewRating ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                      Comment (Optional)
                    </label>
                    <textarea
                      id="comment"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-gray-300 focus:border-gray-300"
                      rows={4}
                      placeholder="Share your thoughts about the product..."
                    />
                  </div>
                  <div>
                    <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Images (Optional, max 3)
                    </label>
                    <input
                      type="file"
                      id="images"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                    />
                    {reviewImages.length > 0 && (
                      <div className="mt-4 flex gap-4">
                        {reviewImages.map((image, index) => (
                          <div key={index} className="relative w-20 h-20">
                            <Image
                              src={URL.createObjectURL(image)}
                              alt={`Review image ${index + 1}`}
                              fill={true}
                              className="object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => removeReviewImage(index)}
                              className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="bg-gray-900 hover:bg-gray-800 text-white py-2 px-6 rounded-lg font-medium"
                    disabled={reviewRating === 0}
                  >
                    Submit Review
                  </Button>
                </form>
              ) : (
                <p className="text-gray-600">
                  Please <a href="/login" className="text-blue-600 hover:underline">log in</a> to write a review.
                </p>
              )}
            </div>
            {product.reviews?.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
                <div className="space-y-6">
                  {product.reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-200 pb-4">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{review.user.name}</span>
                        <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      {review.comment && <p className="text-gray-600 mb-2">{review.comment}</p>}
                      {review.images?.length > 0 && (
                        <div className="flex gap-4">
                          {review.images.map((image, index) => (
                            <div key={index} className="relative w-24 h-24">
                              <Image
                                src={image}
                                alt={`Review image ${index + 1}`}
                                fill={true}
                                className="object-cover rounded-md"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-3 gap-4 border-t border-gray-200 pt-6">
              <div className="text-center">
                <Truck className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                <p className="text-xs text-gray-500">On orders over ₹3000</p>
              </div>
              <div className="text-center">
                <RefreshCw className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Easy Returns</p>
                <p className="text-xs text-gray-500">7-day return policy</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Secure Payment</p>
                <p className="text-xs text-gray-500">100% protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
