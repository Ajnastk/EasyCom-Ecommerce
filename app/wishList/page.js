import dynamic from "next/dynamic";
const Wishlist = dynamic(() => import("@/components/Wishlist"), { ssr: false });

export default function WishlistPage() {
  return <Wishlist />;
}
