import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Globe, Truck, Mail, MessageSquare, CreditCard, 
  ShieldAlert, BarChart3, FileText, 
  Settings as SettingsIcon, ArrowRight, ArrowLeft, Save
} from 'lucide-react';

export default function Settings() {
  const [activeSection, setActiveSection] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Store all settings in one state
  const [formData, setFormData] = useState({
    // General
    siteName: '', supportPhone: '', shippingAllBangladesh: '', 
    // Pixel & Analytics
    facebookPixelId: '', googleTagManagerId: '',
    // Courier
    steadfastApiKey: '', steadfastSecretKey: '',
    pathaoClientId: '', pathaoClientSecret: '', pathaoUsername: '', pathaoPassword: '', pathaoStoreId: '',
    // SMS
    smsApiKey: '', smsSenderId: '',
    // SMTP
    smtpHost: '', smtpPort: '', smtpUser: '', smtpPass: ''
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/settings`);
      if(data) setFormData(data);
      setLoading(false);
    } catch (error) { console.error("Error loading settings"); }
  };

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${API_URL}/settings`, formData);
      alert("Settings Saved Successfully!");
    } catch (error) { alert("Failed to save settings"); } 
    finally { setSaving(false); }
  };

  // --- MODULE LIST ---
  const settingsModules = [
    { id: 'general', title: 'General Setting', desc: 'Site name, phone & basics', icon: <SettingsIcon className="w-6 h-6 text-purple-500" /> },
    { id: 'stock', title: 'Stock Report', desc: 'Inventory value & low stock', icon: <BarChart3 className="w-6 h-6 text-violet-500" /> },
    { id: 'order_reports', title: 'Order Reports', desc: 'Sales analytics & revenue', icon: <FileText className="w-6 h-6 text-pink-500" /> },
    { id: 'courier', title: 'Courier API', desc: 'Pathao & Steadfast integration', icon: <Truck className="w-6 h-6 text-orange-500" /> },
    { id: 'shipping', title: 'Shipping Charge', desc: 'Set delivery fees', icon: <Truck className="w-6 h-6 text-green-500" /> },
    { id: 'sms', title: 'SMS Gateway', desc: 'BulkSMS / GreenWeb setup', icon: <MessageSquare className="w-6 h-6 text-indigo-500" /> },
    { id: 'smtp', title: 'Mail SMTP', desc: 'Email server configuration', icon: <Mail className="w-6 h-6 text-teal-500" /> },
    { id: 'pixel', title: 'Pixel & Analytics', desc: 'Facebook Pixel & GTM', icon: <Globe className="w-6 h-6 text-blue-500" /> },
    // Placeholders
    { id: 'payment', title: 'Payment Gateway', desc: 'bKash / SSLCommerz (Coming Soon)', icon: <CreditCard className="w-6 h-6 text-emerald-500" /> },
    { id: 'fraud', title: 'Fraud API', desc: 'Detect fake orders (Coming Soon)', icon: <ShieldAlert className="w-6 h-6 text-red-500" /> },
  ];

  if (loading) return <div className="p-10 text-center">Loading Configuration...</div>;

  // --- VIEW 1: ACTIVE SECTION (FORM or REPORT) ---
  if (activeSection) {
    return (
      <div className="max-w-6xl mx-auto pb-10">
        <button 
          onClick={() => setActiveSection(null)} 
          className="flex items-center gap-2 text-gray-500 hover:text-green-600 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    {activeSection.icon} {activeSection.title}
                </h2>
            </div>
            
            <div className="p-8">
                {/* REPORTS (No Save Button Needed) */}
                {activeSection.id === 'stock' && <StockReportView API_URL={API_URL} />}
                {activeSection.id === 'order_reports' && <OrderReportView API_URL={API_URL} />}

                {/* FORMS (Need Save Button) */}
                {['general', 'shipping', 'courier', 'pixel', 'sms', 'smtp'].includes(activeSection.id) && (
                    <form onSubmit={handleSave} className="space-y-6">
                        {activeSection.id === 'general' && <GeneralForm d={formData} h={handleChange} />}
                        {activeSection.id === 'shipping' && <ShippingForm d={formData} h={handleChange} />}
                        {activeSection.id === 'courier' && <CourierForm d={formData} h={handleChange} />}
                        {activeSection.id === 'pixel' && <PixelForm d={formData} h={handleChange} />}
                        {activeSection.id === 'sms' && <SMSForm d={formData} h={handleChange} />}
                        {activeSection.id === 'smtp' && <SMTPForm d={formData} h={handleChange} />}

                        <div className="pt-6 border-t flex justify-end">
                            <button type="submit" disabled={saving} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-green-200">
                                <Save className="w-5 h-5" /> {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
      </div>
    );
  }

  // --- VIEW 2: MAIN GRID DASHBOARD ---
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
         <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsModules.map((module) => (
            <div key={module.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition group">
                <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition">
                        {module.icon}
                    </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{module.title}</h3>
                <p className="text-sm text-gray-500 mb-6">{module.desc}</p>
                
                <button 
                    onClick={() => setActiveSection(module)}
                    className="text-blue-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                >
                    {module.id === 'payment' || module.id === 'fraud' ? 'Coming Soon' : 'Update'} <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        ))}
      </div>
    </div>
  );
}

// =================================================================
// 1. REPORT COMPONENTS
// =================================================================

function StockReportView({ API_URL }) {
    const [data, setData] = useState(null);
    useEffect(() => {
        axios.get(`${API_URL}/reports/stock`).then(res => setData(res.data));
    }, [API_URL]);

    if(!data) return <div>Loading Inventory Data...</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <h4 className="text-gray-500 text-xs font-bold uppercase">Total Stock Value</h4>
                    <p className="text-2xl font-bold text-blue-700">৳{data.totalValue.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg">
                    <h4 className="text-gray-500 text-xs font-bold uppercase">Total Products</h4>
                    <p className="text-2xl font-bold text-purple-700">{data.allProducts.length} Items</p>
                </div>
                <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                    <h4 className="text-gray-500 text-xs font-bold uppercase">Low Stock Alerts</h4>
                    <p className="text-2xl font-bold text-red-600">{data.lowStockItems.length} Products</p>
                </div>
            </div>
            {data.lowStockItems.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                    <div className="bg-red-50 p-3 border-b border-red-100 flex items-center gap-2 text-red-700 font-bold">
                        <ShieldAlert className="w-4 h-4" /> Low Stock (Restock Needed)
                    </div>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500"><tr><th className="p-3">Product</th><th className="p-3">Stock</th><th className="p-3">Price</th></tr></thead>
                        <tbody className="divide-y">{data.lowStockItems.map(p => (<tr key={p._id}><td className="p-3">{p.name}</td><td className="p-3 text-red-600 font-bold">{p.stock}</td><td className="p-3">৳{p.price}</td></tr>))}</tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function OrderReportView({ API_URL }) {
    const [data, setData] = useState(null);
    const [range, setRange] = useState('all');
    
    const fetchReport = (type) => {
        const end = new Date(); const start = new Date();
        if(type === 'today') start.setHours(0,0,0,0);
        if(type === 'week') start.setDate(start.getDate() - 7);
        if(type === 'month') start.setDate(start.getDate() - 30);
        const q = type === 'all' ? '' : `?startDate=${start.toISOString()}&endDate=${end.toISOString()}`;
        axios.get(`${API_URL}/reports/orders${q}`).then(res => setData(res.data));
    };
    useEffect(() => { fetchReport('all'); }, []);

    if(!data) return <div>Generating Report...</div>;

    return (
        <div className="space-y-6">
            <div className="flex gap-2">
                {['all', 'today', 'week', 'month'].map(t => (
                    <button key={t} onClick={() => { setRange(t); fetchReport(t); }} className={`px-4 py-2 rounded-lg text-sm font-bold capitalize ${range === t ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{t}</button>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                    <h4 className="text-gray-500 text-xs font-bold uppercase">Revenue</h4>
                    <p className="text-2xl font-bold text-green-700">৳{data.financials.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
                    <h4 className="text-gray-500 text-xs font-bold uppercase">Orders</h4>
                    <p className="text-2xl font-bold text-orange-700">{data.financials.totalOrders}</p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="text-gray-500 text-xs font-bold uppercase">Avg Order Value</h4>
                    <p className="text-2xl font-bold text-gray-700">৳{data.financials.averageOrderValue}</p>
                </div>
            </div>
        </div>
    );
}

// =================================================================
// 2. FORM COMPONENTS
// =================================================================

function Input({ label, name, val, onChange, type="text" }) {
    return (
        <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">{label}</label>
            <input type={type} name={name} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-gray-50 focus:bg-white" value={val} onChange={onChange} />
        </div>
    );
}

const GeneralForm = ({ d, h }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Website Name" name="siteName" val={d.siteName} onChange={h} />
        <Input label="Support Phone" name="supportPhone" val={d.supportPhone} onChange={h} />
    </div>
);

const ShippingForm = ({ d, h }) => (
    <div>
        <Input label="Flat Shipping Rate (All Bangladesh)" name="shippingAllBangladesh" val={d.shippingAllBangladesh} onChange={h} />
        <p className="text-xs text-gray-400 mt-2">Applies to all orders.</p>
    </div>
);

const CourierForm = ({ d, h }) => (
    <div className="space-y-8">
        <div className="p-4 bg-gray-50 rounded border">
            <h4 className="font-bold text-gray-700 mb-4">Steadfast Courier</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="API Key" name="steadfastApiKey" val={d.steadfastApiKey} onChange={h} />
                <Input label="Secret Key" name="steadfastSecretKey" val={d.steadfastSecretKey} onChange={h} />
            </div>
        </div>
        <div className="p-4 bg-gray-50 rounded border">
            <h4 className="font-bold text-gray-700 mb-4">Pathao Courier</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Client ID" name="pathaoClientId" val={d.pathaoClientId} onChange={h} />
                <Input label="Client Secret" name="pathaoClientSecret" val={d.pathaoClientSecret} onChange={h} />
                <Input label="Username" name="pathaoUsername" val={d.pathaoUsername} onChange={h} />
                <Input label="Password" name="pathaoPassword" type="password" val={d.pathaoPassword} onChange={h} />
                <Input label="Store ID" name="pathaoStoreId" val={d.pathaoStoreId} onChange={h} />
            </div>
        </div>
    </div>
);

const PixelForm = ({ d, h }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Facebook Pixel ID" name="facebookPixelId" val={d.facebookPixelId} onChange={h} />
        <Input label="Google Tag Manager ID" name="googleTagManagerId" val={d.googleTagManagerId} onChange={h} />
    </div>
);

const SMSForm = ({ d, h }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="SMS API Key" name="smsApiKey" val={d.smsApiKey} onChange={h} />
        <Input label="Sender ID" name="smsSenderId" val={d.smsSenderId} onChange={h} />
    </div>
);

const SMTPForm = ({ d, h }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="SMTP Host" name="smtpHost" val={d.smtpHost} onChange={h} />
        <Input label="SMTP Port" name="smtpPort" val={d.smtpPort} onChange={h} />
        <Input label="SMTP User" name="smtpUser" val={d.smtpUser} onChange={h} />
        <Input label="SMTP Password" name="smtpPass" type="password" val={d.smtpPass} onChange={h} />
    </div>
);