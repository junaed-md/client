import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import ProductDetails from './pages/public/ProductDetails';
import Cart from './pages/public/Cart';
import Checkout from './pages/public/Checkout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register'; // (Optional if you have it)

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import OrderList from './pages/admin/orders/OrderList';
import OrderDetails from './pages/admin/orders/OrderDetails';
import ProductList from './pages/admin/products/ProductList'; // (We will build this next)
import ProductForm from './pages/admin/products/ProductForm'; // (We will build this next)
import CategoryBrand from './pages/admin/products/CategoryBrand'; // <-- NEW PAGE
import Banners from './pages/admin/banners/Banners';
import Settings from './pages/admin/settings/Settings';

// --- PROTECTED ROUTE COMPONENT ---
// This ensures only logged-in Admins can access /admin routes
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/login" />;
  
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      {/* 1. Global Providers */}
      <AuthProvider>
        <CartProvider>
          
          {/* Toast Notifications (Optional but recommended) */}
          <Toaster position="top-center" />

          <Routes>
            
            {/* -------------------------------------------------------
               PUBLIC ROUTES (Accessible by everyone)
            ------------------------------------------------------- */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

            {/* -------------------------------------------------------
               ADMIN ROUTES (Protected)
            ------------------------------------------------------- */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }>
              {/* Dashboard */}
              <Route index element={<Dashboard />} />
              
              {/* Order Management */}
              <Route path="orders" element={<OrderList />} />
              <Route path="orders/:id" element={<OrderDetails />} />

              {/* Product Management */}
              <Route path="products" element={<ProductList />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/edit/:id" element={<ProductForm />} />
              
              {/* NEW: Categories & Brands */}
              <Route path="categories" element={<CategoryBrand />} />

              {/* Marketing & Config */}
              <Route path="banners" element={<Banners />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<div className="text-center mt-20">404 - Page Not Found</div>} />

          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}