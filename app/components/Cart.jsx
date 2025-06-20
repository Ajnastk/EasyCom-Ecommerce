"use client";

import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../store/cartSlice";

export default function Cart() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const handleRemove = async (id) => {
    dispatch(removeFromCart(id));
    await fetch("/api/cart/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: id }),
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      {cartItems.length === 0 && <p>No items in cart.</p>}
      {cartItems.map((item) => (
        <div key={item._id} className="flex justify-between mb-2">
          <span>{item.name} x {item.quantity}</span>
          <button onClick={() => handleRemove(item._id)} className="text-red-500">Remove</button>
        </div>
      ))}
    </div>
  );
}
