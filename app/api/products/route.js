import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";
import productModel from "@/lib/models/Product";
import { log } from "console";

// Get all Products with pagination and search
export async function GET(request) {
  try {
    
    await dbConnect();
    console.log("products fetching");
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    
    const skip = (page - 1) * limit;
    
    // Build query for search
    const query = search 
      ? { name: { $regex: search, $options: 'i' } } 
      : {};
    
    // Get products and total count
    const [products, total] = await Promise.all([
      productModel.find(query).skip(skip).limit(limit),
      productModel.countDocuments(query)
    ]);
    
    return NextResponse.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// Post new product 
export async function POST(request) {
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