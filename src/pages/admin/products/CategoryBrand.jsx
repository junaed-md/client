import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Trash2, Plus, Layers, Tag, FolderTree, 
  ChevronRight, ChevronDown, CheckCircle 
} from 'lucide-react';

export default function CategoryBrand() {
  const [activeTab, setActiveTab] = useState('categories'); // 'categories' | 'brands'
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const [catForm, setCatForm] = useState({ name: '', parentId: '' });
  const [brandForm, setBrandForm] = useState({ name: '' });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        axios.get(`${API_URL}/categories`),
        axios.get(`${API_URL}/brands`)
      ]);
      setCategories(catRes.data);
      setBrands(brandRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading data");
    }
  };

  // --- CATEGORY ACTIONS ---
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if(!catForm.name) return;
    try {
      await axios.post(`${API_URL}/categories`, catForm);
      setCatForm({ name: '', parentId: '' });
      fetchData(); // Refresh list
    } catch (error) { alert("Failed to add category"); }
  };

  const handleDeleteCategory = async (id) => {
    if(!window.confirm("Delete this category?")) return;
    try {
      await axios.delete(`${API_URL}/categories/${id}`);
      fetchData();
    } catch (error) { alert("Failed to delete"); }
  };

  // --- BRAND ACTIONS ---
  const handleAddBrand = async (e) => {
    e.preventDefault();
    if(!brandForm.name) return;
    try {
      await axios.post(`${API_URL}/brands`, brandForm);
      setBrandForm({ name: '' });
      fetchData();
    } catch (error) { alert("Failed to add brand"); }
  };

  const handleDeleteBrand = async (id) => {
    if(!window.confirm("Delete this brand?")) return;
    try {
      await axios.delete(`${API_URL}/brands/${id}`);
      fetchData();
    } catch (error) { alert("Failed to delete"); }
  };

  // --- TREE VIEW HELPER ---
  const renderCategoryTree = (parentId = null, level = 0) => {
    // Filter categories that belong to this parent
    const children = categories.filter(c => {
        if (parentId) return c.parentId && c.parentId._id === parentId;
        return !c.parentId; // Root categories
    });

    if (children.length === 0) return null;

    return (
        <div className={`space-y-2 ${level > 0 ? 'ml-6 border-l pl-4 border-gray-200' : ''}`}>
            {children.map(cat => (
                <div key={cat._id}>
                    <div className="flex items-center justify-between bg-white p-3 rounded border hover:border-blue-300 transition group">
                        <div className="flex items-center gap-2">
                            {level === 0 ? <FolderTree className="w-4 h-4 text-blue-600" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                            <span className={`font-medium ${level === 0 ? 'text-gray-800' : 'text-gray-600'}`}>{cat.name}</span>
                        </div>
                        <button 
                            onClick={() => handleDeleteCategory(cat._id)}
                            className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    {/* Recursively render children */}
                    {renderCategoryTree(cat._id, level + 1)}
                </div>
            ))}
        </div>
    );
  };

  if (loading) return <div className="p-10 text-center">Loading Data...</div>;

  return (
    <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Catalog Manager</h1>

        {/* TABS */}
        <div className="flex gap-4 mb-8 border-b">
            <button 
                onClick={() => setActiveTab('categories')}
                className={`pb-4 px-4 font-bold flex items-center gap-2 ${activeTab === 'categories' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <Layers className="w-5 h-5" /> Categories
            </button>
            <button 
                onClick={() => setActiveTab('brands')}
                className={`pb-4 px-4 font-bold flex items-center gap-2 ${activeTab === 'brands' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <Tag className="w-5 h-5" /> Brands
            </button>
        </div>

        {/* --- CATEGORY VIEW --- */}
        {activeTab === 'categories' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left: Form */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm sticky top-6">
                        <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-blue-600" /> Add Category
                        </h3>
                        <form onSubmit={handleAddCategory} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Category Name</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Organic Food"
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={catForm.name}
                                    onChange={e => setCatForm({...catForm, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Parent Category (Optional)</label>
                                <select 
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={catForm.parentId}
                                    onChange={e => setCatForm({...catForm, parentId: e.target.value})}
                                >
                                    <option value="">None (Main Category)</option>
                                    {categories.map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold">
                                Save Category
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right: Tree List */}
                <div className="md:col-span-2">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h3 className="font-bold text-gray-700 mb-4">Category Structure</h3>
                        {categories.length === 0 ? (
                            <p className="text-gray-400 text-sm">No categories found.</p>
                        ) : (
                            renderCategoryTree()
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* --- BRAND VIEW --- */}
        {activeTab === 'brands' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {/* Left: Form */}
                 <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-purple-100 shadow-sm sticky top-6">
                        <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-purple-600" /> Add Brand
                        </h3>
                        <form onSubmit={handleAddBrand} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Brand Name</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. ParentsFood"
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500 outline-none"
                                    value={brandForm.name}
                                    onChange={e => setBrandForm({...brandForm, name: e.target.value})}
                                />
                            </div>
                            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-bold">
                                Save Brand
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right: Grid List */}
                <div className="md:col-span-2">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {brands.map(brand => (
                            <div key={brand._id} className="bg-white p-4 rounded-lg border border-gray-100 flex justify-between items-center group shadow-sm hover:shadow-md transition">
                                <span className="font-bold text-gray-700">{brand.name}</span>
                                <button 
                                    onClick={() => handleDeleteBrand(brand._id)}
                                    className="text-gray-300 hover:text-red-500 transition"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        {brands.length === 0 && <p className="text-gray-400 col-span-3">No brands added yet.</p>}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}