"use client";

import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../store/cartSlice";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Cart() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const [loadingId, setLoadingId] = useState(null);

  const handleRemove = async (item) => {
    // Optimistically remove from UI
    dispatch(removeFromCart(item._id));
    setLoadingId(item);

    if (session?.user) {
      
      try {
        const res = await fetch("/api/cart/remove", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: item.productId }),
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

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      {cartItems.length === 0 && <p>No items in cart.</p>}
      {cartItems.map((item) => (
        <div key={item._id || item.productId} className="flex justify-between items-center mb-2">
          <span>{item.name} × {item.quantity}</span>
          <button
            onClick={() => handleRemove(item)}
            className="text-red-500"
            disabled={loadingId === (item._id || item.productId)}
          >
            {loadingId === (item._id || item.productId) ? "Removing..." : "Remove"}
          </button>
        </div>
      ))}
    </div>
  );
}
