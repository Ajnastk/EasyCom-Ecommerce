import dbConnect from "@/lib/mongodb";
import Cart from "@/lib/models/Cart";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req) {
  try {
    // console.log("started...........");

    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { productId } = await req.json(); 
    // console.log("user id",userId);
    // console.log("product id ",productId);
    
    
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return Response.json({ message: "Cart not found" }, { status: 404 });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId.toString()
    );

    await cart.save();

    return Response.json({ message: "Item removed" });
  } catch (err) {
    console.error("Remove Cart Item Error:", err);
    return Response.json({ error: "Failed to remove item" }, { status: 500 });
  }
}
