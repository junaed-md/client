import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    password: '' 
  });
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/auth/register`, formData);
      toast.success("Registration Successful! Please login.");
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-[#006837]">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">Join ParentsFood today</p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          
          {/* Name */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              name="name"
              type="text"
              required
              className="w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg focus:ring-[#006837] focus:border-[#006837] outline-none"
              placeholder="Full Name"
              onChange={handleChange}
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              name="phone"
              type="text"
              required
              className="w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg focus:ring-[#006837] focus:border-[#006837] outline-none"
              placeholder="Phone Number"
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              name="email"
              type="email"
              required
              className="w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg focus:ring-[#006837] focus:border-[#006837] outline-none"
              placeholder="Email Address"
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              name="password"
              type="password"
              required
              className="w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg focus:ring-[#006837] focus:border-[#006837] outline-none"
              placeholder="Password"
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-[#006837] hover:bg-[#004d29] font-bold transition-all disabled:opacity-70 mt-6"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-[#006837] hover:text-[#004d29] inline-flex items-center gap-1">
              Login here <ArrowRight className="w-4 h-4"/>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}