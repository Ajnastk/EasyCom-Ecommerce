"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Global shimmer animation styles

{
  /* Progress animation */
}
<style jsx>{`
  @keyframes progress {
    0% {
      width: 0%;
    }
    100% {
      width: 100%;
    }
  }
`}</style>;
const shimmerStyles = `
  @keyframes shimmer {
    0% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .animate-shimmer {
    animation: shimmer 2s infinite linear;
    background-size: 400% 100%;
    background-image: linear-gradient(to right, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
  }
`;

const ProductCategories = () => {
  const containerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(6);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(false);
  const timerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [responseNotOkey,setResponseNotOkey] = useState(false)

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`/api/categories?limit=full`);
      if(!res){
        setResponseNotOkey(true)
      }
      const data = await res.json();

      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate responsive values
  useEffect(() => {
    const updateResponsiveValues = () => {
      const width = window.innerWidth;
      let newItemsPerView = 6;

      if (width < 640) newItemsPerView = 2;
      else if (width < 768) newItemsPerView = 3;
      else if (width < 1024) newItemsPerView = 4;
      else if (width < 1280) newItemsPerView = 5;

      setItemsPerView(newItemsPerView);
      setMaxScroll(Math.max(0, categories.length - newItemsPerView));
    };

    updateResponsiveValues();
    window.addEventListener("resize", updateResponsiveValues);
    return () => window.removeEventListener("resize", updateResponsiveValues);
  }, [categories.length]);

  // Auto-scroll
  useEffect(() => {
    if (autoScrollEnabled) {
      timerRef.current = setInterval(() => {
        setScrollPosition((prev) => (prev + 1) % (maxScroll + 1));
      }, 6000);
    }
    return () => clearInterval(timerRef.current);
  }, [autoScrollEnabled, maxScroll]);

  const scrollPrev = () => {
    if (isAnimating || scrollPosition <= 0) return;
    setIsAnimating(true);
    setScrollPosition((prev) => Math.max(0, prev - 1));
    setTimeout(() => setIsAnimating(false), 300);
  };

  const scrollNext = () => {
    if (isAnimating || scrollPosition >= maxScroll) return;
    setIsAnimating(true);
    setScrollPosition((prev) => Math.min(maxScroll, prev + 1));
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Touch handlers
  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (Math.abs(distance) > 50) {
      distance > 0 ? scrollNext() : scrollPrev();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Category skeleton component
  const CategorySkeleton = () => (
    <div
      className="flex-none px-2 sm:px-3"
      style={{ width: `${100 / itemsPerView}%` }}
    >
      <div className="relative mb-2 sm:mb-3">
        <div className="bg-gray-200 rounded-full aspect-square overflow-hidden relative">
          <div className="absolute inset-0 animate-shimmer" />
        </div>
      </div>
      <div className="h-4 bg-gray-200 rounded-md overflow-hidden relative mx-auto w-3/4">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
    </div>
  );

  return (
    <section
      id="categories"
      className="w-full max-w-screen-2xl mt-24 mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-white relative overflow-hidden"
    >
      {/* Global styles */}
      <style jsx global>
        {shimmerStyles}
      </style>

      {/* Curved edges */}
      <div className="absolute left-0 bottom-0 w-12 sm:w-16 md:w-20 lg:w-24 h-12 sm:h-16 md:h-20 lg:h-24 bg-white rounded-tr-full transform translate-y-6 sm:translate-y-8 md:translate-y-10 lg:translate-y-12 -translate-x-6 sm:-translate-x-8 md:-translate-x-10 lg:-translate-x-12" />
      <div className="absolute right-0 bottom-0 w-12 sm:w-16 md:w-20 lg:w-24 h-12 sm:h-16 md:h-20 lg:h-24 bg-white rounded-tl-full transform translate-y-6 sm:translate-y-8 md:translate-y-10 lg:translate-y-12 translate-x-6 sm:translate-x-8 md:translate-x-10 lg:translate-x-12" />

      <div className="relative z-10">
        <h2 className="text-center mb-6 md:mb-10">
          <span className="text-xl sm:text-2xl md:text-3xl text-gray-800">
            Shop By{" "}
          </span>
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Category
          </span>
        </h2>

        <div className="relative px-6 md:px-8 mt-24 lg:px-10">
          {/* Navigation buttons */}
          <button
            onClick={scrollPrev}
            disabled={scrollPosition <= 0 || loading}
            className={`absolute -left-2 sm:-left-3 md:-left-4 top-1/2 -translate-y-1/2 z-10 transition-opacity ${
              scrollPosition <= 0 || loading
                ? "opacity-50 cursor-not-allowed"
                : "opacity-100"
            }`}
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-black shadow-md rounded-full">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="sm:w-5 sm:h-5"
              >
                <path
                  d="M15 19l-7-7 7-7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>

          {/* Categories slider */}
          <div
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="overflow-hidden"
          >
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${
                  scrollPosition * (100 / itemsPerView)
                }%)`,
              }}
            >
              {loading
                ? Array.from({ length: itemsPerView + 2 }).map((_, idx) => (
                    <CategorySkeleton key={`skeleton-${idx}`} />
                  ))
                : categories.map((category, index) => (
                  <Link
                      key={index}
                      href={`/filteredProducts?category=${encodeURIComponent(category.name)}`}
                      className="flex-none px-2 sm:px-3 cursor-pointer group"
                      style={{ width: `${100 / itemsPerView}%` }}
                    >
                      <div className="relative mb-2 sm:mb-3">
                        <div className="bg-white rounded-full aspect-square overflow-hidden shadow-sm relative">
                          <Image
                            src={category.image || "/image/product.jpeg"}
                            alt={category.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            fill
                            sizes="(max-width: 640px) 100px, (max-width: 768px) 120px, 150px"
                            loader={({ src, width, quality }) => {
                              return `${src}?w=${width}&q=${quality || 75}`;
                            }}
                            unoptimized={true} // Optional: Set to false if you want Next.js to optimize
                          />
                        </div>
                      </div>
                      <h3 className="text-xs sm:text-sm text-center text-gray-800 font-medium mb-0.5 sm:mb-1">
                        {category.name}
                      </h3>
                    </Link>
                  ))}
            </div>
          </div>

          <button
            onClick={scrollNext}
            disabled={scrollPosition >= maxScroll || loading}
            className={`absolute -right-2 sm:-right-3 md:-right-4 top-1/2 -translate-y-1/2 z-10 transition-opacity ${
              scrollPosition >= maxScroll || loading
                ? "opacity-50 cursor-not-allowed"
                : "opacity-100"
            }`}
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-black shadow-md rounded-full">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="sm:w-5 sm:h-5"
              >
                <path
                  d="M9 5l7 7-7 7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>
        </div>

        {/* Pagination dots */}
        {!loading && categories.length > 0 ? (
          <div className="flex justify-center mt-4 md:mt-6 space-x-3 z-30">
            {Array.from({ length: maxScroll + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setScrollPosition(idx)}
                className={`relative h-3 transition-all duration-500 ${
                  idx === scrollPosition
                    ? "w-12 bg-gray-800"
                    : "w-3 bg-gray-300"
                } rounded-full overflow-hidden`}
              >
                {idx === scrollPosition && autoScrollEnabled && (
                  <span
                    className="absolute inset-0 bg-gray-500"
                    style={{ animation: "progress 6s linear forwards" }}
                  />
                )}
              </button>
            ))}
          </div>
        ):responseNotOkey ? (
          <div className="flex justify-center items-center text-black">Categories is not available</div>
        ):(
          <div></div>
        )}

        <div className="text-center lg:mt-24 md:mt-14 sm:mt-8 mt-8">
          <button className="px-6 sm:px-8 py-1.5 sm:py-2 border border-gray-300 rounded text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
            Browse All Categories
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;
