import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Wishlist from "@/lib/models/Whishlist";
import Product from "@/lib/models/Product";
import { error } from "console";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const wishlist = await Wishlist.findOne({ user: session.user._id }).populate(
    "Products"
  );
  return Response.json(wishlist || { product: [] });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();
  await dbConnect();

  let wishlist = await Wishlist.findOne({ user: session.user._id });
  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: session.user._id,
      products: [productId],
    });
  } else {
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }
  }
  return Response.json({ success: true });
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();
  await dbConnect();

  const wishlist = await Wishlist.findOne({ user: session.user._id });
  if (wishlist) {
    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );
    await wishlist.save();
  }
  return Response.json({ success: true });
}
