"use client"
import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, User, X, ChevronRight } from 'lucide-react';
import Link from "next/link";
import { signIn,signOut,useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Auth Modal Component - to be imported in your Navbar
export function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const router = useRouter();
  
  // Toggle between login and signup forms
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormError('');
  };

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setPassword('');
      setName('');
      setErrors({});
      setFormError('');
      setLoading(false);
    }
  }, [isOpen]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!isLogin && !name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!validateForm()) return;
    
    setLoading(true);
    if(isLogin){
    try {
      const res=await signIn('credentials',{
        redirect :false,
        email,
        password
      });
      if(res.error){
        throw new Error(res.error);
      }

    // Close modal on successfull login 
    onClose();
    router.refresh();
    }catch (error) {
      setFormError(error.message || 'failed to sign in');
      console.error('Auth error:', error.message);
    } finally {
      setLoading(false);
    }
  } else {
    //Handle signup - still need to use your API route for registration
    try{
      const res=await fetch('/api/auth/signup',{
        method:'POST',
        headers:{
          'Content-Type' : 'application/json',
        },
        body :JSON.stringify({name,email,password}),
      });

      const data=await res.json();
      if(!res.ok){
        throw new Error(data.message || data.error || 'Something went wrong');
      }
      //Auto login after successfull signup
      const signInResult = await signIn('credentials',{
        redirect:false,
        email,
        password
      });
      if(signInResult.error){
        throw new Error(signInResult.error);
      }
      //close modal on successfull signup and login
      onClose();
      router.refresh();
    }catch(error){
      setFormError(error.message);
      console.error('Auth Error:',error.message);
    }finally{
      setLoading(false);
    }
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={24} />
        </button>
        
        {/* Modal header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-600 mt-1">
            {isLogin ? 'Sign in to continue shopping' : 'Join us to start shopping'}
          </p>
        </div>
        
        {/* Error message */}
        {formError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4" role="alert">
            <p className="text-sm">{formError}</p>
          </div>
        )}
        
        {/* Auth form */}
        <form onSubmit={handleSubmit}>
          {/* Name field (signup only) */}
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-400">
                  <User size={18} />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 rounded-md border text-gray-700 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Name"
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
          )}
          
          {/* Email field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <Mail size={18} />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-3 py-2 rounded-md border text-gray-700 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          
          {/* Password field */}
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <label htmlFor="password" className="block text-gray-700 text-sm font-medium">
                Password
              </label>
              {isLogin && (
                <a href="#" className="text-xs text-blue-600 hover:text-blue-800">
                  Forgot password?
                </a>
              )}
            </div>
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <Lock size={18} />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-10 py-2 rounded-md border text-gray-700 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                tabIndex="-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18}/> }
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          
          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300 flex items-center justify-center"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isLogin ? 'Signing in...' : 'Creating account...'}
              </span>
            ) : (
              <span className="flex items-center">
                {isLogin ? 'Sign In' : 'Create Account'}
                <ChevronRight size={18} className="ml-1" />
              </span>
            )}
          </button>
          
          {/* Toggle between login and signup */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={toggleForm}
                className="ml-1 text-blue-600 hover:text-blue-800 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

// User Menu Component - shown when user is logged in
export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const {data : session} = useSession();
  const router = useRouter();
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.user-menu')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleLogout = async ()=>{
    await signOut({redirect : false});
    router.refresh();
  };
  if(!session) return null;

  return (
    <div className="relative user-menu">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <img 
          src={session.user.avatar}
          alt={session.user.name}
          className="w-8 h-8 rounded-full border-2 border-gray-200"
        />
        <span className="ml-2 hidden md:block">{session.user.name}</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <Link 
            href="/myAccount" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            My Account
          </Link>
          {/* <Link
            href="/orders" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            My Orders
          </Link>
          <Link
            href="/settings" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Settings
          </Link> */}
          <button 
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}