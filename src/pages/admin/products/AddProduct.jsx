import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, UploadCloud } from 'lucide-react';

export default function AddProduct() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    discountPrice: '',
    stock: 50,
    description: '',
    images: '', // Simple URL input for now (File upload comes later)
    isActive: true,
    isHotDeal: false
  });

  // Fetch Categories for the Dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // We need a route for this, or just filter from products (temporary)
        // ideally: const { data } = await axios.get(`${API_URL}/categories`);
        // For now, let's hardcode the ones we migrated or fetch distinct from products
        const { data } = await axios.get(`${API_URL}/products`);
        // Extract unique categories from existing products
        const uniqueCats = [...new Map(data.map(item => [item.category?._id, item.category])).values()].filter(Boolean);
        setCategories(uniqueCats);
      } catch (err) {
        console.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Format data
      const payload = {
        ...formData,
        images: formData.images.split(',').map(url => url.trim()), // Convert comma string to array
      };

      await axios.post(`${API_URL}/products`, payload);
      navigate('/admin/products');
    } catch (error) {
      alert('Error creating product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Product'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column: Basic Info */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">General Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  rows="4"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Media</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
              <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 mb-4">For now, paste Image URLs (comma separated)</p>
              <input 
                type="text" 
                placeholder="https://example.com/image.jpg, /assets/products/honey.png"
                className="w-full p-2 border rounded-lg"
                value={formData.images}
                onChange={e => setFormData({...formData, images: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Category */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Organization</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  className="w-full p-2 border rounded-lg bg-white"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Select Category...</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="hotDeal"
                  checked={formData.isHotDeal}
                  onChange={e => setFormData({...formData, isHotDeal: e.target.checked})}
                  className="w-4 h-4 text-green-600 rounded"
                />
                <label htmlFor="hotDeal" className="text-sm text-gray-700">Set as Hot Deal</label>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Pricing & Stock</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (৳)</label>
                <input 
                  required
                  type="number" 
                  className="w-full p-2 border rounded-lg"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (Optional)</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-lg"
                  value={formData.discountPrice}
                  onChange={e => setFormData({...formData, discountPrice: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-lg"
                  value={formData.stock}
                  onChange={e => setFormData({...formData, stock: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}