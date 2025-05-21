import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import categoryModel from "@/lib/models/Category";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

 cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

export async function POST(request) {

  const session = await getServerSession(authOptions);
  // console.log("Full session object:", session); // Debug log
  
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Debug: Check if environment variables are loaded
    // console.log("Cloudinary Config Check:", {
    //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "✅ Loaded" : "❌ Missing",
    //   api_key: process.env.CLOUDINARY_API_KEY ? "✅ Loaded" : "❌ Missing",
    //   api_secret: process.env.CLOUDINARY_API_SECRET ? "✅ Loaded" : "❌ Missing"
    // });

    // Configure Cloudinary
   
    await dbConnect();

    // Use FormData API to handle multipart/form-data
    const formData = await request.formData();

    // Extract form fields and log them for debugging
    const name = formData.get("name");
    const slug = formData.get("slug");
    const description = formData.get("description") || "";
    const image = formData.get("image");

    // console.log("Form data received:", { name, slug, description, imageExists: !!image });

    let imageUrl = "";

    // Handle image upload via Cloudinary
    if (image && image instanceof File) {
      try {
        // console.log("Processing image:", image.name, image.type, image.size);

        // Convert file to base64 string for Cloudinary upload
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64String = `data:${image.type};base64,${buffer.toString(
          "base64"
        )}`;

        // console.log("Uploading to Cloudinary...");

        // Upload to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload(
            base64String,
            {
              folder: "ecommerce-categories",
              resource_type: "image",
            },
            (error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error);
                reject(error);
              } else {
                console.log("Cloudinary upload success");
                resolve(result);
              }
            }
          );
        });

        // Use the secure URL from Cloudinary
        imageUrl = uploadResult.secure_url;
        // console.log("Image uploaded successfully:", imageUrl);
      } catch (uploadError) {
        console.error("Error uploading image to Cloudinary:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload image", message: uploadError.message },
          { status: 500 }
        );
      }
    }

    // Create new category in database
    // console.log("Creating category in database with image URL:", imageUrl);
    const newCategory = await categoryModel.create({
      name,
      slug,
      description,
      image: imageUrl,
    });

    // console.log("Category created successfully:", newCategory);
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category", message: error.message },
      { status: 500 }
    );
  }
}


export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);

    // Get pagination and search parameters
    const page = parseInt(searchParams.get("page")) || 1;
    const limitParam = searchParams.get("limit");
    const search = searchParams.get("search") || "";

    const isFull = limitParam === "full";
    const limit = isFull ? 0 : parseInt(limitParam) || 5;
    const skip = isFull ? 0 : (page - 1) * limit;

    // Optional search filter
    const query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Fetch categories
    const [categories, total] = await Promise.all([
      categoryModel.find(query).skip(skip).limit(limit),
      categoryModel.countDocuments(query),
    ]);

    const totalPages = isFull ? 1 : Math.max(1, Math.ceil(total / limit));

    return NextResponse.json({
      categories,
      totalPages,
      currentPage: isFull ? 1 : page,
      totalCategories: total,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories", message: error.message },
      { status: 500 }
    );
  }
}
