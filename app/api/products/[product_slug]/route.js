import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";
import productModel from "@/lib/models/Product";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { handler } from "../../auth/[...nextauth]/route";
import { authOptions } from "../../auth/[...nextauth]/route";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get single product
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const product = await productModel.findOne({
      $or: [{ _id: params.product_slug }, { slug: params.product_slug }],
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch product: " + error.message },
      { status: 500 }
    );
  }
}

// Update product
export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  // console.log("Full session object:", session); // Debug log

  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("Product update process started");
    await dbConnect();

    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const price = parseFloat(formData.get("price"));
    const stock = parseInt(formData.get("stock"));
    const category = formData.get("category");
    const status = formData.get("status");
    const brand = formData.get("brand");
    const color = formData.get("color");
    const NewArrival = formData.get("NewArrival");
    const TopProduct = formData.get("TopProduct");
    const newImage = formData.get("images");
    const imagesToRemove = formData.get("imagesToRemove") === "true";

    const productSlug = params.product_slug;
    const existingProduct = await productModel.findOne({
      $or: [{ _id: productSlug }, { slug: productSlug }],
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let imageUrl = existingProduct.image;
    const newImageUrls = [];

    if (imagesToRemove && existingProduct.image) {
      try {
        const publicId = existingProduct.image.split("/").pop().split(".")[0];
        const fullPublicId = `ecommerce-products/${publicId}`;
        await cloudinary.uploader.destroy(fullPublicId);
        imageUrl = null;
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }

    if (newImage) {
      try {
        if (existingProduct.image && !imagesToRemove) {
          try {
            const publicId = existingProduct.image
              .split("/")
              .pop()
              .split(".")[0];
            const fullPublicId = `ecommerce-products/${publicId}`;
            await cloudinary.uploader.destroy(fullPublicId);
          } catch (cloudinaryError) {
            console.error("Error deleting old image:", cloudinaryError);
          }
        }

        const arrayBuffer = await newImage.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: "ecommerce-products",
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
        newImageUrls.push(uploadResult.secure_url);
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 }
        );
      }
    }

    let updatedImages = existingProduct.images || [];

    if (imagesToRemove) {
      if (updatedImages && updatedImages.length > 0) {
        try {
          for (const img of updatedImages) {
            const publicId = img.split("/").pop().split(".")[0];
            const fullPublicId = `ecommerce-products/${publicId}`;
            await cloudinary.uploader.destroy(fullPublicId);
          }
        } catch (deleteError) {
          console.error("Error deleting multiple images:", deleteError);
        }
      }
      updatedImages = [];
    }

    if (newImageUrls.length > 0) {
      updatedImages = [...updatedImages, ...newImageUrls];
    }

    const updatedProduct = await productModel
      .findByIdAndUpdate(
        existingProduct._id,
        {
          name,
          description,
          price,
          stock,
          category,
          status,
          brand,
          color,
          NewArrival,
          TopProduct,
          image: imageUrl,
          images: updatedImages,
        },
        { new: true }
      )
      .populate("category", "name");

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Failed to update product: " + error.message },
      { status: 500 }
    );
  }
}

// Delete product
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  // console.log("Full session object:", session); // Debug log

  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    // console.log("product delelte process started")
    await dbConnect();

    const product = await productModel.findOne({
      $or: [{ _id: params.product_slug }, { slug: params.product_slug }],
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Delete images from Cloudinary
    if (product.image) {
      try {
        const publicId = product.image.split("/").pop().split(".")[0];
        const fullPublicId = `ecommerce-products/${publicId}`;
        await cloudinary.uploader.destroy(fullPublicId);
      } catch (cloudinaryError) {
        console.error("Cloudinary deletion error:", cloudinaryError);
      }
    }

    // Delete product from database
    await productModel.findByIdAndDelete(product._id);

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete product: " + error.message },
      { status: 500 }
    );
  }
}
