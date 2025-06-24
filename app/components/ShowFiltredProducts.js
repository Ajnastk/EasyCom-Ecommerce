"use client";
import Link from "next/link";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ShoppingBag,
  Star,
  ChevronLeft,
  ChevronRight,
  Filter,
  Grid,
  List,
  SortAsc,
  Heart,
} from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { toggleWishlist } from "../store/wishlistSlice";
import { useSession } from "next-auth/react";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { data: session } = useSession();

  const wishlist = useSelector((state) => state.wishlist.items);

  const isWishlisted = wishlist.some((item) => item._id === product._id);

  const handleWishlistToggle = () => {
    if (!session?.user) {
      alert("Please login to add items to your wishlist");
      return;
    }
    dispatch(toggleWishlist(product));
  };

  const handleAddItem = async (item) => {
    // 1. Update local redux store
    dispatch(addToCart(item));

    // 2. Sync to DB if logged in
    if (session?.user) {
      try {
        await fetch("/api/cart/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product: item }),
        });
      } catch (err) {
        console.error("Failed to sync cart to DB", err);
      }
    }
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
        <div className="flex justify-between">
        <button
          onClick={() => handleAddItem(product)}
          className="px-3 items-center justify-center sm:p-2 py-1.5 sm:py-2 border border-gray-300 rounded text-xs sm:text-sm text-gray-700 transition-colors cursor-pointer flex duration-300 hover:bg-blue-900 hover:text-white active:bg-blue-400"
        >
          <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Add to Cart
        </button>
        <button
          onClick={handleWishlistToggle}
          className={`px-3 items-center justify-center sm:p-2 py-1.5 sm:py-2 border border-gray-300 rounded text-xs sm:text-sm text-gray-700 transition-colors cursor-pointer flex duration-300 hover:bg-blue-900 hover:text-white active:bg-blue-400"${
            isWishlisted
              ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
              : "border-gray-300 text-gray-700 hover:bg-blue-900"
          }`}
        >
          <Heart
            className={`w-4 h-4 mr-2 ${isWishlisted ? "fill-white" : ""}`}
          />
          {isWishlisted ? "Wishlisted" : "Wishlist"}
        </button>
        </div>
      </div>
    </div>
  );
};

// Shimmer UI Component
const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 border-1 overflow-hidden">
      <div className="relative overflow-hidden rounded-lg bg-gray-200 mb-3 sm:mb-4 aspect-square">
        <div className="absolute inset-0 w-full h-full animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%]" />
      </div>

      <div className="space-y-2 sm:space-y-3">
        <div className="h-5 sm:h-6 bg-gray-200 rounded-md overflow-hidden relative">
          <div className="absolute inset-0 w-full h-full animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%]" />
        </div>
        <div className="h-4 sm:h-5 bg-gray-200 rounded-md w-2/3 overflow-hidden relative">
          <div className="absolute inset-0 w-full h-full animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%]" />
        </div>
        <div className="h-5 sm:h-6 bg-gray-200 rounded-md w-1/2 overflow-hidden relative">
          <div className="absolute inset-0 w-full h-full animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%]" />
        </div>
        <div className="h-8 sm:h-10 bg-gray-200 rounded-md overflow-hidden relative">
          <div className="absolute inset-0 w-full h-full animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%]" />
        </div>
      </div>
    </div>
  );
};

const ShowFiltredProducts = ({
  productType,
  category,
  title,
  subtitle,
  limit = 10,
  showViewAll = true,
  viewAllLink = "/products",
  layoutType = "slider", // "slider" or "grid"
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const containerRef = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [responseNotOkey, setResponseNotOkey] = useState(false);

  // Build query parameters dynamically
  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();

    if (productType) params.append(productType, "true");
    if (category) params.append("categories", category);
    params.append("limit", limit.toString());

    return params.toString();
  }, [productType, category, limit]);

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = buildQueryParams();
      const res = await fetch(`/api/products?${queryParams}`);

      console.log(`/api/products?${queryParams}`);

      if (!res.ok) {
        setResponseNotOkey(true);
        return;
      }

      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [buildQueryParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle scrollable logic for slider layout
  useEffect(() => {
    if (layoutType !== "slider") return;

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
  }, [products, loading, layoutType]);

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

  // Generate title based on props
  const getTitle = () => {
    if (title) return title;

    if (category) {
      return (
        <h2 className="text-center">
          <span className="text-xl sm:text-2xl md:text-3xl text-gray-800 capitalize">
            {category}
          </span>
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            {" "}
            Collection
          </span>
        </h2>
      );
    }

    if (productType === "TopProduct") {
      return (
        <h2 className="text-center">
          <span className="text-xl sm:text-2xl md:text-3xl text-gray-800">
            Top
          </span>
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            {" "}
            Picks
          </span>
        </h2>
      );
    }

    if (productType === "NewArrival") {
      return (
        <h2 className="text-center">
          <span className="text-xl sm:text-2xl md:text-3xl text-gray-800">
            New
          </span>
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            {" "}
            Arrivals
          </span>
        </h2>
      );
    }

    return <h2></h2>;
  };

  const getSubtitle = () => {
    if (subtitle) return subtitle;

    if (category) {
      return `Explore our premium ${category} collection crafted for excellence.`;
    }

    return "Discover our handpicked selection of premium Perfume that define your attractiveness.";
  };

  // Render products based on layout type
  const renderProducts = () => {
    if (loading) {
      return (
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
              className={
                layoutType === "slider"
                  ? "flex-shrink-0 w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-0.75rem)] snap-center"
                  : "w-full"
              }
            >
              <div className="max-w-[320px] mx-auto">
                <ProductCardSkeleton />
              </div>
            </div>
          ))}
        </>
      );
    }

    if (error) {
      return (
        <div className="w-full text-center py-8 text-red-500">
          Error: {error}
        </div>
      );
    }

    if (responseNotOkey) {
      return (
        <div className="flex justify-center items-center py-8">
          <p className="text-gray-500">Products are not available</p>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="flex justify-center items-center py-8">
          <p className="text-gray-500">No products found</p>
        </div>
      );
    }

    return products.map((product, idx) => (
      <div
        key={product.id || idx}
        className={
          layoutType === "slider"
            ? "flex-shrink-0 w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-0.75rem)] snap-center"
            : "w-full"
        }
      >
        <div className="max-w-[320px] mx-auto">
          <ProductCard product={product} />
        </div>
      </div>
    ));
  };

  return (
    <section className="bg-white py-8 sm:py-12 lg:py-16">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          {getTitle()}
          <p className="mt-2 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            {getSubtitle()}
          </p>
        </div>

        {/* Products Container */}
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-0">
          {/* Navigation Buttons for Slider Layout */}
          {layoutType === "slider" && isScrollable && scrollPosition > 0 && (
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
            className={
              layoutType === "slider"
                ? "flex overflow-x-auto gap-3 md:gap-4 pb-4 relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] snap-x snap-mandatory"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
            }
          >
            {renderProducts()}
          </div>

          {/* Right Navigation Button for Slider Layout */}
          {layoutType === "slider" &&
            isScrollable &&
            scrollPosition < maxScroll && (
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
        {showViewAll && (
          <div className="text-center mt-6 md:mt-8">
            <Link href={viewAllLink}>
              <button className="px-6 sm:px-8 py-1.5 sm:py-2 border border-gray-300 rounded text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                View All Products
              </button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShowFiltredProducts;
