// app/api/cart/get/route.js
import dbConnect from "@/lib/mongodb";
import Cart from "@/lib/models/Cart";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return Response.json({ cart: [] }, { status: 200 });
    }

    return Response.json({ cart: cart.items }, { status: 200 });
  } catch (err) {
    console.error("Cart Fetch Error:", err);
    return Response.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}
