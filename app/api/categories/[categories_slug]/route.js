import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";
import categoryModel from "@/lib/models/Category";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get single category
export async function GET(request, { params }) {
  try {
    await dbConnect();

    // Find by either ID or slug
    const category = await categoryModel.findOne({
      $or: [{ _id: params.categories_slug }, { slug: params.categories_slug }],
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch category: " + error.message },
      { status: 500 }
    );
  }
}

// UPDATE category
export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  // console.log("Full session object:", session); // Debug log

  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const formData = await request.formData();
    const name = formData.get("name");
    const slug = formData.get("slug");
    const description = formData.get("description");
    const imageFile = formData.get("image");
    const removeImage = formData.get("removeImage") === "true";

    // Find existing category
    const existingCategory = await categoryModel.findOne({
      $or: [{ _id: params.categories_slug }, { slug: params.categories_slug }],
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    let imageUrl = existingCategory.image;

    // Handle image removal
    if (removeImage && imageUrl) {
      try {
        const publicId = imageUrl.split("/").pop().split(".")[0];
        const fullPublicId = `ecommerce-categories/${publicId}`;
        await cloudinary.uploader.destroy(fullPublicId);
        imageUrl = null;
      } catch (cloudinaryError) {
        console.error("Cloudinary deletion error:", cloudinaryError);
      }
    }

    // Handle new image upload
    if (imageFile) {
      try {
        // Delete old image if exists
        if (imageUrl) {
          const publicId = imageUrl.split("/").pop().split(".")[0];
          const fullPublicId = `ecommerce-categories/${publicId}`;
          await cloudinary.uploader.destroy(fullPublicId);
        }

        // Upload new image
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: "ecommerce-categories",
                resource_type: "image",
              },
              (error, result) => {
                if (error) return reject(error);
                resolve(result);
              }
            )
            .end(buffer);
        });

        imageUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 }
        );
      }
    }

    // Update category
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      existingCategory._id,
      {
        name,
        slug,
        description,
        image: imageUrl,
      },
      { new: true }
    );

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Failed to update category: " + error.message },
      { status: 500 }
    );
  }
}

// DELETE category
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  // console.log("Full session object:", session); // Debug log

  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const category = await categoryModel.findOne({
      $or: [{ _id: params.categories_slug }, { slug: params.categories_slug }],
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Delete image from Cloudinary if it exists
    if (category.image) {
      try {
        const publicId = category.image.split("/").pop().split(".")[0];
        const fullPublicId = `ecommerce-categories/${publicId}`;
        await cloudinary.uploader.destroy(fullPublicId);
      } catch (cloudinaryError) {
        console.error("Cloudinary deletion error:", cloudinaryError);
      }
    }

    // Delete the category from MongoDB
    await categoryModel.findByIdAndDelete(category._id);

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete category: " + error.message },
      { status: 500 }
    );
  }
}
