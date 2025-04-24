import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";
import productModel from "@/lib/models/Product";

// Get all Products
export async function GET() {
  try {
    await dbConnect();
    const products = await productModel.find({});
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// Post new product 
export async function POST() {
  try {
    await dbConnect();
    const body = await request.json();
    const product = await productModel.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
