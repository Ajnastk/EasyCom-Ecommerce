"use client";

import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
  increaseQuantity,
  decreaseQuantity,
} from "../store/cartSlice";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";

const CartItem = ({ item, onRemove, onUpdateQuantity, loadingId }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;

    setIsUpdating(true);
    await onUpdateQuantity(item, newQuantity);
    setIsUpdating(false);
  };

  const isLoading = loadingId === (item._id || item.productId) || isUpdating;

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-700">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-lg overflow-hidden">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                width={96}
                height={96}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2">
              {item.name}
            </h3>
            <button
              onClick={() => onRemove(item)}
              disabled={isLoading}
              className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
              aria-label="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-[#1a2649]">
                ${item.price}
              </span>
              {item.originalPrice && item.originalPrice > item.price && (
                <span className="text-sm line-through text-gray-500">
                  ${item.originalPrice}
                </span>
              )}
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={isLoading || item.quantity <= 1}
                className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="w-3 h-3 text-black" />
              </button>

              <span className="w-8 text-center text-black text-sm font-medium">
                {
                  // isUpdating ? "..." :
                  item.quantity
                }
              </span>

              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={isLoading}
                className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-3 h-3 text-black" />
              </button>
            </div>
          </div>

          {/* Subtotal */}
          <div className="mt-2 text-right">
            <span className="text-sm text-gray-600">
              Subtotal:{" "}
              <span className="font-semibold text-[#1a2649]">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartSummary = ({ items }) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
  const total = subtotal + tax + shipping;

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 sticky top-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Order Summary
      </h3>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({items.length} items)</span>
          <span className="font-medium text-black">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium text-black">
            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium text-black">${tax.toFixed(2)}</span>
        </div>

        <hr className="border-gray-200" />

        <div className="flex justify-between text-lg font-semibold">
          <span className="text-gray-900">Total</span>
          <span className="text-[#1a2649]">${total.toFixed(2)}</span>
        </div>

        {subtotal < 50 && (
          <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            Add ${(50 - subtotal).toFixed(2)} more for free shipping!
          </p>
        )}
      </div>

      <button className="w-full mt-6 bg-[#1a2649] text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-900 transition-colors">
        Proceed to Checkout
      </button>
    </div>
  );
};

const EmptyCart = () => (
  <div className="text-center py-12">
    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
      <ShoppingBag className="w-12 h-12 text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      Your cart is empty
    </h3>
    <p className="text-gray-600 mb-6">
      Looks like you haven't added any items to your cart yet.
    </p>
    <Link href="/products">
      <button className="bg-[#1a2649] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors">
        Continue Shopping
      </button>
    </Link>
  </div>
);

export default function Cart() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const [loadingId, setLoadingId] = useState(null);

  const handleRemove = async (item) => {
    const itemId = item._id || item.productId;
    setLoadingId(itemId);

    // Optimistically remove from UI
    dispatch(removeFromCart(itemId));

    if (session?.user) {
      try {
        const res = await fetch("/api/cart/remove", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: item.productId || item._id }),
        });

        const data = await res.json();
        if (!res.ok) {
          console.error("Backend remove error:", data.error || "Unknown error");
          // Optional: re-add item to Redux if error happens
        }
      } catch (err) {
        console.error("Remove failed:", err);
      }
    }

    setLoadingId(null);
  };

  const handleUpdateQuantity = async (item, newQuantity) => {
    // Update local Redux store
    dispatch(
      updateQuantity({
        id: item._id || item.productId,
        quantity: newQuantity,
      })
    );

    // Sync to DB if logged in
    if (session?.user) {
      try {
        await fetch("/api/cart/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: item.productId || item._id,
            quantity: newQuantity,
          }),
        });
      } catch (err) {
        console.error("Failed to sync quantity to DB", err);
      }
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyCart />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-[200px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <button className="p-2 hover:bg-white rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Shopping Cart
            </h1>
          </div>
          <p className="text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
            your cart
          </p>
        </div>

        {/* Cart Content */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItem
                  key={item._id || item.productId}
                  item={item}
                  onRemove={handleRemove}
                  onUpdateQuantity={handleUpdateQuantity}
                  loadingId={loadingId}
                />
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="mt-8 lg:mt-0">
            <CartSummary items={cartItems} />
          </div>
        </div>
      </div>
    </div>
  );
}
