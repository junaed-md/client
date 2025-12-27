import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  TrendingUp, ShoppingBag, AlertTriangle, Package, 
  ArrowRight, DollarSign, Users 
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    pending: 0,
    delivered: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // 1. GET STATS (Use the route that actually exists)
      const statsRes = await axios.get(`${API_URL}/orders/stats`);
      
      // 2. GET RECENT ORDERS (We reuse the main orders API, usually sort logic is backend side but for now we slice here)
      const recentRes = await axios.get(`${API_URL}/orders`);

      setStats({
        revenue: statsRes.data.totalSales || 0,
        orders: statsRes.data.totalOrders || 0,
        pending: statsRes.data.pendingOrders || 0,
        delivered: statsRes.data.deliveredOrders || 0,
        recentOrders: recentRes.data.slice(0, 5) // Take first 5
      });

      setLoading(false);
    } catch (error) {
      console.error("Dashboard Load Error:", error);
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back, Admin</p>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                <DollarSign className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm text-gray-500 font-bold uppercase">Total Revenue</p>
                <h3 className="text-2xl font-bold text-gray-800">৳{stats.revenue.toLocaleString()}</h3>
            </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm text-gray-500 font-bold uppercase">Total Orders</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.orders}</h3>
            </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                <Package className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm text-gray-500 font-bold uppercase">Pending</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.pending}</h3>
            </div>
        </div>

        {/* Delivered Orders */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                <Users className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm text-gray-500 font-bold uppercase">Delivered</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.delivered}</h3>
            </div>
        </div>
      </div>

      {/* --- RECENT ORDERS & SHORTCUTS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Orders Table */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center">
                  <h3 className="font-bold text-gray-800">Recent Orders</h3>
                  <Link to="/admin/orders" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
                    View All <ArrowRight className="w-4 h-4" />
                  </Link>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 text-gray-500">
                          <tr>
                              <th className="p-4">Invoice</th>
                              <th className="p-4">Customer</th>
                              <th className="p-4">Total</th>
                              <th className="p-4">Status</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y">
                          {stats.recentOrders.map(order => (
                              <tr key={order._id} className="hover:bg-gray-50">
                                  <td className="p-4 font-mono">{order.invoiceId || 'N/A'}</td>
                                  <td className="p-4">{order.guestInfo?.name || order.user?.name || 'Guest'}</td>
                                  <td className="p-4 font-bold">৳{order.totalAmount}</td>
                                  <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold 
                                        ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {order.status}
                                    </span>
                                  </td>
                              </tr>
                          ))}
                          {stats.recentOrders.length === 0 && (
                              <tr><td colSpan="4" className="p-6 text-center text-gray-400">No orders yet</td></tr>
                          )}
                      </tbody>
                  </table>
              </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-xl text-white shadow-lg">
                  <h3 className="font-bold text-lg mb-2">Manage Products</h3>
                  <p className="text-green-100 text-sm mb-4">Add new items or update inventory.</p>
                  <Link to="/admin/products/new" className="bg-white text-green-700 px-4 py-2 rounded-lg font-bold text-sm inline-flex items-center gap-2 hover:bg-gray-50 transition">
                      <Package className="w-4 h-4" /> Add Product
                  </Link>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4">Quick Links</h3>
                  <div className="space-y-3">
                      <Link to="/admin/settings" className="block p-3 rounded bg-gray-50 hover:bg-gray-100 transition text-gray-600 text-sm font-medium">
                          ⚙️ System Settings
                      </Link>
                      <Link to="/admin/categories" className="block p-3 rounded bg-gray-50 hover:bg-gray-100 transition text-gray-600 text-sm font-medium">
                          🏷️ Manage Categories
                      </Link>
                      <Link to="/admin/banners" className="block p-3 rounded bg-gray-50 hover:bg-gray-100 transition text-gray-600 text-sm font-medium">
                          🖼️ Change Home Banners
                      </Link>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}