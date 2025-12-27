import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, Printer, Truck, Save, X, Plus, Trash2,
  MapPin, User, Edit3, Package, CheckCircle // <--- ADD THIS
} from 'lucide-react';

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // State
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [allProducts, setAllProducts] = useState([]); 

  useEffect(() => { fetchOrder(); }, [id]);

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/orders/${id}`);
      setOrder(data);
      setEditForm(JSON.parse(JSON.stringify(data))); 
      setLoading(false);
    } catch (error) {
      navigate('/admin/orders');
    }
  };

  const enableEditMode = async () => {
    setIsEditing(true);
    if(allProducts.length === 0) {
        try {
            const { data } = await axios.get(`${API_URL}/products`);
            setAllProducts(data);
        } catch(e) { console.error("Could not load products"); }
    }
  };

  // --- ACTIONS ---

  // 1. Status Update (Quick Action)
  const handleStatusChange = async (newStatus) => {
    if(!window.confirm(`Change status to ${newStatus}?`)) return;
    setUpdating(true);
    try {
      await axios.put(`${API_URL}/orders/${id}`, { status: newStatus });
      setOrder({ ...order, status: newStatus });
      setEditForm({ ...editForm, status: newStatus }); // Sync edit form
      alert("Status Updated!");
    } catch (error) {
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  // 2. Send to Courier
  const sendToCourier = async (courierName) => {
    if(!window.confirm(`Send this order to ${courierName}?`)) return;
    setUpdating(true);
    try {
      const res = await axios.post(`${API_URL}/courier/send/${courierName}/${id}`);
      alert(`Success! Tracking Code: ${res.data.trackingCode}`);
      fetchOrder(); // Refresh to show tracking info
    } catch (error) {
      alert(`Failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  // 3. Save Edited Order
  const saveChanges = async () => {
    const newSubTotal = editForm.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const newTotal = newSubTotal + Number(editForm.shippingCost);

    const finalPayload = {
        ...editForm,
        subTotal: newSubTotal,
        totalAmount: newTotal
    };

    setUpdating(true);
    try {
        const { data } = await axios.put(`${API_URL}/orders/${id}`, finalPayload);
        setOrder(data);
        setEditForm(data);
        setIsEditing(false);
        alert("Order Updated Successfully!");
    } catch (error) {
        alert("Failed to save changes");
    } finally {
        setUpdating(false);
    }
  };

  // --- EDIT FORM HANDLERS ---
  const handleCustomerChange = (e) => setEditForm({...editForm, customer: { ...editForm.customer, [e.target.name]: e.target.value }});
  const handleItemChange = (index, field, value) => {
    const newItems = [...editForm.items];
    newItems[index][field] = Number(value);
    setEditForm({ ...editForm, items: newItems });
  };
  const handleRemoveItem = (index) => {
    const newItems = editForm.items.filter((_, i) => i !== index);
    setEditForm({ ...editForm, items: newItems });
  };
  const handleAddItem = (productId) => {
    if(!productId) return;
    const product = allProducts.find(p => p._id === productId);
    const existing = editForm.items.find(i => i.productId === productId);
    if(existing) { alert("Item already in order."); return; }
    
    setEditForm({ 
        ...editForm, 
        items: [...editForm.items, { productId: product._id, name: product.name, quantity: 1, price: product.discountPrice || product.price }] 
    });
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      
      {/* -----------------------------------------------------------
          HEADER ACTIONS (Back, Status, Edit, Print)
      ----------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 print:hidden">
        <button onClick={() => navigate('/admin/orders')} className="flex items-center gap-2 text-gray-500 hover:text-green-600">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        
        <div className="flex gap-3 items-center flex-wrap">
            {isEditing ? (
                <>
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold flex items-center gap-2">
                        <X className="w-4 h-4"/> Cancel
                    </button>
                    <button onClick={saveChanges} disabled={updating} className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 flex items-center gap-2">
                        <Save className="w-4 h-4"/> {updating ? 'Saving...' : 'Save Changes'}
                    </button>
                </>
            ) : (
                <>
                    {/* STATUS DROPDOWN (Restored!) */}
                    <select 
                        className="px-4 py-2 border rounded-lg bg-white font-bold text-gray-700 cursor-pointer focus:ring-2 focus:ring-green-500 outline-none"
                        value={order.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={updating}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="On the Way">On the Way</option>
                        <option value="In Courier">In Courier</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>

                    <button onClick={enableEditMode} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-bold border border-blue-200 flex items-center gap-2">
                        <Edit3 className="w-4 h-4" /> Edit Order
                    </button>
                    <button onClick={() => window.print()} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2">
                        <Printer className="w-4 h-4" /> Print
                    </button>
                </>
            )}
        </div>
      </div>

      {/* -----------------------------------------------------------
          COURIER MANAGEMENT (Restored!)
          Only visible if NOT editing and NOT cancelled
      ----------------------------------------------------------- */}
      {!isEditing && order.status !== 'Cancelled' && (
          <div className="bg-white border border-blue-100 p-6 rounded-xl mb-8 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm print:hidden">
              <div>
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-blue-600" /> Courier Management
                  </h3>
                  {order.trackingCode ? (
                      <p className="text-sm text-green-600 mt-1 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Shipped via <strong>{order.courier}</strong> 
                          <span className="text-gray-400">|</span> 
                          Tracking: <span className="font-mono bg-gray-100 px-2 rounded">{order.trackingCode}</span>
                      </p>
                  ) : (
                      <p className="text-sm text-gray-500 mt-1">Ready to ship? Send to courier instantly.</p>
                  )}
              </div>
              
              {!order.trackingCode && (
                  <div className="flex gap-3">
                      <button onClick={() => sendToCourier('pathao')} disabled={updating} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-sm transition text-sm">
                          Send to Pathao
                      </button>
                      <button onClick={() => sendToCourier('steadfast')} disabled={updating} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-sm transition text-sm">
                          Send to Steadfast
                      </button>
                  </div>
              )}
          </div>
      )}

      {/* -----------------------------------------------------------
          MAIN INVOICE AREA (Editable)
      ----------------------------------------------------------- */}
      <div className={`bg-white p-8 rounded-xl shadow-sm border ${isEditing ? 'border-blue-300 ring-2 ring-blue-50' : 'border-gray-100'}`} id="invoice">
        
        {/* Invoice Header */}
        <div className="flex justify-between border-b pb-6 mb-6">
            <div>
                <h1 className="text-2xl font-bold text-green-700">ParentsFood</h1>
                <p className="text-sm text-gray-500">Invoice #{order.invoiceId}</p>
            </div>
            <div className="text-right">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mb-2
                    ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {order.status}
                </div>
                <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className={`p-4 rounded-lg ${isEditing ? 'bg-white' : 'bg-gray-50'}`}>
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" /> Customer Info
                </h3>
                <div className="space-y-3">
                    {isEditing ? (
                        <>
                            <input name="name" value={editForm.customer.name} onChange={handleCustomerChange} className="w-full p-2 border rounded" placeholder="Name" />
                            <input name="phone" value={editForm.customer.phone} onChange={handleCustomerChange} className="w-full p-2 border rounded" placeholder="Phone" />
                            <textarea name="address" value={editForm.customer.address} onChange={handleCustomerChange} className="w-full p-2 border rounded" placeholder="Address" rows="2" />
                        </>
                    ) : (
                        <>
                            <p className="font-bold text-gray-800">{order.customer.name}</p>
                            <p className="text-gray-600">{order.customer.phone}</p>
                            <p className="text-gray-600">{order.customer.address}</p>
                        </>
                    )}
                </div>
            </div>
            
            {/* Upsell Box (Only in Edit Mode) */}
            {isEditing && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h3 className="text-xs font-bold text-blue-600 uppercase mb-3 flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Item (Upsell)
                    </h3>
                    <select className="w-full p-2 border rounded bg-white" onChange={(e) => { handleAddItem(e.target.value); e.target.value = ""; }}>
                        <option value="">Select Product...</option>
                        {allProducts.map(p => (<option key={p._id} value={p._id}>{p.name} (Stock: {p.stock})</option>))}
                    </select>
                </div>
            )}
        </div>

        {/* Items Table */}
        <table className="w-full text-left mb-6">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                <tr>
                    <th className="p-3">Item</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-right">Total</th>
                    {isEditing && <th className="p-3 w-10"></th>}
                </tr>
            </thead>
            <tbody className="divide-y">
                {(isEditing ? editForm.items : order.items).map((item, index) => (
                    <tr key={index}>
                        <td className="p-3 font-medium text-gray-700">{item.name}</td>
                        <td className="p-3 text-center">
                            {isEditing ? <input type="number" min="1" className="w-16 p-1 border rounded text-center" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}/> : `x${item.quantity}`}
                        </td>
                        <td className="p-3 text-right">
                            {isEditing ? <input type="number" className="w-24 p-1 border rounded text-right" value={item.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)}/> : `৳${item.price}`}
                        </td>
                        <td className="p-3 text-right font-bold">৳{item.price * item.quantity}</td>
                        {isEditing && (
                            <td className="p-3 text-center">
                                <button onClick={() => handleRemoveItem(index)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 className="w-4 h-4" /></button>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end border-t pt-4">
            <div className="w-64 space-y-2">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>৳{isEditing ? editForm.items.reduce((a, i) => a + (i.price * i.quantity), 0) : order.subTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600 items-center">
                    <span>Shipping</span>
                    {isEditing ? (
                        <input type="number" className="w-20 p-1 border rounded text-right" value={editForm.shippingCost} onChange={(e) => setEditForm({...editForm, shippingCost: Number(e.target.value)})}/>
                    ) : (
                        <span>৳{order.shippingCost}</span>
                    )}
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t">
                    <span>Total</span>
                    <span>৳{isEditing ? editForm.items.reduce((a, i) => a + (i.price * i.quantity), 0) + Number(editForm.shippingCost) : order.totalAmount}</span>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}