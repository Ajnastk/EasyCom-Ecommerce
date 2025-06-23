"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCart } from "../store/cartSlice";
import { useSession } from "next-auth/react";
import Cart from "../components/Cart";

export default function CartPage() {
  const dispatch = useDispatch();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user) return;

    async function fetchCart() {
      try {
        const res = await fetch("/api/cart/get");
        console.log("database cart data ",res)
        const { cart } = await res.json();
        dispatch(setCart(cart || []));
      } catch (err) {
        console.error("Failed to load cart", err);
      }
    }

    fetchCart();
  }, [session]);

  return (
    <div>
      <Cart />
    </div>
  );
}
