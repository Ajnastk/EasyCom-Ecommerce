"use client";

import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "../store/slices/wishlistSlice";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Heart, ShoppingBag } from "lucide-react";

const WishlistItem = ({ item, onRemove }) => {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-700">
      <div className="flex gap-4">
        <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden">
          {item.image ? (
            <Image src={item.image} alt={item.name} width={96} height={96} className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className="text-sm font-semibold text-gray-900">{item.name}</h3>
            <button onClick={() => onRemove(item)} className="text-red-500 hover:text-red-600 p-1">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-600">${item.price}</p>
        </div>
      </div>
    </div>
  );
};

export default function Wishlist() {
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();
  const { data: session } = useSession();

  const handleRemove = (item) => {
    dispatch(removeFromWishlist(item._id));
    // Optionally sync to DB
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-white py-20 text-center">
        <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Heart className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-6">Browse products and add them to your wishlist.</p>
        <Link href="/products">
          <button className="bg-[#1a2649] text-white px-6 py-2 rounded hover:bg-blue-900 transition">
            Continue Shopping
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 pt-[150px]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
          Your Wishlist
        </h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <WishlistItem key={item._id} item={item} onRemove={handleRemove} />
          ))}
        </div>
      </div>
    </div>
  );
}
