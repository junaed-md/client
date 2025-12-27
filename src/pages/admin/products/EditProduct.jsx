import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    discountPrice: '',
    stock: '',
    description: '',
    images: '', 
    isActive: true,
    isHotDeal: false
  });

  // Fetch Product & Categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, allProductsRes] = await Promise.all([
          axios.get(`${API_URL}/products/${id}`),
          axios.get(`${API_URL}/products`) // Fetching all to extract categories
        ]);

        const p = productRes.data;
        
        // Populate Form
        setFormData({
            name: p.name,
            category: typeof p.category === 'object' ? p.category?._id : p.category, 
            price: p.price,
            discountPrice: p.discountPrice || '',
            stock: p.stock,
            description: p.description || '',
            images: Array.isArray(p.images) ? p.images.join(', ') : p.images,
            isActive: p.isActive,
            isHotDeal: p.isHotDeal
        });

        // Extract Categories
        const uniqueCats = [...new Map(allProductsRes.data.map(item => [item.category?._id, item.category])).values()].filter(Boolean);
        setCategories(uniqueCats);
        
        setLoading(false);
      } catch (err) {
        alert("Error loading product");
        navigate('/admin/products');
      }
    };
    fetchData();
  }, [id, API_URL, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        images: formData.images.split(',').map(url => url.trim()),
      };

      await axios.put(`${API_URL}/products/${id}`, payload);
      alert("Product Updated!");
      navigate('/admin/products');
    } catch (error) {
      alert('Error updating product: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Product...</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
        </div>
        <button 
          type="submit" 
          disabled={saving}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Update Product'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">General Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full p-2 border rounded-lg"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  rows="4"
                  className="w-full p-2 border rounded-lg"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="font-semibold text-gray-800 mb-4">Media</h3>
             <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (comma separated)</label>
             <input 
                type="text" 
                className="w-full p-2 border rounded-lg"
                value={formData.images}
                onChange={e => setFormData({...formData, images: e.target.value})}
              />
          </div>
        </div>

        {/* Right Column */}
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
                  checked={formData.isActive}
                  onChange={e => setFormData({...formData, isActive: e.target.checked})}
                />
                <label className="text-sm text-gray-700">Active (Visible in Store)</label>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={formData.isHotDeal}
                  onChange={e => setFormData({...formData, isHotDeal: e.target.checked})}
                />
                <label className="text-sm text-gray-700">Hot Deal</label>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Pricing</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (৳)</label>
                <input 
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
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