import { Outlet, Link } from 'react-router-dom';
import { ShoppingCart, Search, User, Truck, Phone, Menu, Mail } from 'lucide-react';
import { useCart } from '../context/CartContext';
import logo from '../assets/logo.jpeg';

export default function PublicLayout() {
  const { cart, cartTotal } = useCart();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">

      {/* ==============================================================
          1. TOP BAR (Brand Green)
      ============================================================== */}
      <div className="bg-[#006837] text-white py-1.5 px-4 text-xs md:text-sm">
        <div className="container mx-auto flex justify-between items-center">
          {/* Left: Phone */}
          <div className="flex items-center gap-2 font-bold">
            <Phone className="w-4 h-4" /> 01648404365
          </div>
          <div className="flex items-center gap-2 font-bold">
            <Phone className="w-4 h-4" /> 01915045574
          </div>
          <div className="flex items-center gap-2 font-bold">
            <Mail className="w-4 h-4" /> hello@parentsfood.com
          </div>

          {/* Right: Links */}
          <div className="flex items-center gap-4 md:gap-6 font-medium">
            <span className="hidden md:inline text-green-100">Welcome to Parents Food!</span>
            <Link to="/track" className="flex items-center gap-1 hover:text-[#FCEE21] transition">
              <Truck className="w-4 h-4" /> <span className="hidden sm:inline">Track Order</span>
            </Link>
            <Link to="/login" className="flex items-center gap-1 hover:text-[#FCEE21] transition">
              <User className="w-4 h-4" /> Login
            </Link>
          </div>
        </div>
      </div>

      {/* ==============================================================
          2. MAIN HEADER (White)
      ============================================================== */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">

          {/* A. LOGO (Updated to Brand Colors) */}
          <Link to="/" className="flex items-center gap-2 self-start md:self-auto">
            {/* Circle is now Brand Yellow, Text is Brand Green */}
            {/* Real Logo Image */}
            <img src={logo} alt="Parents Food Logo" className="w-12 h-12 object-contain" />
            <div className="leading-tight">
              <h1 className="text-2xl font-bold text-gray-800">Parents Food</h1>
              <p className="text-[10px] text-[#006837] tracking-wider font-bold">PURE ORGANIC PRODUCTS</p>
            </div>
          </Link>

          {/* B. SEARCH BAR */}
          <div className="flex-1 max-w-2xl w-full relative">
            <input
              type="text"
              placeholder="Search Product..."
              className="w-full border-2 border-[#006837] rounded-lg pl-4 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-[#FCEE21] transition"
            />
            <button className="absolute right-0 top-0 h-full bg-[#006837] text-white px-5 rounded-r-md hover:bg-[#004d29] transition">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* C. CART SECTION */}
          <Link to="/cart" className="relative flex items-center gap-3 group self-end md:self-auto">
            <div className="relative p-2 bg-gray-100 rounded-full group-hover:bg-[#f0fdf4] transition">
              <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-[#006837]" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {cart.length}
              </span>
            </div>

            <div className="text-right hidden sm:block">
              <div className="text-xs text-gray-500 font-medium">My Cart</div>
              <div className="text-sm font-bold text-gray-800 group-hover:text-[#006837]">
                ৳{cartTotal}
              </div>
            </div>
          </Link>

        </div>
      </header>

      {/* ==============================================================
          3. NAVIGATION BAR (Darker Green for Contrast)
      ============================================================== */}
      <div className="bg-[#004d29] text-white border-t border-[#00381e] shadow-md">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-6 md:gap-8 text-sm font-bold uppercase tracking-wide py-3 overflow-x-auto no-scrollbar">
            <li className="hover:text-[#FCEE21] cursor-pointer whitespace-nowrap flex items-center gap-2">
              <Menu className="w-4 h-4 md:hidden" /> All Categories
            </li>
            <li className="hover:text-[#FCEE21] cursor-pointer whitespace-nowrap">Ghee & Oil</li>
            <li className="hover:text-[#FCEE21] cursor-pointer whitespace-nowrap">Organic Honey</li>
            <li className="hover:text-[#FCEE21] cursor-pointer whitespace-nowrap">Nuts & Dates</li>
            <li className="hover:text-[#FCEE21] cursor-pointer whitespace-nowrap">Organic Spices</li>
            <li className="hover:text-[#FCEE21] cursor-pointer whitespace-nowrap">Rice & Pulse</li>
            <li className="hover:text-[#FCEE21] cursor-pointer whitespace-nowrap">Super Foods</li>
          </ul>
        </div>
      </div>

      {/* ==============================================================
          MAIN CONTENT AREA
      ============================================================== */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* ==============================================================
          FOOTER (Brand Green)
      ============================================================== */}
      <footer className="bg-[#006837] text-green-50 py-10 mt-auto">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          {/* Col 1 */}
          <div>
            <h3 className="text-[#FCEE21] text-lg font-bold mb-4">Parents Food</h3>
            <p className="opacity-90 leading-relaxed">
              Providing pure, organic, and natural food products directly from the farm to your table.
              We believe in quality and trust.
            </p>
          </div>
          {/* Col 2 */}
          <div>
            <h3 className="text-[#FCEE21] text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 opacity-90">
              <li><Link to="/" className="hover:text-white hover:underline">Home</Link></li>
              <li><Link to="/track" className="hover:text-white hover:underline">Track Order</Link></li>
              <li><Link to="/cart" className="hover:text-white hover:underline">My Cart</Link></li>
              <li><Link to="/login" className="hover:text-white hover:underline">Login / Register</Link></li>
            </ul>
          </div>
          {/* Col 3 */}
          <div>
            <h3 className="text-[#FCEE21] text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 opacity-90">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> 01648404365</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> 01915045574</li>
              <li className="flex items-center gap-2"><Truck className="w-4 h-4" /> Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#004d29] mt-8 pt-6 text-center text-xs opacity-70">
          <p>© 2025 Parents Food. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}