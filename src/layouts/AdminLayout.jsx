import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Layers,
  ImageIcon,
  Settings,
  LogOut,      // <--- ADD THIS
  Menu,        // (Ensure you have this too if you use the mobile menu button)
  X            // (Ensure you have this too for closing the menu)
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: Layers, label: 'Categories & Brands', path: '/admin/categories' },
    { icon: ImageIcon, label: 'Banners', path: '/admin/banners' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 1. ADDED 'print:hidden' HERE 
          This forces the sidebar to vanish when printing 
      */}
      <aside className="w-64 bg-white shadow-md flex flex-col print:hidden">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-green-600">ParentsFood</h1>
          <p className="text-xs text-gray-500">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                  ? 'bg-green-50 text-green-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area - Expands to full width when printing */}
      <main className="flex-1 overflow-auto p-8 print:p-0 print:overflow-visible">
        <Outlet />
      </main>
    </div>
  );
}