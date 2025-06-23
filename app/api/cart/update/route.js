// /api/cart/update/route.js
import dbConnect from "@/lib/mongodb";
import Cart from "@/lib/models/Cart";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { productId, quantity } = await req.json();

    // Validate input
    if (!productId) {
      return Response.json({ error: "Product ID is required" }, { status: 400 });
    }

    if (quantity === undefined || quantity < 0) {
      return Response.json({ error: "Valid quantity is required" }, { status: 400 });
    }

    // Find user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return Response.json({ error: "Cart not found" }, { status: 404 });
    }

    // Find the item in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (itemIndex === -1) {
      return Response.json({ error: "Item not found in cart" }, { status: 404 });
    }

    // If quantity is 0, remove the item
    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
      await cart.save();
      return Response.json({ 
        message: "Item removed from cart",
        action: "removed"
      });
    }

    // Update the quantity
    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    return Response.json({ 
      message: "Cart updated successfully",
      action: "updated",
      newQuantity: quantity
    });

  } catch (err) {
    console.error("Cart Update Error:", err);
    return Response.json({ error: "Failed to update cart" }, { status: 500 });
  }
}