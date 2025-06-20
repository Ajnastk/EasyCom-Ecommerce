"use client";

import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";

export default function AddToCartButton({ product }) {
  const dispatch = useDispatch();

  const handleAdd = async () => {
    dispatch(addToCart(product));

    // Optional: send to server API for persistence
    await fetch("/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
  };

  return (
    <button onClick={handleAdd} className="p-2 bg-blue-500 text-white rounded">
      Add to Cart
    </button>
  );
}
