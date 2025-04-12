"use client";

import React, { useState } from "react";
import { ShoppingBag, Star } from "lucide-react";

const ProductCard = ({ product }) => {
  const [selectedColor, setSelectedColor] = useState(0);

  return (
    <div className="bg-white border rounded-xl p-4 hover:shadow-lg transition-shadow duration-300">
      <div className="relative overflow-hidden rounded-lg bg-gray-100 mb-4">
        <img
          src={`https://via.placeholder.com/300x300?text=${product.name}`}
          alt={product.name}
          className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
        />
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-rose-500 text-white text-xs font-semibold px-2 py-1 rounded">
            {product.discount}% OFF
          </span>
        )}
        {product.isNew && (
          <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
            NEW
          </span>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>

        <div className="flex items-center text-sm text-gray-600">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500 mr-1" />
          {product.rating} ({product.reviewCount} reviews)
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-gray-900">${product.price}</span>
          {product.originalPrice > product.price && (
            <span className="text-sm line-through text-gray-500">${product.originalPrice}</span>
          )}
        </div>

        {product.colors.length > 0 && (
          <div className="flex items-center gap-2">
            {product.colors.map((color, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedColor(idx)}
                className={`w-5 h-5 rounded-full ${color.value} border-2 ${
                  selectedColor === idx ? "ring-2 ring-gray-800" : "border-white"
                }`}
              ></button>
            ))}
          </div>
        )}

        <button className="mt-3 w-full bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-lg flex items-center justify-center font-medium text-sm">
          <ShoppingBag className="w-4 h-4 mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

const TopProducts = () => {
  const products = [
    {
      name: "Crossbody Bag",
      price: 189.99,
      originalPrice: 249.99,
      rating: 4.8,
      reviewCount: 126,
      isNew: true,
      discount: 24,
      colors: [
        { name: "Cognac", value: "bg-amber-700" },
        { name: "Black", value: "bg-gray-900" },
        { name: "Burgundy", value: "bg-red-900" }
      ]
    },
    {
      name: "Slim Fit Shirt",
      price: 59.99,
      originalPrice: 79.99,
      rating: 4.6,
      reviewCount: 88,
      isNew: false,
      discount: 25,
      colors: [
        { name: "White", value: "bg-white border" },
        { name: "Blue", value: "bg-blue-700" }
      ]
    },
    {
      name: "Running Sneakers",
      price: 129.99,
      originalPrice: 169.99,
      rating: 4.7,
      reviewCount: 210,
      isNew: true,
      discount: 20,
      colors: [
        { name: "Gray", value: "bg-gray-500" },
        { name: "Navy", value: "bg-blue-900" }
      ]
    },
    {
      name: "Denim Jacket",
      price: 99.99,
      originalPrice: 129.99,
      rating: 4.5,
      reviewCount: 64,
      isNew: false,
      discount: 23,
      colors: [
        { name: "Denim", value: "bg-blue-600" }
      ]
    },
    {
      name: "Leather Boots",
      price: 149.99,
      originalPrice: 199.99,
      rating: 4.9,
      reviewCount: 142,
      isNew: true,
      discount: 30,
      colors: [
        { name: "Brown", value: "bg-amber-900" },
        { name: "Black", value: "bg-black" }
      ]
    },
    {
      name: "Basic T-Shirt",
      price: 29.99,
      originalPrice: 39.99,
      rating: 4.3,
      reviewCount: 300,
      isNew: false,
      discount: 25,
      colors: [
        { name: "Gray", value: "bg-gray-300" },
        { name: "Black", value: "bg-black" }
      ]
    }
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Top Picks</h2>
          <p className="mt-2 text-gray-600 text-lg"> Discover our handpicked selection of premium quality products that redefine elegance and style.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product, idx) => (
            <ProductCard key={idx} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopProducts;