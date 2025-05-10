"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { ShoppingBag, Star, Search, Filter, ChevronDown } from "lucide-react";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 border-1 hover:shadow-lg transition-shadow duration-300">
      <div className="relative overflow-hidden rounded-lg bg-gray-50 mb-3 sm:mb-4 aspect-square">
        <Image
          src={
            product.image ||
            `https://via.placeholder.com/300x300?text=${product.name}`
          }
          alt={product.name}
          width={300}
          height={300}
          className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
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

        <button className="px-6 items-center justify-center sm:px-8 py-1.5 sm:py-2 border border-gray-300 rounded text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer flex duration-300">
          <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

// New Shimmer UI Components
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

const FilterSection = ({ title, options, selectedOptions, onChange }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex items-center justify-between w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="mt-3 space-y-2">
          {options.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                type="checkbox"
                id={`${title}-${option.value}`}
                value={option.value}
                checked={selectedOptions.includes(option.value)}
                onChange={(e) => {
                  const value = e.target.value;
                  onChange(
                    selectedOptions.includes(value)
                      ? selectedOptions.filter((item) => item !== value)
                      : [...selectedOptions, value]
                  );
                }}
                className="w-4 h-4 text-[#1a2649] border-gray-300 rounded focus:ring-[#1a2649]"
              />
              <label
                htmlFor={`${title}-${option.value}`}
                className="ml-2 text-sm text-gray-700"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AllProducts = () => {
  // State for API data
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  
  // State for filters
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
  const [sortBy, setSortBy] = useState("featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Simulate network delay for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const res = await fetch(
        `/api/products?page=${currentPage}&search=${searchTerm}`
      );
      const data = await res.json();

      if (res.ok) {
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } else {
        throw new Error(data.error || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    // Apply color filter
    if (selectedColors.length > 0) {
      result = result.filter((product) =>
        product.colors?.some((color) => selectedColors.includes(color))
      );
    }

    // Apply price range filter
    result = result.filter(
      (product) =>
        product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Apply sorting
    switch (sortBy) {
      case "price-low-high":
        return result.sort((a, b) => a.price - b.price);
      case "price-high-low":
        return result.sort((a, b) => b.price - a.price);
      case "newest":
        return result.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
      case "rating":
        return result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "discount":
        return result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
      default:
        return result;
    }
  }, [products, selectedCategories, selectedColors, priceRange, sortBy]);

  const categoryOptions = [
    { label: "Earrings", value: "earrings" },
    { label: "Necklaces", value: "necklaces" },
    { label: "Bracelets", value: "bracelets" },
    { label: "Rings", value: "rings" },
  ];

  const colorOptions = [
    { label: "Gold", value: "gold" },
    { label: "Silver", value: "silver" },
    { label: "Rose Gold", value: "rose-gold" },
  ];

  return (
    <section className="bg-white py-8 sm:py-12 lg:py-16">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mt-28 mb-8 sm:mb-12">
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our complete collection of Products.
          </p>
        </div>

        {/* Search and Sort Bar */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#1a2649] focus:border-[#1a2649] block w-full pl-10 p-2.5"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden flex items-center justify-center px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#1a2649] focus:border-[#1a2649] block w-full p-2.5 pr-8 appearance-none"
              >
                <option value="featured">Featured</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="rating">Top Rated</option>
                <option value="discount">Highest Discount</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filter Sidebar */}
          <aside
            className={`w-full md:w-64 md:block ${
              isFilterOpen ? "block" : "hidden"
            }`}
          >
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-[#1a2649] mb-4">Filters</h2>

              {/* Price Range Filter */}
              <div className="border-b border-gray-200 py-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Price Range
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      ${priceRange.min} - ${priceRange.max}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange({
                        ...priceRange,
                        max: Number(e.target.value),
                      })
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <FilterSection
                title="Categories"
                options={categoryOptions}
                selectedOptions={selectedCategories}
                onChange={setSelectedCategories}
              />

              {/* Color Filter */}
              <FilterSection
                title="Colors"
                options={colorOptions}
                selectedOptions={selectedColors}
                onChange={setSelectedColors}
              />

              {/* Clear Filters Button */}
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedColors([]);
                  setPriceRange({ min: 0, max: 500 });
                }}
                className="mt-4 w-full py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              // Shimmer Effect while loading
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {/* Add shimmer animation styles */}
                <style jsx global>{`
                  @keyframes shimmer {
                    0% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                  }
                  .animate-shimmer {
                    animation: shimmer 2s infinite linear;
                  }
                `}</style>
                
                {Array.from({ length: 8 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">
                  No products match your filters.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategories([]);
                    setSelectedColors([]);
                    setPriceRange({ min: 0, max: 500 });
                  }}
                  className="mt-4 px-6 py-2 bg-[#1a2649] text-white rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 rounded ${
                          currentPage === i + 1
                            ? "bg-[#1a2649] text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllProducts;