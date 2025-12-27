import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Plus, Image as ImageIcon, Save } from 'lucide-react';

export default function Banners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', image: '', isActive: true });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/banners`);
      setBanners(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading banners");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) return alert("Image URL is required");

    try {
      await axios.post(`${API_URL}/banners`, formData);
      setFormData({ title: '', image: '', isActive: true });
      fetchBanners();
    } catch (error) {
      alert("Failed to add banner");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this banner?")) return;
    try {
      await axios.delete(`${API_URL}/banners/${id}`);
      fetchBanners();
    } catch (error) {
      alert("Failed to delete");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Banners...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Homepage Banners</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* --- ADD BANNER FORM --- */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm sticky top-6">
            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" /> Add New Banner
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Banner Title (Optional)</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Image URL</label>
                <input 
                  type="text" 
                  placeholder="https://..."
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.image}
                  onChange={e => setFormData({...formData, image: e.target.value})}
                />
              </div>
              
              {/* Image Preview */}
              {formData.image && (
                <div className="h-32 bg-gray-100 rounded overflow-hidden border">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> Save Banner
              </button>
            </form>
          </div>
        </div>

        {/* --- BANNER LIST --- */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {banners.map((banner) => (
              <div key={banner._id} className="group relative bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="h-40 bg-gray-100">
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-3 flex justify-between items-center">
                    <span className="font-medium text-gray-700">{banner.title || 'Untitled Banner'}</span>
                    <button 
                        onClick={() => handleDelete(banner._id)}
                        className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
                {/* Active Badge */}
                <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                    Active
                </div>
              </div>
            ))}
            
            {banners.length === 0 && (
                <div className="col-span-2 text-center p-10 bg-gray-50 border border-dashed rounded-xl text-gray-400">
                    <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p>No banners active. Add one to show on homepage.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}