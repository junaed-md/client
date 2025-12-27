import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { ArrowRight, ChevronRight, ShoppingCart, Eye, Loader2, ImageOff } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { toast } from "react-hot-toast";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // --- CLIENT-SIDE IMAGE FIXER ---
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath; // External link (e.g. Placeholder)

    // 1. Fix Windows Slashes (\ -> /)
    let cleanPath = imagePath.replace(/\\/g, '/');

    // 2. Ensure it starts with a slash (for public folder relative path)
    if (!cleanPath.startsWith('/')) {
        cleanPath = `/${cleanPath}`;
    }

    // 3. Ensure it points to 'uploads' (if your DB just says 'assets/...')
    // If your file is in client/public/uploads, the URL must be /uploads/filename
    if (!cleanPath.startsWith('/uploads/') && !cleanPath.startsWith('/assets/')) {
         // Heuristic: If it doesn't look like a standard path, assume it's in uploads
         cleanPath = `/uploads${cleanPath}`;
    }

    // 4. RETURN RELATIVE PATH (No localhost:5000)
    // React will look for this in the 'public' folder
    return cleanPath;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/products`);
        setProducts(data);

        // --- EXTRACT CATEGORIES ---
        const categoryNames = data.map(p => {
            if (p.category && typeof p.category === 'object') {
                return p.category.name || "Uncategorized";
            }
            return p.category;
        }).filter(Boolean);

        const uniqueCategories = [...new Set(categoryNames)];
        
        // --- BUILD CATEGORY LIST ---
        const realCategories = uniqueCategories.map(catName => {
            const productInCat = data.find(p => {
                const pCatName = (p.category && typeof p.category === 'object') ? p.category.name : p.category;
                return pCatName === catName;
            });
            
            let catImg = null;
            if (productInCat) {
                const rawImg = (productInCat.images && productInCat.images.length > 0) 
                    ? productInCat.images[0] 
                    : productInCat.image;
                catImg = getImageUrl(rawImg);
            }

            return { name: catName, img: catImg };
        });

        setCategories(realCategories);
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success("Added to Cart!");
  };

  const settings = {
    dots: true, infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1, autoplay: true, autoplaySpeed: 4000, arrows: false,
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* HERO SLIDER */}
      <div className="bg-white mb-8">
        <Slider {...settings} className="w-full overflow-hidden">
            <div className="relative h-[200px] md:h-[400px] bg-[#f0fdf4] outline-none">
              <div className="container mx-auto h-full px-6 flex items-center justify-between">
                <div className="space-y-3 md:space-y-4 max-w-lg z-10">
                  <span className="bg-[#FCEE21] text-[#006837] px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider shadow-sm">
                    100% Natural
                  </span>
                  <h2 className="text-3xl md:text-6xl font-bold text-[#006837] leading-tight">
                    Pure Organic <br/> <span className="text-yellow-500">Honey & Ghee</span>
                  </h2>
                  <button className="bg-[#006837] text-white px-6 py-2 md:px-8 md:py-3 rounded-full font-bold hover:bg-[#004d29] transition flex items-center gap-2 text-sm md:text-base mt-2 shadow-lg">
                    Shop Now <ArrowRight className="w-4 h-4 md:w-5 md:h-5"/>
                  </button>
                </div>
                <div className="w-1/2 h-full flex items-end justify-end">
                   {/* Fallback Hero Image */}
                   <img src="https://placehold.co/500x400/006837/white?text=Organic+Collage" alt="Hero" className="h-[80%] object-contain opacity-90" />
                </div>
              </div>
            </div>
        </Slider>
      </div>

      {/* CATEGORIES */}
      <section className="container mx-auto px-4 mb-12">
        <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 border-b-4 border-[#006837] -mb-3 pb-2 inline-block">
            Our Categories
          </h3>
          <Link to="/products" className="text-sm font-bold text-[#006837] hover:underline flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {categories.length === 0 && !loading ? (
            <div className="text-center py-10 bg-white rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">No categories found.</p>
            </div>
        ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6">
            {categories.map((cat, index) => (
                <div key={index} className="flex flex-col items-center group cursor-pointer">
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white shadow-md group-hover:border-[#006837] transition-all duration-300 bg-white p-1 flex items-center justify-center">
                    {cat.img ? (
                        <img src={cat.img} alt={cat.name} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition duration-500" 
                             onError={(e) => {e.target.style.display='none'; e.target.nextSibling.style.display='flex'}} />
                    ) : null}
                    {/* Fallback Icon */}
                    <div className="hidden w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                        <ImageOff className="w-8 h-8" />
                    </div>
                </div>
                <span className="mt-3 text-xs md:text-sm font-bold text-gray-700 text-center group-hover:text-[#006837] leading-tight uppercase">
                    {cat.name}
                </span>
                </div>
            ))}
            </div>
        )}
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="container mx-auto px-4">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-6">
          <span className="border-b-4 border-[#FCEE21] -mb-2.5 pb-2">Featured Products</span>
        </h3>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#006837]" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 8).map((product) => {
              const price = product.discountPrice || product.price;
              const hasDiscount = !!product.discountPrice;
              
              // Get Image
              const imagePath = (product.images && product.images.length > 0) 
                  ? product.images[0] 
                  : product.image;

              const imageUrl = getImageUrl(imagePath);

              return (
                <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-lg transition group">
                  <div className="h-32 md:h-48 bg-gray-100 rounded-lg mb-4 relative overflow-hidden flex items-center justify-center">
                    {hasDiscount && (
                      <span className="absolute top-2 left-2 bg-[#006837] text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10">
                          SALE
                      </span>
                    )}
                    
                    {imageUrl ? (
                        <img 
                            src={imageUrl} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            onError={(e) => {e.target.style.display='none'; e.target.nextSibling.style.display='flex'}}
                        />
                    ) : null}
                    
                    {/* Fallback UI */}
                    <div className={`${imageUrl ? 'hidden' : 'flex'} w-full h-full items-center justify-center bg-gray-50 text-gray-300`}>
                        <div className="text-center">
                            <ImageOff className="w-8 h-8 mx-auto mb-1" />
                            <span className="text-[10px]">No Image</span>
                        </div>
                    </div>
                    
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        <Link to={`/product/${product._id}`} className="bg-white p-2 rounded-full text-gray-700 hover:text-[#006837] hover:scale-110 transition">
                          <Eye className="w-5 h-5"/>
                        </Link>
                    </div>
                  </div>

                  <h4 className="font-bold text-gray-700 text-sm md:text-base mb-1 line-clamp-2 min-h-[40px]">
                      {product.name}
                  </h4>
                  
                  <div className="flex items-end gap-2 mb-3">
                      <span className="text-[#006837] font-bold text-lg">৳{price}</span>
                      {hasDiscount && (
                        <span className="text-gray-400 text-sm line-through mb-1">৳{product.price}</span>
                      )}
                  </div>
                  
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full border border-[#006837] text-[#006837] font-bold py-2 rounded-lg hover:bg-[#006837] hover:text-white transition text-sm flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4"/> Add to Cart
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}