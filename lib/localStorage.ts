export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  productId: string;
  color?: string;
  size?: string;
}

export interface WishlistItem {
  _id: string;
  product: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export const getLocalCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

export const setLocalCart = (cart: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
};

export const addToLocalCart = (item: CartItem) => {
  const cart = getLocalCart();
  const existingItemIndex = cart.findIndex(
    (i) => i.productId === item.productId && i.color === item.color && i.size === item.size
  );
  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += item.quantity;
  } else {
    cart.push({ ...item, _id: Date.now().toString() });
  }
  setLocalCart(cart);
};

export const updateLocalCartItem = (itemId: string, quantity: number) => {
  const cart = getLocalCart();
  const itemIndex = cart.findIndex((i) => i._id === itemId);
  if (itemIndex > -1) {
    if (quantity <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = quantity;
    }
    setLocalCart(cart);
  }
};

export const removeFromLocalCart = (itemId: string) => {
  const cart = getLocalCart();
  const updatedCart = cart.filter((i) => i._id !== itemId);
  setLocalCart(updatedCart);
};

export const getLocalWishlist = (): WishlistItem[] => {
  if (typeof window === 'undefined') return [];
  const wishlist = localStorage.getItem('wishlist');
  return wishlist ? JSON.parse(wishlist) : [];
};

export const setLocalWishlist = (wishlist: WishlistItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }
};

export const addToLocalWishlist = (item: WishlistItem) => {
  const wishlist = getLocalWishlist();
  if (!wishlist.some((i) => i.product === item.product)) {
    wishlist.push({ ...item, _id: Date.now().toString() });
    setLocalWishlist(wishlist);
  }
};

export const removeFromLocalWishlist = (productId: string) => {
  const wishlist = getLocalWishlist();
  const updatedWishlist = wishlist.filter((i) => i.product !== productId);
  setLocalWishlist(wishlist);
};