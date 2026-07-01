import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight } from 'lucide-react';
import useCartStore from '../store/useCartStore';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, addToCart, removeFromCart } = useCartStore();

  const checkoutHandler = () => {
    navigate('/login?redirect=checkout');
  };

  return (
    <div className="py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="bg-blue-50 text-blue-700 p-6 rounded-xl flex items-center justify-between">
          <p className="text-lg">Your cart is empty.</p>
          <Link to="/" className="font-bold hover:underline">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.product} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                  <Link to={`/product/${item.product}`} className="text-lg font-medium text-gray-900 hover:text-indigo-600 transition-colors">
                    {item.name}
                  </Link>
                </div>
                <div className="flex items-center space-x-6">
                  <span className="font-bold text-gray-900 w-20">${item.price.toFixed(2)}</span>
                  <select
                    value={item.qty}
                    onChange={(e) => addToCart({ ...item, qty: Number(e.target.value) })}
                    className="input-field py-1 w-20"
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeFromCart(item.product)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-gray-600">
                <span>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)}):</span>
                <span>${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-indigo-600">
                  ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                </span>
              </div>
            </div>
            <button
              onClick={checkoutHandler}
              disabled={cartItems.length === 0}
              className="w-full btn-primary flex items-center justify-center py-3 text-lg"
            >
              Proceed to Checkout
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
