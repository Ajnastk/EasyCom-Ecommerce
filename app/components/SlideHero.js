"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, ChevronRight, Star, TrendingUp, Clock } from 'lucide-react';

const PremiumHero = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);
  
  const heroProducts = [
    {
      id: 1,
      title: "Premium Collection",
      tagline: "Elevate Your Style",
      description: "Discover our handcrafted luxury items designed for the discerning customer",
      badge: "New Season",
      cta: "Shop Collection",
      discount: "Save 25%",
      color: "bg-indigo-600",
      accentColor: "bg-indigo-400",
      textColor: "text-indigo-100"
    },
    {
      id: 2,
      title: "Limited Edition",
      tagline: "Exclusive Release",
      description: "Premium products with limited availability, crafted for perfection",
      badge: "Trending",
      cta: "View Exclusives",
      discount: "Members Only",
      color: "bg-amber-600",
      accentColor: "bg-amber-400",
      textColor: "text-amber-100"
    },
    {
      id: 3,
      title: "Signature Series",
      tagline: "Iconic Essentials",
      description: "Timeless classics reimagined with modern techniques and materials",
      badge: "Best Seller",
      cta: "Explore Series",
      discount: "Free Shipping",
      color: "bg-emerald-700",
      accentColor: "bg-emerald-500",
      textColor: "text-emerald-100"
    }
  ];

  const handleSlideChange = (index) => {
    if (animating || index === activeSlide) return;
    
    setAnimating(true);
    setActiveSlide(index);
    
    // Reset animation state
    setTimeout(() => {
      setAnimating(false);
    }, 750);
  };

  const startAutoSlide = () => {
    timerRef.current = setInterval(() => {
      const nextSlide = (activeSlide + 1) % heroProducts.length;
      handleSlideChange(nextSlide);
    }, 6000);
  };

  useEffect(() => {
    startAutoSlide();
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [activeSlide]);

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      startAutoSlide();
    }
  };

  return (
    <div className="relative w-full h-screen max-h-[700px] overflow-hidden bg-gray-900">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>
      
      {/* Slides */}
      <div className="relative h-full w-full">
        {heroProducts.map((product, index) => (
          <div 
            key={product.id}
            className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
              index === activeSlide 
                ? 'opacity-100 translate-x-0 z-10' 
                : 'opacity-0 translate-x-full z-0'
            }`}
          >
            <div className={`absolute inset-0 ${product.color} opacity-90`}></div>
            <div className={`absolute top-0 left-1/2 h-full w-1/3 ${product.accentColor} opacity-20 transform -skew-x-12`}></div>
            
            {/* Content container */}
            <div className="relative h-full flex flex-col md:flex-row items-center z-20 max-w-7xl mx-auto px-6 py-12">
              {/* Text content */}
              <div className="w-full md:w-1/2 text-white space-y-6 mt-12 md:mt-0">
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm ${product.textColor}`}>
                    {product.badge === "Trending" ? (
                      <TrendingUp className="mr-1 h-4 w-4" />
                    ) : product.badge === "Best Seller" ? (
                      <Star className="mr-1 h-4 w-4" />
                    ) : (
                      <Clock className="mr-1 h-4 w-4" />
                    )}
                    {product.badge}
                  </span>
                  
                  <span className="ml-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-white/10 backdrop-blur-sm">
                    {product.discount}
                  </span>
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                  {product.title}
                </h1>
                
                <p className="text-2xl md:text-3xl font-light">
                  {product.tagline}
                </p>
                
                <p className="text-lg md:text-xl max-w-lg opacity-90">
                  {product.description}
                </p>
                
                <div className="flex flex-wrap gap-4 pt-4">
                  <button className="flex items-center bg-white text-gray-900 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    {product.cta}
                  </button>
                  
                  <button className="flex items-center border border-white/50 text-white px-6 py-3 rounded-md font-medium hover:bg-white/10 transition-all">
                    Learn More
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {/* Product image */}
              <div className="w-full md:w-1/2 h-full flex items-center justify-center relative">
                <div className="relative h-4/5 w-4/5 flex items-center justify-center">
                  {/* Stylized background for product */}
                  <div className="absolute inset-0 bg-white/10 rounded-full blur-2xl transform scale-75"></div>
                  <div className="absolute inset-0 border-4 border-white/20 rounded-full transform scale-90"></div>
                  
                  {/* Product placeholder */}
                  <img 
                    src={`/api/placeholder/500/500`} 
                    alt={product.title} 
                    className="max-h-full max-w-full object-contain z-10 transform transition-all duration-700 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-30">
        {heroProducts.map((_, index) => (
          <button 
            key={index}
            onClick={() => {
              handleSlideChange(index);
              resetTimer();
            }}
            className={`relative h-3 transition-all duration-500 ${
              index === activeSlide ? 'w-12 bg-white' : 'w-3 bg-white/40'
            } rounded-full overflow-hidden`}
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === activeSlide && (
              <span 
                className="absolute inset-0 bg-white/50 animate-progress" 
                style={{
                  animation: 'progress 6s linear forwards'
                }}
              ></span>
            )}
          </button>
        ))}
      </div>
      
      {/* Progress indicator */}
      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
};

export default PremiumHero;