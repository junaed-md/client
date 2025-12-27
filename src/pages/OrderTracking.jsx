import { useState } from 'react';
import axios from 'axios';
import { Search, Package, Truck, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function OrderTracking() {
  const [invoiceId, setInvoiceId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!invoiceId) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      // You might need to create this route in your backend if it doesn't exist yet
      // usually: router.get('/invoice/:id', ...)
      const { data } = await axios.get(`${API_URL}/orders/invoice/${invoiceId}`);
      setOrder(data);
    } catch (err) {
      setError("Order not found. Please check your Invoice ID.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to render status steps
  const renderStep = (status, label, icon) => {
    const steps = ['Pending', 'Processing', 'In Courier', 'On the Way', 'Completed'];
    const currentIdx = steps.indexOf(order?.status);
    const stepIdx = steps.indexOf(status);
    
    const isCompleted = currentIdx >= stepIdx;
    const isCurrent = order?.status === status;

    return (
      <div className={`flex flex-col items-center flex-1 ${isCompleted ? 'text-teal-600' : 'text-gray-300'}`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
          ${isCompleted ? 'bg-teal-50 border-teal-600' : 'bg-white border-gray-200'}`}>
          {icon}
        </div>
        <div className="text-xs mt-2 font-semibold text-center">{label}</div>
        {isCurrent && <div className="text-[10px] text-teal-600 font-bold animate-pulse">Current</div>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-teal-700 p-6 text-center text-white">
          <Package className="w-12 h-12 mx-auto mb-2 opacity-80" />
          <h2 className="text-2xl font-bold">Track Your Order</h2>
          <p className="text-teal-100 text-sm">Enter your Invoice ID to check status</p>
        </div>

        {/* Search Box */}
        <div className="p-6">
          <form onSubmit={handleTrack} className="relative">
            <input 
              type="text" 
              placeholder="e.g. INV-2025001"
              value={invoiceId}
              onChange={(e) => setInvoiceId(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition"
            />
            <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <button 
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bg-teal-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-teal-700 disabled:opacity-50"
            >
              {loading ? '...' : 'Track'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
        </div>

        {/* Result Area */}
        {order && (
          <div className="border-t border-gray-100">
            {/* Status Steps */}
            <div className="p-6 flex justify-between relative">
              {/* Connector Line */}
              <div className="absolute top-10 left-10 right-10 h-0.5 bg-gray-200 -z-10" />
              
              {renderStep('Pending', 'Placed', <Clock className="w-5 h-5"/>)}
              {renderStep('Processing', 'Packed', <Package className="w-5 h-5"/>)}
              {renderStep('In Courier', 'Shipped', <Truck className="w-5 h-5"/>)}
              {renderStep('Completed', 'Delivered', <CheckCircle className="w-5 h-5"/>)}
            </div>

            {/* Details Card */}
            <div className="bg-gray-50 p-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Invoice:</span>
                <span className="font-mono font-bold text-gray-800">{order.invoiceId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Customer:</span>
                <span className="font-bold text-gray-800">{order.customer?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Amount:</span>
                <span className="font-bold text-teal-700">৳{order.totalAmount}</span>
              </div>
              
              {/* Courier Info */}
              {order.trackingCode && (
                <div className="mt-4 p-3 bg-white border border-teal-100 rounded-lg">
                  <div className="text-xs text-teal-600 font-bold uppercase mb-1">Shipping Info</div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-700">{order.courier}</span>
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {order.trackingCode}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}