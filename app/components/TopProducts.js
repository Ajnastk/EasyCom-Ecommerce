


"use client";
import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { ShoppingBag, Star, ChevronLeft, ChevronRight } from "lucide-react";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 hover:shadow-lg transition-shadow duration-300">
      <div className="relative overflow-hidden rounded-lg bg-gray-50 mb-3 sm:mb-4">
        <Image
          src={product.image || `https://via.placeholder.com/300x300?text=${product.name}`}
          alt={product.name}
          className="w-full aspect-square object-cover transition-transform duration-300 hover:scale-105"
            fill
  style={{ objectFit: 'cover' }}
        />
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-[#1a2649] text-white text-[10px] sm:text-xs font-semibold px-2 py-1 rounded">
            {product.discount}% OFF
          </span>
        )}
        {product.isNew && (
          <span className="absolute top-2 right-2 bg-[#1a2649] text-white text-[10px] sm:text-xs font-semibold px-2 py-1 rounded">
            NEW
          </span>
        )}
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-1">
          {product.name}
        </h3>

        <div className="flex items-center text-xs sm:text-sm text-gray-600">
          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1a2649] fill-[#1a2649] mr-1" />
          {product.rating} ({product.reviewCount} reviews)
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-lg sm:text-xl font-bold text-[#1a2649]">
            ${product.price}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs sm:text-sm line-through text-gray-500">
              ${product.originalPrice}
            </span>
          )}
        </div>

        <button className="px-6 items-center justify-center sm:px-8 py-1.5 sm:py-2 border border-gray-300 rounded text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer flex duration-300">
          <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

const TopProducts = () => {
  const products = [
    {
      name: "Pearl Drop Earrings",
      price: 89.99,
      originalPrice: 119.99,
      rating: 4.8,
      reviewCount: 126,
      isNew: true,
      discount: 25,
      image: "/images/pearl-earrings.jpg",
      colors: [
        { name: "Gold", value: "bg-amber-200" },
        { name: "Silver", value: "bg-gray-200" },
        { name: "Rose Gold", value: "bg-rose-200" }
      ]
    },
    {
      name: "Crystal Necklace",
      price: 129.99,
      originalPrice: 159.99,
      rating: 4.9,
      reviewCount: 88,
      isNew: true,
      discount: 20,
      image: "/images/crystal-necklace.jpg",
      colors: [
        { name: "Silver", value: "bg-gray-200" },
        { name: "Gold", value: "bg-amber-200" }
      ]
    },
    {
      name: "Charm Bracelet",
      price: 69.99,
      originalPrice: 89.99,
      rating: 4.7,
      reviewCount: 210,
      isNew: false,
      discount: 22,
      image: "/images/charm-bracelet.jpg",
      colors: [
        { name: "Gold", value: "bg-amber-200" },
        { name: "Rose Gold", value: "bg-rose-200" }
      ]
    }
  ];

  const containerRef = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  useEffect(() => {
    const checkScrollable = () => {
      if (containerRef.current) {
        const { scrollWidth, clientWidth } = containerRef.current;
        setIsScrollable(scrollWidth > clientWidth);
        setMaxScroll(scrollWidth - clientWidth);
      }
    };

    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    return () => window.removeEventListener('resize', checkScrollable);
  }, []);

  const handleScroll = (direction) => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    const newScrollPosition = direction === 'left' 
      ? Math.max(0, container.scrollLeft - scrollAmount)
      : Math.min(maxScroll, container.scrollLeft + scrollAmount);

    container.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    });

    setScrollPosition(newScrollPosition);
  };

  const handleScrollChange = () => {
    if (containerRef.current) {
      setScrollPosition(containerRef.current.scrollLeft);
    }
  };

  return (
    <section id="top picks" className=" bg-white py-8 sm:py-12 lg:py-16 mt-24">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a2649]">
            Top Picks
          </h2>
          <p className="mt-2 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium jewelry that defines elegance and style
          </p>
        </div>

        {/* Products Slider Container */}
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-0">
          {/* Navigation Button - Left */}
          {isScrollable && scrollPosition > 0 && (
            <button
              onClick={() => handleScroll('left')}
              className="absolute -left-2 sm:-left-6 top-1/2 -translate-y-1/2 z-50 bg-white hover:bg-gray-100 text-[#1a2649] p-2 sm:p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Products Wrapper */}
          <div
            ref={containerRef}
            onScroll={handleScrollChange}
            className="flex overflow-x-auto gap-3 md:gap-4 pb-4 relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] snap-x snap-mandatory"
          >
            {products.map((product, idx) => (
              <div 
                key={idx} 
                className="flex-shrink-0 w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-0.75rem)] snap-center"
              >
                <div className="max-w-[320px] mx-auto">
                  <ProductCard product={product} />
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Button - Right */}
          {isScrollable && scrollPosition < maxScroll && (
            <button
              onClick={() => handleScroll('right')}
              className="absolute -right-2 sm:-right-6 top-1/2 -translate-y-1/2 z-50 bg-white hover:bg-gray-100 text-[#1a2649] p-2 sm:p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-6 md:mt-8">
          <button className="px-6 sm:px-8 py-1.5 sm:py-2 border border-gray-300 rounded text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
           View All Products
          </button>
      </div>
      </div>
    </section>
  );
};

export default TopProducts;
