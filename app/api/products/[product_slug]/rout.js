import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ProductSchema from "@models/Product";

// Get single Product
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const product = await ProductSchema.findById(params.id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "failed to fetch product " },
      { status: 500 }
    );
  }
}

// Update porduct
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const body = await request.json();
    const product = await ProductSchema.findByIdAndUpdate(params.id, body, {
      new: ture,
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product " },
      { status: 500 }
    );
  }
}

// Delete Product
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    await ProductSchema.findByIdAndDelete(params.id);
    return NextResponse.json(
      { message: "Product deleted Successfully" },
      { status: 200 }
    );
  } catch (error) {
    NextResponse.json({ error: "Failed to delete product " }, { status: 500 });
  }
}
