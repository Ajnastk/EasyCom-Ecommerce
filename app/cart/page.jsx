"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCart } from "@/store/cartSlice";
import Cart from "../components/Cart";

export default function CartPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadCart() {
      const res = await fetch("/api/cart/get");
      const data = await res.json();
      dispatch(setCart(data.cart || []));
    }
    loadCart();
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mt-6">Shopping Cart</h1>
      <Cart />
    </div>
  );
}
