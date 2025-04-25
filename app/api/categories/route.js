import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import categoryModel from "@/lib/models/Category";

// GET all categories
export async function GET() {
  try {
    await dbConnect();
    const categories = await categoryModel.find({});
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST new category
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const category = await categoryModel.create(body);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
