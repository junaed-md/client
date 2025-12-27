import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Truck } from 'lucide-react';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [shippingCost, setShippingCost] = useState(100); 
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/settings`);
        if (data && data.shippingAllBangladesh) {
            setShippingCost(Number(data.shippingAllBangladesh));
        }
      } catch (error) {
        console.error("Failed to load settings, using default 100");
      }
    };
    fetchSettings();
  }, [API_URL]);

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const onlyNums = value.replace(/[^0-9]/g, '');
    if (onlyNums.length <= 11) {
        setFormData({ ...formData, phone: onlyNums });
    }
  };

  if (cart.length === 0) {
    navigate('/');
    return null;
  }

  const safeSubtotal = Number(cartTotal) || 0;
  const safeShipping = Number(shippingCost) || 0;
  const finalTotal = safeSubtotal + safeShipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.phone.length < 11) {
        alert("Please enter a valid 11-digit phone number.");
        return;
    }
    setLoading(true);

    try {
      const orderData = {
        customer: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address 
        },
        items: cart.map(item => ({
          productId: item._id,
          name: item.name,
          quantity: item.qty,
          price: item.discountPrice || item.price
        })),
        subTotal: safeSubtotal,
        shippingCost: safeShipping,
        totalAmount: finalTotal,
        paymentMethod: 'COD'
      };

      const { data } = await axios.post(`${API_URL}/orders`, orderData);
      
      if (data.success) {
        clearCart();
        alert(`Order Placed! Invoice: ${data.order.invoiceId}\nTotal: ৳${finalTotal}`);
        navigate('/');
      }

    } catch (error) {
      console.error("Order Error:", error);
      // SHOW REAL ERROR MESSAGE
      const serverMessage = error.response?.data?.message || error.message;
      alert(`Failed to place order: ${serverMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Form Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" /> Shipping Info
        </h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input required type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input required type="tel" placeholder="01XXXXXXXXX" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              value={formData.phone} onChange={handlePhoneChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
            <textarea required rows="3" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold mt-4 shadow-lg shadow-green-200 transition-all">
            {loading ? 'Processing...' : `Confirm Order (৳${finalTotal})`}
          </button>
        </form>
      </div>

      {/* Order Summary */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5 text-green-600" /> Order Summary
        </h2>
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 sticky top-24">
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
            {cart.map(item => (
              <div key={item._id} className="flex justify-between text-sm">
                <span>{item.name} <span className="text-gray-500">x{item.qty}</span></span>
                <span className="font-medium">৳{(item.discountPrice || item.price) * item.qty}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-300 pt-3 space-y-2">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>৳{safeSubtotal}</span></div>
            <div className="flex justify-between text-green-700 bg-green-50 p-2 rounded"><span>Shipping (Flat Rate)</span><span className="font-bold">৳{safeShipping}</span></div>
            <div className="flex justify-between font-bold text-xl text-green-800 pt-2 border-t"><span>Total</span><span>৳{finalTotal}</span></div>
          </div>
          <div className="mt-6 bg-white p-3 rounded border text-xs text-gray-500 text-center">Payment Method: Cash on Delivery (COD)</div>
        </div>
      </div>
    </div>
  );
}