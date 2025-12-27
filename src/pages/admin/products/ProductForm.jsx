import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, Save, UploadCloud, X, Plus, 
  Image as ImageIcon, Loader2, Trash2
} from 'lucide-react';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // State
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false); // New: Upload loading state
  
  // Data Options
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    costPrice: '', // --- NEW FIELD ---
    price: '',     // Regular Price
    discountPrice: '',
    stock: '',
    category: '',
    brand: '',
    isActive: true,
    isHotDeal: false,
    images: [] 
  });

  // Manual Image Input State
  const [manualUrl, setManualUrl] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        axios.get(`${API_URL}/categories`),
        axios.get(`${API_URL}/brands`)
      ]);
      setCategories(catRes.data);
      setBrands(brandRes.data);

      if (id) {
        const { data } = await axios.get(`${API_URL}/products/${id}`);
        setFormData({
            ...data,
            category: data.category?._id || data.category || '', 
            brand: data.brand?._id || data.brand || '',
            // Map backend 'stockQuantity' or 'regularPrice' if naming differs
            price: data.regularPrice || data.price,
            stock: data.stockQuantity || data.stock,
            costPrice: data.costPrice || '' // Load cost price
        });
      }
      setFetching(false);
    } catch (error) {
      console.error("Error loading data");
      setFetching(false);
    }
  };

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
    });
  };

  // 1. FILE UPLOAD HANDLER (New)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);
    setUploading(true);

    try {
      // Upload to backend, which saves to client/public/uploads
      const res = await axios.post(`${API_URL}/upload`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Add the returned path (e.g. /uploads/img.jpg) to images array
      setFormData(prev => ({ 
        ...prev, 
        images: [...prev.images, res.data.filePath] 
      }));
    } catch (error) {
      alert("Upload Failed: " + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
      e.target.value = null; // Reset input
    }
  };

  // 2. MANUAL URL HANDLER
  const handleAddManualUrl = (e) => {
    e.preventDefault();
    if (!manualUrl) return;
    setFormData(prev => ({ ...prev, images: [...prev.images, manualUrl] }));
    setManualUrl('');
  };

  const handleRemoveImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        // Prepare payload (convert numbers)
        const payload = {
            ...formData,
            costPrice: Number(formData.costPrice) || 0,
            regularPrice: Number(formData.price),
            discountPrice: Number(formData.discountPrice) || 0,
            stockQuantity: Number(formData.stock)
        };

        if (id) {
            await axios.put(`${API_URL}/products/${id}`, payload);
            alert("Product Updated Successfully!");
        } else {
            await axios.post(`${API_URL}/products`, payload);
            alert("Product Created Successfully!");
        }
        navigate('/admin/products');
    } catch (error) {
        alert("Operation Failed: " + (error.response?.data?.message || error.message));
    } finally {
        setLoading(false);
    }
  };

  if (fetching) return <div className="p-10 text-center">Loading Data...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/admin/products')} className="flex items-center gap-2 text-gray-500 hover:text-green-600">
            <ArrowLeft className="w-5 h-5" /> Back to List
        </button>
        <h1 className="text-2xl font-bold text-gray-800">{id ? 'Edit Product' : 'Add New Product'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN (General Info) --- */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Details */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">Basic Information</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">Product Name</label>
                        <input required name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">Description</label>
                        <textarea required name="description" rows="4" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none" />
                    </div>
                </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">Pricing & Inventory</h3>
                <div className="grid grid-cols-2 gap-4">
                    
                    {/* --- NEW COST PRICE INPUT --- */}
                    <div className="bg-gray-50 p-2 rounded border border-gray-200 col-span-2 md:col-span-1">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Actual Cost (৳)</label>
                        <input 
                            type="number" 
                            name="costPrice" 
                            value={formData.costPrice} 
                            onChange={handleChange} 
                            className="w-full p-2 border rounded focus:ring-green-500 bg-white" 
                            placeholder="0"
                        />
                        <p className="text-xs text-gray-500 mt-1">Internal use only (Hidden from customers)</p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">Regular Price (৳)</label>
                        <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">Discount Price (৳)</label>
                        <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">Stock Quantity</label>
                        <input required type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none" />
                    </div>
                </div>
            </div>

            {/* Image Management */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">Product Images</h3>
                
                {/* 1. Direct Upload Button */}
                <div className="mb-4">
                     <label className="flex items-center justify-center w-full h-16 px-4 transition bg-green-50 border-2 border-green-200 border-dashed rounded-md cursor-pointer hover:border-green-500">
                        {uploading ? <Loader2 className="animate-spin text-green-600" /> : 
                        <span className="flex items-center gap-2 text-green-700 font-bold">
                            <UploadCloud className="w-5 h-5"/> Upload New Photo
                        </span>}
                        <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" disabled={uploading} />
                     </label>
                </div>

                {/* 2. Manual URL Input */}
                <div className="flex gap-2 mb-4 items-center">
                    <span className="text-sm font-bold text-gray-500">OR</span>
                    <input 
                        type="text" 
                        placeholder="Paste existing path (e.g. /images/honey.jpg)" 
                        className="flex-1 p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none text-sm"
                        value={manualUrl}
                        onChange={(e) => setManualUrl(e.target.value)}
                    />
                    <button onClick={handleAddManualUrl} type="button" className="bg-gray-100 text-gray-600 px-3 py-2 rounded border hover:bg-gray-200">
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                {/* Image Preview Grid */}
                {formData.images.length === 0 ? (
                    <div className="text-center p-8 bg-gray-50 rounded border border-dashed border-gray-300 text-gray-400">
                        <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        No images added yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-4 gap-4">
                        {formData.images.map((img, index) => (
                            <div key={index} className="relative group border rounded-lg overflow-hidden h-24 bg-gray-50">
                                {/* Display image directly */}
                                <img src={img} alt="preview" className="w-full h-full object-contain" />
                                <button 
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* --- RIGHT COLUMN (Organization) --- */}
        <div className="space-y-6">
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">Organization</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded bg-white">
                            <option value="">Select Category...</option>
                            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">Brand</label>
                        <select name="brand" value={formData.brand} onChange={handleChange} className="w-full p-2 border rounded bg-white">
                            <option value="">Select Brand...</option>
                            {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">Status</h3>
                <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                        <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 text-green-600 rounded" />
                        <span className="font-medium text-gray-700">Active (Visible)</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                        <input type="checkbox" name="isHotDeal" checked={formData.isHotDeal} onChange={handleChange} className="w-5 h-5 text-orange-600 rounded" />
                        <span className="font-medium text-gray-700">Hot Deal</span>
                    </label>
                </div>
            </div>

            <button 
                type="submit" 
                disabled={loading || uploading} 
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-green-200 flex items-center justify-center gap-2"
            >
                <Save className="w-5 h-5" /> {loading ? 'Saving...' : 'Save Product'}
            </button>
        </div>

      </form>
    </div>
  );
}