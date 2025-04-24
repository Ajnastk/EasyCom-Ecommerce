import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";
import {CategorySchema} from "@/models/Catgory";

//  Get single category
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const category = await CategorySchema.findById(params.id);
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 404 }
    );
  }
}


// UPDATE product
export async function PUT(request, { params }) {
    try {
      await dbConnect();
      const body = await request.json();
      const category = await CategorySchema.findByIdAndUpdate(params.id, body, {
        new: true,
      });
      return NextResponse.json(category);
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to update category' },
        { status: 500 }
      );
    }
  }



  
// DELETE product
export async function DELETE(request, { params }) {
    try {
      await dbConnect();
      await CategorySchema.findByIdAndDelete(params.id);
      return NextResponse.json(
        { message: 'Category deleted successfully' },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to delete category' },
        { status: 500 }
      );
    }
  }