import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  ShoppingBag, Users, DollarSign, Package, 
  Clock, Truck, CheckCircle, XCircle, Activity 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/stats`);
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading stats");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Dashboard...</div>;

  return (
    <div className="space-y-8">
      
      {/* 1. TOP OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Total Sales" 
          value={`৳${stats.overview.totalSales}`} 
          icon={DollarSign} 
          color="bg-blue-50 text-blue-600" 
        />
        <StatCard 
          title="Total Orders" 
          value={stats.overview.totalOrders} 
          icon={ShoppingBag} 
          color="bg-purple-50 text-purple-600" 
        />
        <StatCard 
          title="Today's Orders" 
          value={stats.overview.todayOrders} 
          icon={Activity} 
          color="bg-orange-50 text-orange-600" 
        />
        <StatCard 
          title="Total Products" 
          value={stats.overview.totalProducts} 
          icon={Package} 
          color="bg-green-50 text-green-600" 
        />
      </div>

      {/* 2. ORDER STATUS SUMMARY */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">Order Status Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatusBadge count={stats.orderStatus.pending} label="Pending" icon={Clock} color="text-yellow-600 bg-yellow-50" />
            <StatusBadge count={stats.orderStatus.processing} label="Processing" icon={Activity} color="text-blue-600 bg-blue-50" />
            <StatusBadge count={stats.orderStatus.courier} label="In Courier" icon={Truck} color="text-purple-600 bg-purple-50" />
            <StatusBadge count={stats.orderStatus.completed} label="Completed" icon={CheckCircle} color="text-green-600 bg-green-50" />
            <StatusBadge count={stats.orderStatus.cancelled} label="Cancelled" icon={XCircle} color="text-red-600 bg-red-50" />
        </div>
      </div>

      {/* 3. LATEST ORDERS TABLE */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">Latest Orders</h3>
            <Link to="/admin/orders" className="text-sm text-green-600 hover:underline">View All</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="p-3">Invoice</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {stats.recentOrders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="p-3 font-medium">{order.invoiceId}</td>
                  <td className="p-3">
                    <div className="font-semibold">{order.customer.name}</div>
                    <div className="text-xs text-gray-500">{order.customer.phone}</div>
                  </td>
                  <td className="p-3">৳{order.totalAmount}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                        {order.status}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

// --- Helper Components ---
function StatCard({ title, value, icon: Icon, color }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`p-3 rounded-full ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            </div>
        </div>
    );
}

function StatusBadge({ count, label, icon: Icon, color }) {
    return (
        <div className={`flex flex-col items-center justify-center p-4 rounded-xl border ${color} border-opacity-20`}>
            <Icon className={`w-6 h-6 mb-2 ${color.split(' ')[0]}`} />
            <span className="text-2xl font-bold text-gray-800">{count}</span>
            <span className="text-xs text-gray-600 uppercase tracking-wide">{label}</span>
        </div>
    );
}

function getStatusColor(status) {
    switch(status) {
        case 'Pending': return 'bg-yellow-100 text-yellow-800';
        case 'Processing': return 'bg-blue-100 text-blue-800';
        case 'On the Way': 
        case 'In Courier': return 'bg-purple-100 text-purple-800';
        case 'Completed': return 'bg-green-100 text-green-800';
        case 'Cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}