import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Plus, Edit, Trash2, Search, 
  Package, DollarSign, AlertCircle 
} from 'lucide-react';

export default function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const SERVER_URL = 'http://localhost:5000'; // For local images if needed

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/products`);
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API_URL}/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      alert("Failed to delete product");
    }
  };

  // Helper to get image URL (handles external links vs local uploads)
  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/50";
    if (path.startsWith('http')) return path; 
    // If it's a local upload, no server prefix needed if serving from public
    // But if you prefer absolute paths:
    return path; 
  };

  // Filter logic
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center">Loading Products...</div>;

  return (
    <div className="space-y-6">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-500 text-sm">Manage your catalog ({products.length} total)</p>
        </div>
        <button 
          onClick={() => navigate('/admin/products/new')} 
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-sm transition"
        >
          <Plus className="w-5 h-5" /> Add Product
        </button>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
        <Search className="text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search products by name..." 
          className="flex-1 outline-none text-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
              <tr>
                <th className="p-4 border-b">Product</th>
                <th className="p-4 border-b">Category</th>
                <th className="p-4 border-b text-right">Cost (৳)</th>
                <th className="p-4 border-b text-right">Price (৳)</th>
                <th className="p-4 border-b text-center">Stock</th>
                <th className="p-4 border-b text-center">Status</th>
                <th className="p-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition">
                  
                  {/* 1. PRODUCT INFO */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg border bg-gray-100 overflow-hidden flex-shrink-0">
                        <img 
                          src={getImageUrl(product.images?.[0])} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.brand?.name || 'No Brand'}</p>
                      </div>
                    </div>
                  </td>

                  {/* 2. CATEGORY */}
                  <td className="p-4 text-sm text-gray-600">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                      {product.category?.name || 'Uncategorized'}
                    </span>
                  </td>

                  {/* 3. COST PRICE (New) */}
                  <td className="p-4 text-right font-mono text-sm text-gray-500">
                    {product.costPrice ? `৳${product.costPrice}` : '-'}
                  </td>

                  {/* 4. SELLING PRICE */}
                  <td className="p-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-gray-800">৳{product.regularPrice || product.price || 0}</span>
                      {product.discountPrice > 0 && (
                        <span className="text-xs text-red-500 line-through">
                           ৳{product.discountPrice} OFF
                        </span>
                      )}
                    </div>
                  </td>

                  {/* 5. STOCK */}
                  <td className="p-4 text-center">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold
                      ${(product.stockQuantity || product.stock) > 0 ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-600'}`}>
                      <Package className="w-3 h-3" />
                      {product.stockQuantity ?? product.stock ?? 0}
                    </div>
                  </td>

                  {/* 6. STATUS */}
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold 
                      ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {product.isActive ? 'Active' : 'Draft'}
                    </span>
                  </td>

                  {/* 7. ACTIONS */}
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <Link 
                        to={`/admin/products/edit/${product._id}`} 
                        className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(product._id)} 
                        className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
              
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No products found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}