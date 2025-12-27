import { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Plus, Image as ImageIcon } from 'lucide-react';

export default function BannerManager() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [imageUrl, setImageUrl] = useState('');
  const [link, setLink] = useState('');
  const [adding, setAdding] = useState(false);

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
      console.error("Failed to load banners");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!imageUrl) return;
    setAdding(true);
    try {
      await axios.post(`${API_URL}/banners`, { imageUrl, link });
      setImageUrl('');
      setLink('');
      fetchBanners(); // Refresh list
    } catch (error) {
      alert("Failed to add banner");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this banner?")) return;
    try {
      await axios.delete(`${API_URL}/banners/${id}`);
      setBanners(banners.filter(b => b._id !== id));
    } catch (error) {
      alert("Failed to delete");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <ImageIcon className="w-8 h-8 text-green-600" />
        <h1 className="text-2xl font-bold text-gray-800">Banner Manager</h1>
      </div>

      {/* Add Banner Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h3 className="font-bold text-gray-800 mb-4">Add New Banner</h3>
        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Image URL (e.g. https://imgur.com/...)" 
            className="flex-1 p-2 border rounded-lg"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            required
          />
          <input 
            type="text" 
            placeholder="Link (Optional)" 
            className="flex-1 p-2 border rounded-lg"
            value={link}
            onChange={e => setLink(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={adding}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 justify-center"
          >
            <Plus className="w-5 h-5" /> {adding ? 'Adding...' : 'Add'}
          </button>
        </form>
      </div>

      {/* Banner List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? <p>Loading...</p> : banners.map((banner) => (
          <div key={banner._id} className="relative group bg-white border rounded-xl overflow-hidden shadow-sm">
            <img 
              src={banner.imageUrl} 
              alt="Banner" 
              className="w-full h-48 object-cover"
            />
            <div className="p-3 flex justify-between items-center bg-gray-50">
                <span className="text-xs text-gray-500 truncate max-w-[200px]">{banner.link || 'No Link'}</span>
                <button 
                    onClick={() => handleDelete(banner._id)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}