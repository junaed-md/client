import { Outlet, Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function PublicLayout() {
  const { cart, cartTotal } = useCart();

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Top Bar */}
      <div className="bg-green-700 text-white text-xs py-1 px-4 text-center hidden sm:block">
        Welcome to ParentsFood! Call us: 01915045574
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-green-600">
            ParentsFood
          </Link>

          {/* Search Bar (Hidden on mobile for now) */}
          <div className="hidden md:flex flex-1 mx-8 max-w-lg relative">
            <input 
              type="text" 
              placeholder="Search for products..." 
              className="w-full border border-gray-300 rounded-full py-2 px-4 pr-10 focus:outline-none focus:border-green-500"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative group flex items-center gap-2">
              <div className="relative">
                <ShoppingCart className="w-7 h-7 text-gray-700 group-hover:text-green-600 transition" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              </div>
              <div className="hidden sm:block text-right leading-tight">
                <span className="block text-xs text-gray-500">Cart</span>
                <span className="block text-sm font-bold text-gray-800">৳{cartTotal}</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Search (Visible only on mobile) */}
      <div className="md:hidden p-4 bg-white border-t">
        <div className="relative">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:border-green-500 outline-none"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* Page Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 ParentsFood. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}