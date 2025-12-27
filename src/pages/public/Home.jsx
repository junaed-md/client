import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]); // <-- Store Banners
  const [currentBanner, setCurrentBanner] = useState(0); // <-- Slider Index
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-Slide Logic
  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, [banners]);

  const fetchData = async () => {
    try {
      // Fetch both Banners and Products at the same time
      const [bannerRes, productRes] = await Promise.all([
        axios.get(`${API_URL}/banners`),
        axios.get(`${API_URL}/products`)
      ]);
      
      setBanners(bannerRes.data);
      setProducts(productRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load data");
      setLoading(false);
    }
  };

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div>
      {/* ----------------------------------------------------------------
          DYNAMIC HERO SLIDER
      ---------------------------------------------------------------- */}
      <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden bg-gray-100 mb-10">
        
        {banners.length > 0 ? (
            <>
                {/* Images */}
                {banners.map((banner, index) => (
                    <div 
                        key={banner._id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                            index === currentBanner ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        {banner.link ? (
                            <Link to={banner.link}>
                                <img src={banner.imageUrl} alt="Banner" className="w-full h-full object-cover" />
                            </Link>
                        ) : (
                            <img src={banner.imageUrl} alt="Banner" className="w-full h-full object-cover" />
                        )}
                    </div>
                ))}

                {/* Slider Controls (Arrows) */}
                <button 
                    onClick={prevBanner}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                    onClick={nextBanner}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {banners.map((_, idx) => (
                        <div 
                            key={idx} 
                            className={`w-2 h-2 rounded-full transition-all ${
                                idx === currentBanner ? 'bg-white w-6' : 'bg-white/50'
                            }`}
                        />
                    ))}
                </div>
            </>
        ) : (
            // Fallback if no banners exist
            <div className="flex items-center justify-center h-full text-gray-400">
                <p>No Banners Uploaded</p>
            </div>
        )}
      </div>

      {/* ----------------------------------------------------------------
          PRODUCT GRID
      ---------------------------------------------------------------- */}
      <div className="container mx-auto px-4 mb-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-green-600 pl-3">
          Latest Products
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
              {/* Product Image */}
              <div className="relative h-48 bg-gray-50 overflow-hidden">
                <img 
                  src={product.images[0] || 'https://via.placeholder.com/300'} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                />
                {product.discountPrice && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    SALE
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1 truncate">{product.name}</h3>
                <div className="flex items-center gap-1 mb-3">
                   <Star className="w-4 h-4 text-yellow-400 fill-current" />
                   <span className="text-xs text-gray-500">4.5 (12 Reviews)</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    {product.discountPrice ? (
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-sm line-through">৳{product.price}</span>
                        <span className="text-xl font-bold text-green-700">৳{product.discountPrice}</span>
                      </div>
                    ) : (
                      <span className="text-xl font-bold text-gray-800">৳{product.price}</span>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => addToCart(product)}
                    className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-full transition"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}