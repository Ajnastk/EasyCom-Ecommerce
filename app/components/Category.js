"use client"

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

const ProductCategories = () => {
  const categories = [
    {
      name: 'Keychains',
      image: "/image/product.jpeg",
    },
    {
      name: 'Necklaces',
      image:"/image/product.jpeg",
    },
    {
      name: 'Bracelets',
      image: "/image/product.jpeg",
    },
    {
      name: 'Earrings',
      image: "/image/product.jpeg",
    },
    {
      name: 'Rings',
      image: "/image/product.jpeg",
    },
    {
      name: 'Accessories',
      image: "/image/product.jpeg",
    },
    {
      name: 'Pendants',
      image: "/image/product.jpeg",
    },
    {
      name: 'Charms',
      image: "/image/product.jpeg",
    }
  ];

  const containerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(6);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(false);
  const timerRef = useRef(null);

  // Calculate responsive values based on screen size
  useEffect(() => {
    const updateResponsiveValues = () => {
      const width = window.innerWidth;
      let newItemsPerView = 6; // Default for large screens
      
      if (width < 640) { // Small mobile
        newItemsPerView = 2;
      } else if (width < 768) { // Mobile
        newItemsPerView = 3;
      } else if (width < 1024) { // Tablet
        newItemsPerView = 4;
      } else if (width < 1280) { // Small desktop
        newItemsPerView = 5;
      }
      
      setItemsPerView(newItemsPerView);
      setMaxScroll(Math.max(0, categories.length - newItemsPerView));
      
      // Reset position if current position would be invalid with new maxScroll
      if (scrollPosition > categories.length - newItemsPerView) {
        setScrollPosition(Math.max(0, categories.length - newItemsPerView));
      }
    };

    updateResponsiveValues();
    window.addEventListener('resize', updateResponsiveValues);
    return () => window.removeEventListener('resize', updateResponsiveValues);
  }, [categories.length, scrollPosition]);

  // Optional auto-scroll functionality (similar to hero)
  useEffect(() => {
    if (autoScrollEnabled) {
      timerRef.current = setInterval(() => {
        setScrollPosition(prev => {
          const nextPosition = (prev + 1) % (maxScroll + 1);
          return nextPosition;
        });
      }, 6000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [autoScrollEnabled, maxScroll]);

  const scrollPrev = () => {
    if (isAnimating || scrollPosition <= 0) return;
    setIsAnimating(true);
    setScrollPosition(prev => Math.max(0, prev - 1));
    setTimeout(() => setIsAnimating(false), 300);
    resetTimer();
  };

  const scrollNext = () => {
    if (isAnimating || scrollPosition >= maxScroll) return;
    setIsAnimating(true);
    setScrollPosition(prev => Math.min(maxScroll, prev + 1));
    setTimeout(() => setIsAnimating(false), 300);
    resetTimer();
  };

  const resetTimer = () => {
    if (autoScrollEnabled && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setScrollPosition(prev => (prev + 1) % (maxScroll + 1));
      }, 6000);
    }
  };

  // Handle touch events for swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isSignificantSwipe = Math.abs(distance) > 50;
    
    if (isSignificantSwipe) {
      if (distance > 0) {
        // Swipe left
        scrollNext();
      } else {
        // Swipe right
        scrollPrev();
      }
    }
    
    // Reset values
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Calculate item width based on items per view
  const itemWidth = `${100 / itemsPerView}%`;

  return (
    <section id="categories" className="w-full max-w-screen-2xl mt-24 mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-white relative overflow-hidden">
      {/* Curved edges - responsive sizes */}
      <div className="absolute left-0 bottom-0 w-12 sm:w-16 md:w-20 lg:w-24 h-12 sm:h-16 md:h-20 lg:h-24 bg-white rounded-tr-full transform translate-y-6 sm:translate-y-8 md:translate-y-10 lg:translate-y-12 -translate-x-6 sm:-translate-x-8 md:-translate-x-10 lg:-translate-x-12"></div>
      <div className="absolute right-0 bottom-0 w-12 sm:w-16 md:w-20 lg:w-24 h-12 sm:h-16 md:h-20 lg:h-24 bg-white rounded-tl-full transform translate-y-6 sm:translate-y-8 md:translate-y-10 lg:translate-y-12 translate-x-6 sm:translate-x-8 md:translate-x-10 lg:translate-x-12"></div>
      
      {/* Content container with z-index to appear above curves */}
      <div className="relative z-10">
        {/* Header - responsive text sizes */}
        <h2 className="text-center mb-6 md:mb-10">
          <span className="text-xl sm:text-2xl md:text-3xl text-gray-800">Shop By </span>
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Category</span>
        </h2>

        {/* Categories Container */}
        <div className="relative px-6 md:px-8 mt-24 lg:px-10">
          {/* Previous Button - responsive positioning */}
          <button 
            className={`absolute -left-2 sm:-left-3 md:-left-4 top-1/2 -translate-y-1/2 z-10 transition-opacity ${scrollPosition <= 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
            aria-label="Previous"
            onClick={scrollPrev}
            disabled={scrollPosition <= 0}
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-black shadow-md rounded-full">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="sm:w-5 sm:h-5">
                <path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>

          {/* Categories Slider with touch controls */}
          <div 
            className="overflow-hidden" 
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className="flex transition-transform duration-300 ease-in-out" 
              style={{ transform: `translateX(-${scrollPosition * (100 / itemsPerView)}%)` }}
            >
              {categories.map((category, index) => (
                <div 
                  key={index} 
                  className="flex-none px-2 sm:px-3 cursor-pointer group"
                  style={{ width: itemWidth }}
                >
                  {/* Category Image Container - responsive padding */}
                  <div className="relative mb-2 sm:mb-3">
                  <div className="bg-white rounded-full aspect-square overflow-hidden shadow-sm relative">
  <Image
    src={category.image}
    alt={category.name}
    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
    fill
    sizes="(max-width: 640px) 100px, (max-width: 768px) 120px, 150px"
  />
</div>
                  </div>
                  
                  {/* Category Info - responsive text */}
                  <h3 className="text-xs sm:text-sm text-center text-gray-800 font-medium mb-0.5 sm:mb-1">
                    {category.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Next Button - responsive positioning */}
          <button 
            className={`absolute -right-2 sm:-right-3 md:-right-4 top-1/2 -translate-y-1/2 z-10 transition-opacity ${scrollPosition >= maxScroll ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
            aria-label="Next"
            onClick={scrollNext}
            disabled={scrollPosition >= maxScroll}
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-black shadow-md rounded-full">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="sm:w-5 sm:h-5">
                <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
        </div>

        {/* Hero-style dot indicators with progress animation */}
        <div className="flex justify-center mt-4 md:mt-6 space-x-3 z-30">
          {Array.from({ length: maxScroll + 1 }).map((_, idx) => (
            <button 
              key={idx}
              onClick={() => {
                setIsAnimating(true);
                setScrollPosition(idx);
                setTimeout(() => setIsAnimating(false), 300);
                resetTimer();
              }}
              className={`relative h-3 transition-all duration-500 ${
                idx === scrollPosition ? 'w-12 bg-gray-800' : 'w-3 bg-gray-300'
              } rounded-full overflow-hidden`}
              aria-label={`Go to slide ${idx + 1}`}
            >
              {idx === scrollPosition && autoScrollEnabled && (
                <span 
                  className="absolute inset-0 bg-gray-500 animate-progress" 
                  style={{
                    animation: 'progress 6s linear forwards'
                  }}
                ></span>
              )}
            </button>
          ))}
        </div>

        {/* Progress animation keyframes */}
        <style jsx>{`
          @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}</style>

        {/* Browse All Button - responsive padding/margin */}
        <div className="text-center lg:mt-24 md:mt-14 sm:mt-8 mt-8 ">
          <button className="px-6 sm:px-8 py-1.5 sm:py-2 border border-gray-300 rounded text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
            Browse All Categories
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;