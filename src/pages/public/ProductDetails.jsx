import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Plus, Minus, ArrowLeft } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [mainImage, setMainImage] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/products/${id}`);
      setProduct(data);
      if(data.images && data.images.length > 0) {
        setMainImage(data.images[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading product");
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, qty);
    alert("Added to cart!");
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    navigate('/checkout');
  };

  if (loading) return <div className="p-20 text-center">Loading...</div>;
  if (!product) return <div className="p-20 text-center">Product not found.</div>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-500 hover:text-green-600 mb-6 transition"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Home
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        
        {/* LEFT: IMAGES */}
        <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center">
                <img 
                    src={mainImage || 'https://via.placeholder.com/400?text=No+Image'} 
                    alt={product.name} 
                    className="w-full h-full object-contain"
                />
            </div>
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {product.images.map((img, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setMainImage(img)}
                            className={`w-20 h-20 rounded-lg border overflow-hidden flex-shrink-0 ${mainImage === img ? 'ring-2 ring-green-500' : 'hover:border-green-300'}`}
                        >
                            <img src={img} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>

        {/* RIGHT: DETAILS */}
        <div>
            <div className="mb-2">
                <span className="text-sm text-green-600 font-bold bg-green-50 px-2 py-1 rounded">
                    {product.category?.name || 'General'}
                </span>
                {product.isHotDeal && (
                    <span className="ml-2 text-sm text-white font-bold bg-orange-500 px-2 py-1 rounded">
                        HOT DEAL
                    </span>
                )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
            <p className="text-gray-500 mb-6 leading-relaxed">{product.description}</p>

            {/* Price */}
            <div className="flex items-end gap-3 mb-6">
                <span className="text-4xl font-bold text-green-700">৳{product.discountPrice || product.price}</span>
                {product.discountPrice && (
                    <span className="text-xl text-gray-400 line-through mb-1">৳{product.price}</span>
                )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-8">
                <span className="font-bold text-gray-700">Quantity:</span>
                <div className="flex items-center border rounded-lg overflow-hidden">
                    <button 
                        onClick={() => setQty(q => Math.max(1, q - 1))}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-bold w-12 text-center">{qty}</span>
                    <button 
                        onClick={() => setQty(q => q + 1)}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                <span className="text-sm text-gray-500">
                    {product.stock > 0 ? `${product.stock} items available` : 'Out of Stock'}
                </span>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <button 
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="flex-1 bg-white border-2 border-green-600 text-green-700 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-green-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ShoppingCart className="w-5 h-5" /> Add to Cart
                </button>
                
                <button 
                    onClick={handleBuyNow}
                    disabled={product.stock <= 0}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 shadow-lg shadow-green-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Buy Now
                </button>
            </div>
            
            {/* Delivery Info */}
            <div className="mt-8 border-t pt-6 text-sm text-gray-500 space-y-2">
                <p>🚚 Fast Delivery all over Bangladesh</p>
                <p>💵 Cash on Delivery Available</p>
                <p>🛡️ 100% Authentic Products</p>
            </div>
        </div>

      </div>
    </div>
  );
}