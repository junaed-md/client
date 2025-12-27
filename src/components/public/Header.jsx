import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Truck, Phone, Menu } from 'lucide-react';
import { useCart } from '../../context/CartContext'; // Assuming you have this

export default function Header() {
  const { cartItems } = useCart(); // Get cart count if available

  return (
    <div className="w-full">
      
      {/* 1. TOP BAR (Dark Blue) */}
      <div className="bg-[#1e3a8a] text-white py-1.5 px-4 text-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold">
            <Phone className="w-4 h-4" /> 01743839807
          </div>
          <div className="flex items-center gap-6 text-xs md:text-sm font-medium">
            <span className="hidden md:inline">Welcome to our Organic Shop!</span>
            <Link to="/track" className="flex items-center gap-1 hover:text-green-300 transition">
              <Truck className="w-4 h-4" /> Track Order
            </Link>
            <Link to="/login" className="flex items-center gap-1 hover:text-green-300 transition">
              <User className="w-4 h-4" /> Login / Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (White - Logo & Search) */}
      <div className="bg-white py-4 border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              P
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 leading-none">ParentsFood</h1>
              <p className="text-[10px] text-gray-500 tracking-wider">PURE ORGANIC PRODUCTS</p>
            </div>
          </Link>

          {/* Search Bar (Centered & Wide) */}
          <div className="flex-1 max-w-2xl w-full relative">
            <input 
              type="text" 
              placeholder="Search Product..." 
              className="w-full border-2 border-green-600 rounded-lg pl-4 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
            />
            <button className="absolute right-0 top-0 h-full bg-green-600 text-white px-5 rounded-r-md hover:bg-green-700 transition">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Icon */}
          <Link to="/cart" className="relative hidden md:flex items-center gap-2 group">
            <div className="bg-gray-100 p-2 rounded-full group-hover:bg-green-50 transition">
              <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-green-700" />
            </div>
            {cartItems?.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {cartItems.length}
              </span>
            )}
            <div className="text-xs font-semibold text-gray-600 group-hover:text-green-700">
              My Cart
            </div>
          </Link>
        </div>
      </div>

      {/* 3. NAVIGATION BAR (Green) */}
      <div className="bg-[#166534] text-white hidden md:block border-t border-green-800">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center gap-8 text-sm font-bold uppercase tracking-wide py-3 overflow-x-auto">
            <li className="hover:text-yellow-300 cursor-pointer whitespace-nowrap">Ghee & Oil</li>
            <li className="hover:text-yellow-300 cursor-pointer whitespace-nowrap">Organic Honey</li>
            <li className="hover:text-yellow-300 cursor-pointer whitespace-nowrap">Nuts & Dates</li>
            <li className="hover:text-yellow-300 cursor-pointer whitespace-nowrap">Organic Spices</li>
            <li className="hover:text-yellow-300 cursor-pointer whitespace-nowrap">Rice & Pulse</li>
            <li className="hover:text-yellow-300 cursor-pointer whitespace-nowrap">Super Foods</li>
            <li className="hover:text-yellow-300 cursor-pointer whitespace-nowrap">Sweeteners</li>
          </ul>
        </div>
      </div>

    </div>
  );
}