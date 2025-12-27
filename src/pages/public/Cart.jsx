import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { cart, addToCart, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
        <Link to="/" className="text-green-600 hover:underline">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Shopping Cart</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {cart.map((item) => (
          <div key={item._id} className="flex items-center gap-4 p-4 border-b last:border-b-0">
            {/* Image */}
            <div className="w-20 h-20 bg-gray-50 rounded-lg p-2 flex-shrink-0">
              <img 
                src={item.images[0] || '/assets/placeholder.png'} 
                alt={item.name} 
                className="w-full h-full object-contain"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-500">
                Unit Price: ৳{item.discountPrice || item.price}
              </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => addToCart(item, -1)}
                disabled={item.qty <= 1}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-600 disabled:opacity-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-medium w-6 text-center">{item.qty}</span>
              <button 
                onClick={() => addToCart(item, 1)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-600"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Total & Remove */}
            <div className="text-right min-w-[80px]">
              <div className="font-bold text-gray-800 mb-1">
                ৳{(item.discountPrice || item.price) * item.qty}
              </div>
              <button 
                onClick={() => removeFromCart(item._id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="mt-6 flex justify-end">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-full max-w-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Subtotal:</span>
            <span className="text-xl font-bold text-green-700">৳{cartTotal}</span>
          </div>
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}