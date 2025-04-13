"use client"
import { useState, useEffect, useCallback } from "react";
import { Menu, X, ShoppingCart, Heart, Search, User, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [click, setClick] = useState(false);
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [activeLink, setActiveLink] = useState("home");
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  
  // Main navigation categories
  const navLinks = ["Home", "Categories", "New Arrivals", "Top Picks", "About", "Contact"];
  
  const handleClick = () => setClick(!click);
  const toggleSearch = () => setSearchOpen(!searchOpen);

  // Check if we're on a mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is the standard md breakpoint in Tailwind
    };
    
    checkMobile(); // Check on initial load
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Throttle scroll handler using useCallback
  const handleScroll = useCallback(() => {
    // Only apply scroll hiding on non-mobile devices
    if (isMobile) {
      // Always show navbar on mobile
      setVisible(true);
      return;
    }
    
    const currentScrollPos = window.scrollY;
    const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10;
    
    if (isVisible !== visible) {
      setVisible(isVisible);
    }
    setPrevScrollPos(currentScrollPos);
  }, [prevScrollPos, visible, isMobile]);

  useEffect(() => {
    const throttledScroll = throttle(handleScroll, 100);
    window.addEventListener('scroll', throttledScroll);
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [handleScroll]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target.id;
          const isTop = window.scrollY < 100;
          setActiveLink(isTop ? 'home' : section);
        }
      });
    }, observerOptions);

    navLinks.forEach(link => {
      const section = document.getElementById(link.toLowerCase());
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  },);

  const handleLinkClick = useCallback((linkName) => {
    const formattedLink = linkName.toLowerCase();
    setActiveLink(formattedLink);
    setClick(false);
    window.history.replaceState(null, '', `#${formattedLink}`);
  }, []);

  const scrollToSection = useCallback((id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="w-full fixed top-0 left-0 z-50">
      {/* Top promotional banner */}
      <div className="bg-[#182648] text-white text-center text-sm py-2">
        Free shipping on orders over $50 | 20% OFF with code SUMMER24
      </div>
      
      <nav className={`bg-white text-gray-800 shadow-md transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
        {/* Top section with logo, search, and icons */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="text-2xl font-bold mr-8">EASYCOM</div>
            
            {/* Search bar - visible on larger screens */}
            <div className="hidden md:flex flex-grow max-w-xl relative">
              <input 
                type="text" 
                placeholder="Search for products..."
                className="w-full py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="absolute right-3 top-2.5 text-gray-500 hover:text-blue-600">
                <Search size={20} />
              </button>
            </div>
            
            {/* Action icons - visible on larger screens */}
            <div className="hidden md:flex items-center space-x-6 ml-8">
              <button className="flex flex-col items-center text-gray-700 hover:text-blue-600">
                <User size={22} />
                <span className="text-xs mt-1">Account</span>
              </button>
              
              <button className="flex flex-col items-center text-gray-700 hover:text-blue-600">
                <Heart size={22} />
                <span className="text-xs mt-1">Wishlist</span>
              </button>
              
              <button className="flex flex-col items-center text-gray-700 hover:text-blue-600 relative">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
                <span className="text-xs mt-1">Cart</span>
              </button>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden space-x-4">
              <button onClick={toggleSearch} aria-label="Search">
                <Search size={24} />
              </button>
              
              <button className="relative" aria-label="Shopping Cart">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
              
              <button 
                onClick={handleClick}
                aria-label="Toggle Menu"
                aria-expanded={click}
                aria-controls="mobile-menu"
              >
                {click ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
          
          {/* Mobile search bar */}
          {searchOpen && (
            <div className="md:hidden pb-4">
              <input 
                type="text" 
                placeholder="Search for products..."
                className="w-full py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          
          {/* Main navigation - desktop */}
          <div className="hidden md:block border-t border-gray-200">
            <ul className="flex justify-center space-x-8 py-3 text-sm font-medium">
              {navLinks.map((item) => {
                const linkId = item.toLowerCase();
                return (
                  <li key={item} className="relative group">
                    <a 
                      href={`#${linkId}`} 
                      onClick={(e) => { 
                        e.preventDefault();
                        scrollToSection(linkId);
                        handleLinkClick(linkId);
                      }}
                      className={`flex items-center transition-colors  duration-300 hover:text-blue-600 ${activeLink === linkId ? 'text-blue-600' : ''}`}
                      aria-current={activeLink === linkId ? 'page' : undefined}
                    >
                      {item}
                      {item === "Shop" && <ChevronDown size={16} className="ml-1" />}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {click && (
        <div 
          id="mobile-menu"
          className="md:hidden bg-white shadow-lg"
        >
          <ul className="py-3">
            {navLinks.map((item) => {
              const linkId = item.toLowerCase();
              return (
                <li key={item} className="border-b border-gray-200 last:border-b-0">
                  <a 
                    href={`#${linkId}`} 
                    onClick={(e) => { 
                      e.preventDefault();
                      scrollToSection(linkId);
                      handleLinkClick(linkId);
                    }}
                    className={`block py-3 px-6 text-black ${activeLink === linkId ? 'text-blue-600 font-medium' : ''}`}
                    aria-current={activeLink === linkId ? 'page' : undefined}
                  >
                    {item}
                  </a>
                </li>
              );
            })}
            {/* Additional mobile menu items */}
            <li className="border-b border-gray-200">
              <a href="#account" className="block text-black py-3 px-6">My Account</a>
            </li>
            <li className="border-b border-gray-200">
              <a href="#wishlist" className="block py-3 text-black px-6">Wishlist</a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

// Utility function for throttling
function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function(...args) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}