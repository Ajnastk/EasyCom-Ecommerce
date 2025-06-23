// app/api/cart/add/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Cart from "@/lib/models/Cart";

export async function POST(req) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { product, quantity = 1 } = await req.json();

    // Validate product data
    if (!product || !product._id) {
      return Response.json({ error: "Valid product data is required" }, { status: 400 });
    }

    if (quantity < 1) {
      return Response.json({ error: "Quantity must be at least 1" }, { status: 400 });
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === product._id.toString()
    );

    if (existingItemIndex !== -1) {
      // Product exists, update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new product to cart
      cart.items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        quantity: quantity,
      });
    }

    await cart.save();

    return Response.json({ 
      message: "Item added to cart successfully",
      cartItemsCount: cart.items.length
    });

  } catch (err) {
    console.error("Cart Add Error:", err);
    return Response.json({ error: "Failed to add item to cart" }, { status: 500 });
  }
}