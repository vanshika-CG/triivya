"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDropzone } from "react-dropzone";
import { X, Plus, Edit, Trash } from "lucide-react";
import api from "@/lib/api";

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
}

interface ProductFormData {
  name: string;
  price: number;
  originalPrice: number | "";
  discount: number | "";
  description: string;
  category: string;
  sku: string;
  availability: string;
  colors: { name: string; value: string; selected: boolean }[];
  sizes: { value: string; selected: boolean }[];
  features: string[];
  specifications: Record<string, string>;
}

interface FormErrors {
  name?: string;
  price?: string;
  description?: string;
  category?: string;
  sku?: string;
  originalPrice?: string;
  discount?: string;
}

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [productData, setProductData] = useState<ProductFormData>({
    name: "",
    price: 0,
    originalPrice: "",
    discount: "",
    description: "",
    category: "Women's Ethnic",
    sku: "",
    availability: "In Stock",
    colors: [],
    sizes: [],
    features: [],
    specifications: {},
  });
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const limit = 12;
  const router = useRouter();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".jpeg", ".png", ".jpg", ".webp"] },
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024, // 5MB limit
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        fileRejections.forEach((file) => {
          file.errors.forEach((err) => {
            if (err.code === "file-too-large") {
              toast.error("Image exceeds 5MB limit.");
            } else if (err.code === "file-invalid-type") {
              toast.error("Invalid image format. Use JPEG, PNG, or WebP.");
            }
          });
        });
        return;
      }
      setImages([...images, ...acceptedFiles].slice(0, 5));
    },
  });

  const fetchProducts = async (pageNum: number, append: boolean = false) => {
    try {
      setLoading(true);
      const response = await api.get("/products", {
        params: { page: pageNum, limit },
      });
      const fetchedProducts = Array.isArray(response.data.products)
        ? response.data.products.map((p: Product) => ({
            ...p,
            colors: Array.isArray(p.colors) ? p.colors : [],
            sizes: Array.isArray(p.sizes) ? p.sizes : [],
            features: Array.isArray(p.features) ? p.features : [],
            specifications: p.specifications || {},
            description: p.description || "", // Ensure description is always a string
          }))
        : Array.isArray(response.data)
        ? response.data
        : [];
      const total = response.data.total || fetchedProducts.length;
      const hasMoreProducts = fetchedProducts.length === limit || pageNum * limit < total;

      if (append) {
        setProducts((prev) => [...prev, ...fetchedProducts]);
      } else {
        setProducts(fetchedProducts);
      }

      setTotalProducts(total);
      setHasMore(hasMoreProducts);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      toast.error("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
    const verifyAdmin = async () => {
      try {
        const res = await api.get("/auth/me");
        if (!res.data.isAdmin) {
          toast.error("You need admin privileges to access this page.");
          router.push("/admin/login");
        } else {
          fetchProducts(1);
        }
      } catch (err) {
        console.error("Failed to verify admin status:", err);
        toast.error("Unable to verify admin status. Please log in again.");
        router.push("/admin/login");
      }
    };
    verifyAdmin();
  }, [router]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, true);
  };

  const resetForm = () => {
    setProductData({
      name: "",
      price: 0,
      originalPrice: "",
      discount: "",
      description: "",
      category: "Women's Ethnic",
      sku: "",
      availability: "In Stock",
      colors: [],
      sizes: [],
      features: [],
      specifications: {},
    });
    setImages([]);
    setExistingImages([]);
    setFormErrors({});
  };

  const handleOpenAddModal = () => {
    resetForm();
    setEditProduct(null);
    setShowAddModal(true);
  };

  const handleOpenEditModal = async (product: Product) => {
    try {
      // Fetch the full product details to ensure all fields are populated
      const response = await api.get(`/products/${product._id}`);
      const fullProduct = response.data;

      setEditProduct(fullProduct);
      setProductData({
        name: fullProduct.name || "",
        price: fullProduct.price || 0,
        originalPrice: fullProduct.originalPrice || "",
        discount: fullProduct.discount || "",
        description: fullProduct.description || "", // Ensure description is populated
        category: fullProduct.category || "Women's Ethnic",
        sku: fullProduct.sku || "",
        availability: fullProduct.availability || "In Stock",
        colors: Array.isArray(fullProduct.colors) ? fullProduct.colors : [],
        sizes: Array.isArray(fullProduct.sizes) ? fullProduct.sizes : [],
        features: Array.isArray(fullProduct.features) ? fullProduct.features : [], // Ensure features are populated
        specifications: fullProduct.specifications || {}, // Ensure specifications are populated
      });
      setExistingImages(fullProduct.images || []);
      setImages([]);
      setFormErrors({});
      setShowAddModal(true);
    } catch (err) {
      console.error("Error fetching product for edit:", err);
      toast.error("Failed to load product details for editing.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value === "" ? "" : parseFloat(value) }));
   (panel) => setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddColor = () => {
    setProductData((prev) => ({
      ...prev,
      colors: [...prev.colors, { name: "", value: "#000000", selected: false }],
    }));
  };

  const handleColorChange = (index: number, field: string, value: string) => {
    const newColors = [...productData.colors];
    newColors[index][field] = value;
    setProductData((prev) => ({ ...prev, colors: newColors }));
  };

  const handleRemoveColor = (index: number) => {
    const newColors = productData.colors.filter((_, i) => i !== index);
    setProductData((prev) => ({ ...prev, colors: newColors }));
  };

  const handleAddSize = () => {
    setProductData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { value: "", selected: false }],
    }));
  };

  const handleSizeChange = (index: number, value: string) => {
    const newSizes = [...productData.sizes];
    newSizes[index].value = value;
    setProductData((prev) => ({ ...prev, sizes: newSizes }));
  };

  const handleRemoveSize = (index: number) => {
    const newSizes = productData.sizes.filter((_, i) => i !== index);
    setProductData((prev) => ({ ...prev, sizes: newSizes }));
  };

  const handleAddFeature = () => {
    setProductData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...productData.features];
    newFeatures[index] = value;
    setProductData((prev) => ({ ...prev, features: newFeatures }));
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = productData.features.filter((_, i) => i !== index);
    setProductData((prev) => ({ ...prev, features: newFeatures }));
  };

  const handleSpecificationChange = (key: string, value: string) => {
    setProductData((prev) => ({
      ...prev,
      specifications: { ...prev.specifications, [key]: value },
    }));
  };

  const handleRemoveSpecification = (key: string) => {
    const newSpecs = { ...productData.specifications };
    delete newSpecs[key];
    setProductData((prev) => ({ ...prev, specifications: newSpecs }));
  };

  const handleDeleteImage = (index: number) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      const newImages = existingImages.filter((_, i) => i !== index);
      setExistingImages(newImages);
    }
  };

  const validateForm = () => {
    const errors: FormErrors = {};
    if (!productData.name.trim()) errors.name = "Product name is required.";
    if (!productData.price || productData.price <= 0) errors.price = "Price must be greater than 0.";
    if (!productData.description.trim()) errors.description = "Description is required.";
    if (!productData.category) errors.category = "Category is required.";
    if (!productData.sku.trim()) errors.sku = "SKU is required.";
    if (productData.discount && (productData.discount < 0 || productData.discount > 100)) {
      errors.discount = "Discount must be between 0 and 100.";
    }
    if (productData.originalPrice && productData.originalPrice <= productData.price) {
      errors.originalPrice = "Original price must be greater than the current price.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const checkSkuUniqueness = async (sku: string, productId?: string) => {
    try {
      const response = await api.get("/products", { params: { search: sku } });
      const productsWithSku = response.data.products.filter((p: Product) => p.sku === sku && p._id !== productId);
      return productsWithSku.length === 0;
    } catch (err) {
      console.error("Error checking SKU uniqueness:", err);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting.");
      return;
    }

    const isSkuUnique = await checkSkuUniqueness(productData.sku, editProduct?._id);
    if (!isSkuUnique) {
      setFormErrors((prev) => ({ ...prev, sku: "SKU already exists." }));
      toast.error("SKU already exists. Please choose a unique SKU.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("price", productData.price.toString());
    formData.append("description", productData.description);
    formData.append("category", productData.category);
    formData.append("sku", productData.sku);
    formData.append("availability", productData.availability);
    if (productData.originalPrice !== "") formData.append("originalPrice", productData.originalPrice.toString());
    if (productData.discount !== "") formData.append("discount", productData.discount.toString());
    formData.append("colors", JSON.stringify(productData.colors || []));
    formData.append("sizes", JSON.stringify(productData.sizes || []));
    formData.append("features", JSON.stringify(productData.features || []));
    formData.append("specifications", JSON.stringify(productData.specifications || {}));
    formData.append("existingImages", JSON.stringify(existingImages || []));
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      if (editProduct) {
        const res = await api.put(`/products/${editProduct._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setProducts(products.map((p) => (p._id === editProduct._id ? { ...res.data, colors: Array.isArray(res.data.colors) ? res.data.colors : [] } : p)));
        toast.success(`${res.data.name} has been successfully updated.`);
      } else {
        await api.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setPage(1);
        fetchProducts(1);
        toast.success("Product has been successfully added.");
      }
      setShowAddModal(false);
      resetForm();
    } catch (err: any) {
      console.error("Product operation error:", err);
      let errorMessage = editProduct ? "Error updating product." : "Error adding product.";
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          errorMessage = "Unauthorized: Please log in again.";
          router.push("/admin/login");
        } else if (err.response.status === 400) {
          errorMessage = err.response.data.msg || "Invalid product data.";
          if (err.response.data.errors) {
            const backendErrors: FormErrors = {};
            Object.keys(err.response.data.errors).forEach((key) => {
              backendErrors[key] = err.response.data.errors[key].message;
            });
            setFormErrors(backendErrors);
          }
        } else if (err.response.status === 500) {
          errorMessage = err.response.data.msg || "Server error. Please try again later.";
        }
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (editProduct) {
      handleOpenEditModal(editProduct); // Reset form to original product data
    } else {
      resetForm();
    }
    setFormErrors({});
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${productId}`);
      setProducts(products.filter((p) => p._id !== productId));
      toast.success("The product has been successfully deleted.");
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Error deleting the product.");
    }
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />

      <div className="container mx-auto max-w-7xl mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-900">Admin Product Management</h1>
          <Button
            onClick={handleOpenAddModal}
            className="bg-[rgb(140,77,100)] hover:bg-[rgb(120,57,80)] text-white"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Product
          </Button>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl">
        {loading && page === 1 ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[rgb(140,77,100)]"></div>
              <p className="text-gray-500 font-medium">Loading products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products found. Add a new product to get started.</p>
          </div>
        ) : (
          <>
            <div className="py-4">
              <p className="text-base text-gray-600 font-medium">
                Showing {products.length} of {totalProducts} {products.length === 1 ? "product" : "products"}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-all duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No Image
                      </div>
                    )}
                    {product.discount && product.discount > 0 && (
                      <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-lg">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2 uppercase tracking-wider">
                      {product.category}
                    </p>
                    {Array.isArray(product.colors) && product.colors.length > 0 && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500 font-medium">Colors:</span>
                        <div className="flex gap-1.5">
                          {product.colors.slice(0, 3).map((color, index) => (
                            <div
                              key={index}
                              className="w-4 h-4 rounded-full border border-gray-200"
                              style={{ backgroundColor: color.value }}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleOpenEditModal(product)}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDeleteProduct(product._id)}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          <Trash className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {hasMore && (
          <div className="text-center py-8">
            <Button
              onClick={handleLoadMore}
              disabled={loading || !hasMore}
              className={`px-12 py-4 rounded-xl font-semibold text-base transition-all duration-300 ${
                loading || !hasMore
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-[rgb(140,77,100)] hover:bg-[rgb(120,57,80)] text-white"
              }`}
            >
              {loading ? "Loading..." : `Load More Products (${products.length}/${totalProducts})`}
            </Button>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="font-medium text-gray-700">Product Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={productData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter product name"
                        className={`mt-1 ${formErrors.name ? "border-red-500" : "border-gray-300"} focus:ring-[rgb(140,77,100)] focus:border-[rgb(140,77,100)]`}
                      />
                      {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                    </div>
                    <div>
                      <Label htmlFor="sku" className="font-medium text-gray-700">SKU</Label>
                      <Input
                        id="sku"
                        name="sku"
                        value={productData.sku}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter SKU"
                        className={`mt-1 ${formErrors.sku ? "border-red-500" : "border-gray-300"} focus:ring-[rgb(140,77,100)] focus:border-[rgb(140,77,100)]`}
                      />
                      {formErrors.sku && <p className="text-red-500 text-sm mt-1">{formErrors.sku}</p>}
                    </div>
                    <div>
                      <Label htmlFor="price" className="font-medium text-gray-700">Price (₹)</Label>
                      <Input
                        type="number"
                        id="price"
                        name="price"
                        value={productData.price}
                        onChange={handleNumberInputChange}
                        required
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className={`mt-1 ${formErrors.price ? "border-red-500" : "border-gray-300"} focus:ring-[rgb(140,77,100)] focus:border-[rgb(140,77,100)]`}
                      />
                      {formErrors.price && <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>}
                    </div>
                    <div>
                      <Label htmlFor="originalPrice" className="font-medium text-gray-700">Original Price (Optional ₹)</Label>
                      <Input
                        type="number"
                        id="originalPrice"
                        name="originalPrice"
                        value={productData.originalPrice}
                        onChange={handleNumberInputChange}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className={`mt-1 ${formErrors.originalPrice ? "border-red-500" : "border-gray-300"} focus:ring-[rgb(140,77,100)] focus:border-[rgb(140,77,100)]`}
                      />
                      {formErrors.originalPrice && <p className="text-red-500 text-sm mt-1">{formErrors.originalPrice}</p>}
                    </div>
                    <div>
                      <Label htmlFor="discount" className="font-medium text-gray-700">Discount (%) (Optional)</Label>
                      <Input
                        type="number"
                        id="discount"
                        name="discount"
                        value={productData.discount}
                        onChange={handleNumberInputChange}
                        min="0"
                        max="100"
                        placeholder="0"
                        className={`mt-1 ${formErrors.discount ? "border-red-500" : "border-gray-300"} focus:ring-[rgb(140,77,100)] focus:border-[rgb(140,77,100)]`}
                      />
                      {formErrors.discount && <p className="text-red-500 text-sm mt-1">{formErrors.discount}</p>}
                    </div>
                    <div>
                      <Label htmlFor="category" className="font-medium text-gray-700">Category</Label>
                      <Select
                        name="category"
                        value={productData.category}
                        onValueChange={(value) => setProductData((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger className={`mt-1 ${formErrors.category ? "border-red-500" : "border-gray-300"} focus:ring-[rgb(140,77,100)] focus:border-[rgb(140,77,100)]`}>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Women's Ethnic">Women's Ethnic</SelectItem>
                          <SelectItem value="Saree">Saree</SelectItem>
                          <SelectItem value="Dresses">Dresses</SelectItem>
                          <SelectItem value="Lahenga">Lahenga</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.category && <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>}
                    </div>
                    <div>
                      <Label htmlFor="availability" className="font-medium text-gray-700">Availability</Label>
                      <Select
                        name="availability"
                        value={productData.availability}
                        onValueChange={(value) => setProductData((prev) => ({ ...prev, availability: value }))}
                      >
                        <SelectTrigger className="mt-1 border-gray-300 focus:ring-[rgb(140,77,100)] focus:border-[rgb(140,77,100)]">
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="In Stock">In Stock</SelectItem>
                          <SelectItem value="Low Stock">Low Stock</SelectItem>
                          <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                          <SelectItem value="Pre-order">Pre-order</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Description</h3>
                  <div>
                    <Label htmlFor="description" className="font-medium text-gray-700">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={productData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      placeholder="Enter detailed product description..."
                      className={`mt-1 ${formErrors.description ? "border-red-500" : "border-gray-300"} focus:ring-[rgb(140,77,100)] focus:border-[rgb(140,77,100)]`}
                    />
                    {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
                  </div>
                </div>

                {/* Images */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Images (Max 5)</h3>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
                      isDragActive ? "border-[rgb(140,77,100)] bg-gray-100" : "border-gray-300 bg-white"
                    } hover:border-[rgb(140,77,100)] hover:bg-gray-50 cursor-pointer`}
                  >
                    <input {...getInputProps()} />
                    <p className="text-gray-600 font-medium">
                      {isDragActive ? "Drop images here" : "Drag & drop images or click to select (Max 5, JPEG/PNG/WebP, 5MB each)"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                    {existingImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={image}
                          alt={`Existing ${index}`}
                          width={100}
                          height={100}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteImage(index)}
                          className="absolute top-1 right-1 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {images.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setImages(images.filter((_, i) => i !== index))}
                          className="absolute top-1 right-1 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Colors</h3>
                  {productData.colors.length === 0 && (
                    <p className="text-gray-500 text-sm mb-4">No colors added yet.</p>
                  )}
                  {productData.colors.map((color, index) => (
                    <div key={index} className="flex items-center gap-3 mb-3 bg-white p-3 rounded-md border border-gray-200">
                      <Input
                        type="text"
                        placeholder="Color Name (e.g., Red)"
                        value={color.name}
                        onChange={(e) => handleColorChange(index, "name", e.target.value)}
                        className="border-gray-300 focus:ring-[rgb(140,77,100)] focus:border-[rgb(140,77,100)]"
                      />
                      <Input
                        type="color"
                        value={color.value}
                        onChange={(e) => handleColorChange(index, "value", e.target.value)}
                        className="w-12 h-10 border-gray-300"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveColor(index)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={handleAddColor}
                    className="mt-3 bg-[rgb(140,77,100)] hover:bg-[rgb(120,57,80)] text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Color
                  </Button>
                </div>

                {/* Sizes */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Sizes</h3>
                  {productData.sizes.length === 0 && (
                    <p className="text-gray-500 text-sm mb-4">No sizes added yet.</p>
                  )}
                  {productData.sizes.map((size, index) => (
                    <div key={index} className="flex items-center gap-3 mb-3 bg-white p-3 rounded-md border border-gray-200">
                      <Input
                        type="text"
                        placeholder="Size (e.g., S, M, L)"
                        value={size.value}
                        onChange={(e) => handleSizeChange(index, e.target.value)}
                        className="border-gray-300 focus:ring-[rgb(140,77,100)] focus:border-[rgb(140,77,100)]"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveSize(index)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={handleAddSize}
                    className="mt-3 bg-[rgb(140,77,100)] hover:bg-[rgb(120,57,80)] text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Size
                  </Button>
                </div>

                {/* Features */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Features</h3>
                  {productData.features.length === 0 && (
                    <p className="text-gray-500 text-sm mb-4">No features added yet.</p>
                  )}
                  {productData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 mb-3 bg-white p-3 rounded-md border border-gray-200">
                      <Input
                        type="text"
                        placeholder="Feature description (e.g., Breathable fabric)"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        className="border-gray-300 focus:ring-[rgb(140,77,100)] focus:border-[rgb(140,77,100)]"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveFeature(index)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={handleAddFeature}
                    className="mt-3 bg-[rgb(140,77,100)] hover:bg-[rgb(120,57,80)] text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Feature
                  </Button>
                </div>

                {/* Specifications */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Specifications</h3>
                  {Object.keys(productData.specifications).length === 0 && (
                    <p className="text-gray-500 text-sm mb-4">No specifications added yet.</p>
                  )}
                  {Object.entries(productData.specifications).map(([key, value], index) => (
                    <div key={index} className="flex items-center gap-3 mb-3 bg-white p-3 rounded-md border border-gray-200">
                      <Input
                        type="text"
                        placeholder="Key (e.g., Material)"
                        value={key}
                        onChange={(e) => {
                          const newSpecs = { ...productData.specifications };
                          const newKey = e.target.value;
                          if (key !== newKey) {
                            newSpecs[newKey] = newSpecs[key];
                            delete newSpecs[key];
                            setProductData((prev) => ({ ...prev, specifications: newSpecs }));
                          }
                        }}
                        className="border-gray-300 focus:ring-[rgb(140,77,100)] focus:border-[rgb(140,77,100)]"
                      />
                      <Input
                        type="text"
                        placeholder="Value (e.g., Silk Blend)"
                        value={value}
                        onChange={(e) => handleSpecificationChange(key, e.target.value)}
                        className="border-gray-300 focus:ring-[rgb(140,77,100)] focus:border-[rgb(140,77,100)]"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveSpecification(key)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() =>
                      handleSpecificationChange(`new_spec_${Object.keys(productData.specifications).length}`, "")
                    }
                    className="mt-3 bg-[rgb(140,77,100)] hover:bg-[rgb(120,57,80)] text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Specification
                  </Button>
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 mt-6">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[rgb(140,77,100)] hover:bg-[rgb(120,57,80)] text-white text-lg py-6 rounded-lg"
                  >
                    {loading ? "Processing..." : editProduct ? "Update Product" : "Add Product"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 text-lg py-6 rounded-lg"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}