"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

const heroProducts = [
  {
    id: 1,
    title: "Premium Collection",
    tagline: "Elevate Your Style",
    description:
      "Discover our handcrafted luxury items designed for the discerning customer",
    badge: "New Season",
    color: "bg-indigo-600",
    accentColor: "bg-indigo-400",
    textColor: "text-indigo-100",
  },
  {
    id: 2,
    title: "Limited Edition",
    tagline: "Exclusive Release",
    description:
      "Premium products with limited availability, crafted for perfection",
    badge: "Trending",
    cta: "View Exclusives",
    color: "bg-amber-600",
    accentColor: "bg-amber-400",
    textColor: "text-amber-100",
  },
  {
    id: 3,
    title: "Signature Series",
    tagline: "Iconic Essentials",
    description:
      "Timeless classics reimagined with modern techniques and materials",
    badge: "Best Seller",
    cta: "Explore Series",
    color: "bg-emerald-700",
    accentColor: "bg-emerald-500",
    textColor: "text-emerald-100",
  },
];

const PremiumHero = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  const handleSlideChange = useCallback(
    (index) => {
      if (animating || index === activeSlide) return;
      setAnimating(true);
      setActiveSlide(index);
      setTimeout(() => setAnimating(false), 750);
    },
    [animating, activeSlide]
  );

  const startAutoSlide = useCallback(() => {
    timerRef.current = setInterval(() => {
      const nextSlide = (activeSlide + 1) % heroProducts.length;
      handleSlideChange(nextSlide);
    }, 6000);
  }, [activeSlide, handleSlideChange]);

  useEffect(() => {
    startAutoSlide();
    return () => clearInterval(timerRef.current);
  }, [startAutoSlide]);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    startAutoSlide();
  };

  return (
    <div id="home" className=" relative h-screen overflow-hidden bg-gray-900">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 z-0 bg-grid-pattern"></div>

      {/* Slides */}
      <div className="relative h-full w-full">
        {heroProducts.map((product, index) => (
          <div
            key={product.id}
            className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out flex items-center justify-center ${
              index === activeSlide
                ? "opacity-100 translate-x-0 z-10"
                : "opacity-0 translate-x-full z-0"
            }`}
          >
            <div className={`absolute inset-0 ${product.color} opacity-90`}></div>
            <div
              className={`absolute top-0 left-1/2 h-full w-1/3 ${product.accentColor} opacity-20 transform -skew-x-12`}
            ></div>

            <div className="relative z-20 flex flex-col md:flex-row items-center justify-between w-full max-w-7xl px-6 mx-auto py-20 md:py-0">
              <div className="text-white space-y-6 w-full md:w-1/2">
                <h1 className="text-4xl md:text-6xl font-bold">{product.title}</h1>
                <p className="text-2xl opacity-90">{product.tagline}</p>
                <p className="text-lg md:text-xl opacity-80 max-w-md">{product.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-30">
        {heroProducts.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              handleSlideChange(index);
              resetTimer();
            }}
            className={`relative h-3 rounded-full transition-all duration-500 ${
              index === activeSlide ? "w-12 bg-white" : "w-3 bg-white/40 rounded-full overflow-hidden"
            }`}
          >
            {index === activeSlide && (
              <span
                className="absolute  bg-white/50 animate-progress rounded-full"
                style={{ animation: "progress 6s linear forwards" }}
              ></span>
            )}
          </button>
        ))}
      </div>

      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
};

export default PremiumHero;
