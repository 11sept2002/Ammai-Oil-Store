import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  cartItems: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
  shippingAddress: localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : {},
  paymentMethod: 'Razorpay',

  addToCart: (item) => {
    const { cartItems } = get();
    const existItem = cartItems.find((x) => x.product === item.product);

    let newCartItems;
    if (existItem) {
      newCartItems = cartItems.map((x) =>
        x.product === existItem.product ? item : x
      );
    } else {
      newCartItems = [...cartItems, item];
    }

    localStorage.setItem('cartItems', JSON.stringify(newCartItems));
    set({ cartItems: newCartItems });
  },

  removeFromCart: (id) => {
    const { cartItems } = get();
    const newCartItems = cartItems.filter((x) => x.product !== id);
    localStorage.setItem('cartItems', JSON.stringify(newCartItems));
    set({ cartItems: newCartItems });
  },

  saveShippingAddress: (data) => {
    localStorage.setItem('shippingAddress', JSON.stringify(data));
    set({ shippingAddress: data });
  },

  savePaymentMethod: (data) => {
    set({ paymentMethod: data });
  },

  clearCart: () => {
    localStorage.removeItem('cartItems');
    set({ cartItems: [] });
  },
}));

export default useCartStore;
