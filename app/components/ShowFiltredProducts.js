"use client";
import Link from "next/link";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { ShoppingBag, Star, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";

const ProductCard = ({ product }) => {
  const disptach = useDispatch();
  const handleAddItem = (item) => {
    disptach(addToCart(item));
  };
  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 border-1 hover:shadow-lg transition-shadow duration-300">
      <div className="relative overflow-hidden rounded-lg bg-gray-50 mb-3 sm:mb-4 aspect-square">
        {product.image && (
          <Image
            src={product.image || ``}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
          />
        )}
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-[#1a2649] text-white text-[10px] sm:text-xs font-semibold px-2 py-1 rounded">
            {product.discount}% OFF
          </span>
        )}
        {product.NewArrival && (
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
          {product.rating || 4.5} ({product.reviewCount || 0} reviews)
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

        <button
          onClick={() => handleAddItem(product)}
          className="px-6 items-center justify-center sm:px-8 py-1.5 sm:py-2 border border-gray-300 rounded text-xs sm:text-sm text-gray-700 transition-colors cursor-pointer flex duration-300  hover:bg-blue-900 hover:text-white active:bg-blue-400"
        >
          <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

// Shimmer UI Component
const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 border-1 overflow-hidden">
      {/* Image placeholder */}
      <div className="relative overflow-hidden rounded-lg bg-gray-200 mb-3 sm:mb-4 aspect-square">
        <div className="absolute inset-0 w-full h-full animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%]" />
      </div>

      <div className="space-y-2 sm:space-y-3">
        {/* Title placeholder */}
        <div className="h-5 sm:h-6 bg-gray-200 rounded-md overflow-hidden relative">
          <div className="absolute inset-0 w-full h-full animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%]" />
        </div>

        {/* Rating placeholder */}
        <div className="h-4 sm:h-5 bg-gray-200 rounded-md w-2/3 overflow-hidden relative">
          <div className="absolute inset-0 w-full h-full animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%]" />
        </div>

        {/* Price placeholder */}
        <div className="h-5 sm:h-6 bg-gray-200 rounded-md w-1/2 overflow-hidden relative">
          <div className="absolute inset-0 w-full h-full animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%]" />
        </div>

        {/* Button placeholder */}
        <div className="h-8 sm:h-10 bg-gray-200 rounded-md overflow-hidden relative">
          <div className="absolute inset-0 w-full h-full animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%]" />
        </div>
      </div>
    </div>
  );
};

const ShowFiltredProducts = ({ productType }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const containerRef = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [responseNotOkey, setResponseNotOkey] = useState(false);

  // Fetch top products from API
  const fetchTopProducts = useCallback(async () => {
    try {
      const res = await fetch(`/api/products?${productType}=true&limit=10`);
      if (!res) {
        setResponseNotOkey(true);
      }
      const data = await res.json();

      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching top products:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [productType]);

  useEffect(() => {
    fetchTopProducts();
  }, [fetchTopProducts]);

  useEffect(() => {
    const checkScrollable = () => {
      if (containerRef.current) {
        const { scrollWidth, clientWidth } = containerRef.current;
        setIsScrollable(scrollWidth > clientWidth);
        setMaxScroll(scrollWidth - clientWidth);
      }
    };

    checkScrollable();
    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, [products, loading]); // Add dependencies to recalculate when products or loading state changes

  const handleScroll = (direction) => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    const newScrollPosition =
      direction === "left"
        ? Math.max(0, container.scrollLeft - scrollAmount)
        : Math.min(maxScroll, container.scrollLeft + scrollAmount);

    container.scrollTo({
      left: newScrollPosition,
      behavior: "smooth",
    });

    setScrollPosition(newScrollPosition);
  };

  const handleScrollChange = () => {
    if (containerRef.current) {
      setScrollPosition(containerRef.current.scrollLeft);
    }
  };

  return (
    <section id="top picks" className="bg-white py-8 sm:py-12 lg:py-16">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - responsive text sizes */}
        <div className="text-center mb-8 sm:mb-12">
          {productType === "TopProduct" ? (
            <h2 className="text-center">
              <span className="text-xl sm:text-2xl md:text-3xl text-gray-800">
                Top{" "}
              </span>
              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                Picks
              </span>
            </h2>
          ) : productType === "NewArrival" ? (
            <h2 className="text-center">
              <span className="text-xl sm:text-2xl md:text-3xl text-gray-800">
                New
              </span>
              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                Picks
              </span>
            </h2>
          ) : (
            <h2></h2>
          )}
          <p className="mt-2 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium Perfume that define
            your attractiveness.
          </p>
        </div>

        {/* Products Slider Container */}
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-0">
          {/* Navigation Button - Left */}
          {isScrollable && scrollPosition > 0 && (
            <button
              onClick={() => handleScroll("left")}
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
            {loading ? (
              // Show shimmer skeletons while loading
              <>
                <style jsx global>{`
                  @keyframes shimmer {
                    0% {
                      background-position: 100% 50%;
                    }
                    100% {
                      background-position: 0% 50%;
                    }
                  }
                  .animate-shimmer {
                    animation: shimmer 2s infinite linear;
                  }
                `}</style>
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-0.75rem)] snap-center"
                  >
                    <div className="max-w-[320px] mx-auto">
                      <ProductCardSkeleton />
                    </div>
                  </div>
                ))}
              </>
            ) : error ? (
              // Show error message if fetch fails
              <div className="w-full text-center py-8 text-red-500">
                {error}
              </div>
            ) : responseNotOkey ? (
              <div className="flex justify-center items-center">
                Products is not available
              </div>
            ) : (
              // Show actual products when loaded
              products.map((product, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-0.75rem)] snap-center"
                >
                  <div className="max-w-[320px] mx-auto">
                    <ProductCard product={product} />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Navigation Button - Right */}
          {isScrollable && scrollPosition < maxScroll && (
            <button
              onClick={() => handleScroll("right")}
              className="absolute -right-2 sm:-right-6 top-1/2 -translate-y-1/2 z-50 bg-white hover:bg-gray-100 text-[#1a2649] p-2 sm:p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-6 md:mt-8">
          <Link href="/products">
            <button className="px-6 sm:px-8 py-1.5 sm:py-2 border border-gray-300 rounded text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
              View All Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ShowFiltredProducts;
