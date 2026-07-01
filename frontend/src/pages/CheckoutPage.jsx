import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import { CheckCircle2 } from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuthStore();
  const { cartItems, shippingAddress, saveShippingAddress, clearCart } = useCartStore();

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=checkout');
    }
  }, [userInfo, navigate]);

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = 0.15 * itemsPrice;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const submitHandler = async (e) => {
    e.preventDefault();
    saveShippingAddress({ address, city, postalCode, country });
    setLoading(true);
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const orderData = {
        orderItems: cartItems,
        shippingAddress: { address, city, postalCode, country },
        paymentMethod: 'Mock Razorpay',
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      await axios.post('/api/orders', orderData, config);
      
      setSuccess(true);
      clearCart();
      setTimeout(() => navigate('/orders'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600">Redirecting to your orders...</p>
      </div>
    );
  }

  return (
    <div className="py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Address</h2>
          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter postal code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </div>
          </form>
        </div>
      </div>

      <div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
          {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Items:</span>
              <span>${itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping:</span>
              <span>${shippingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600 pb-4 border-b border-gray-100">
              <span>Tax:</span>
              <span>${taxPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-bold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-indigo-600">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={submitHandler}
            disabled={cartItems.length === 0 || loading}
            className="w-full btn-primary py-3 flex justify-center items-center"
          >
            {loading ? 'Processing...' : 'Place Order (Mock Payment)'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
