import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Search, Eye, CheckSquare, Trash2, Truck, Loader2 
} from 'lucide-react';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // BULK STATE
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => { fetchOrders(); }, []);

  // Filter Logic
  useEffect(() => {
    let result = orders;
    if (statusFilter !== 'All') {
        result = result.filter(o => o.status === statusFilter);
    }
    if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        result = result.filter(o => 
            o.customer?.name?.toLowerCase().includes(lower) || 
            o.customer?.phone?.includes(lower) ||
            o.invoiceId?.toLowerCase().includes(lower)
        );
    }
    setFilteredOrders(result);
  }, [searchTerm, statusFilter, orders]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/orders`);
      setOrders(data);
      setLoading(false);
    } catch (error) { console.error("Error fetching orders"); }
  };

  // HANDLERS
  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedIds(filteredOrders.map(o => o._id));
    else setSelectedIds([]);
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(sid => sid !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  const handleBulkSendToSteadfast = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Send ${selectedIds.length} orders to Steadfast?`)) return;

    setIsBulkProcessing(true);
    try {
        const { data } = await axios.post(`${API_URL}/courier/bulk-send`, {
            orderIds: selectedIds,
            courierName: 'steadfast'
        });
        alert(data.message); 
        setSelectedIds([]);  
        fetchOrders();       
    } catch (error) {
        alert("Bulk Send Failed: " + (error.response?.data?.message || error.message));
    } finally {
        setIsBulkProcessing(false);
    }
  };

  const executeBulkAction = async (action, value) => {
    if (!window.confirm(`Are you sure?`)) return;
    setIsBulkProcessing(true);
    try {
        const res = await axios.put(`${API_URL}/orders/bulk-action`, {
            ids: selectedIds, action, value
        });
        alert(res.data.message);
        setSelectedIds([]); 
        fetchOrders(); 
    } catch (error) {
        alert("Bulk action failed");
    } finally {
        setIsBulkProcessing(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Orders...</div>;

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
        <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64"
                    value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <select className="p-2 border rounded-lg bg-white" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="On the Way">On the Way</option>
                <option value="In Courier">In Courier</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
            </select>
        </div>
      </div>

      {selectedIds.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <span className="font-bold text-blue-800 flex items-center gap-2">
                  <CheckSquare className="w-5 h-5" /> {selectedIds.length} Selected
              </span>
              <div className="flex flex-wrap gap-2">
                  <div className="flex bg-white rounded-lg border overflow-hidden">
                      <button onClick={() => executeBulkAction('update_status', 'Processing')} className="px-3 py-2 text-xs font-bold border-r">Processing</button>
                      <button onClick={() => executeBulkAction('update_status', 'Completed')} className="px-3 py-2 text-xs font-bold text-green-700 border-r">Completed</button>
                      <button onClick={() => executeBulkAction('update_status', 'Cancelled')} className="px-3 py-2 text-xs font-bold text-red-600">Cancelled</button>
                  </div>
                  <button onClick={handleBulkSendToSteadfast} disabled={isBulkProcessing} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-bold flex items-center gap-2">
                      {isBulkProcessing ? <Loader2 className="w-4 h-4 animate-spin"/> : <Truck className="w-4 h-4" />} Send to Steadfast
                  </button>
                  <button onClick={() => executeBulkAction('delete', null)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold"><Trash2 className="w-4 h-4" /></button>
              </div>
          </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b">
              <tr>
                <th className="p-4 w-10"><input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === filteredOrders.length && filteredOrders.length > 0} /></th>
                <th className="p-4">Invoice</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Courier</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredOrders.map((order) => (
                <tr key={order._id} className={`hover:bg-gray-50 ${selectedIds.includes(order._id) ? 'bg-blue-50' : ''}`}>
                  <td className="p-4"><input type="checkbox" checked={selectedIds.includes(order._id)} onChange={() => handleSelectOne(order._id)} /></td>
                  <td className="p-4 font-mono font-medium">{order.invoiceId}</td>
                  <td className="p-4">
                    <div className="font-bold text-gray-800">{order.customer?.name}</div>
                    <div className="text-xs text-gray-500">{order.customer?.phone}</div>
                  </td>
                  <td className="p-4 font-bold text-gray-700">৳{order.totalAmount}</td>
                  <td className="p-4"><span className="px-2 py-1 rounded-full text-xs font-bold bg-gray-100">{order.status}</span></td>
                  
                  {/* --- UPDATED COURIER COLUMN --- */}
                  <td className="p-4">
                      {order.courier ? (
                          <div className="text-xs">
                              <span className="font-bold text-teal-700">{order.courier}</span>
                              
                              {/* 1. Clickable Tracking Link */}
                              <div className="mt-1">
                                <a 
                                    href={`https://steadfast.com.bd/t/${order.trackingCode}`} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-blue-600 font-mono font-bold hover:underline block"
                                    title="Click to track"
                                >
                                    {order.trackingCode} ↗
                                </a>
                              </div>

                              {/* 2. Consignment ID (Reference) */}
                              {order.consignmentId && (
                                <div className="text-[10px] text-gray-400 font-mono mt-0.5" title="Consignment ID">
                                    CID: {order.consignmentId}
                                </div>
                              )}
                          </div>
                      ) : (
                          <span className="text-xs text-gray-400">-</span>
                      )}
                  </td>

                  <td className="p-4 text-right">
                    <Link to={`/admin/orders/${order._id}`} className="p-2 bg-gray-100 rounded-lg"><Eye className="w-4 h-4" /></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}