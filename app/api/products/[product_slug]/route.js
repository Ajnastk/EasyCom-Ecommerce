import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";
import productModel from "@/lib/models/Product";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Get single product
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const product = await productModel.findOne({
      $or: [
        { _id: params.product_slug },
        { slug: params.product_slug }
      ]
    })
    
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
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
  try {
    await dbConnect();
    
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const price = parseFloat(formData.get("price"));
    const stock = parseInt(formData.get("stock"));
    const category = formData.get("category");
    const status = formData.get("status");
    const newImages = formData.getAll("images");
    const imagesToRemove = formData.getAll("imagesToRemove");
    
    // Find existing product
    const existingProduct = await productModel.findOne({
      $or: [
        { _id: params.product_slug },
        { slug: params.product_slug }
      ]
    });
    
    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
    // Handle image removal from Cloudinary
    if (imagesToRemove.length > 0) {
      await Promise.all(
        imagesToRemove.map(async (publicId) => {
          try {
            const fullPublicId = `ecommerce-products/${publicId}`;
            await cloudinary.uploader.destroy(fullPublicId);
          } catch (error) {
            console.error("Error deleting image:", error);
          }
        })
      );
    }
    
    // Upload new images to Cloudinary
    const newImageUrls = [];
    
    for (const image of newImages) {
      if (image instanceof File) {
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              folder: "ecommerce-products",
              resource_type: "image"
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          ).end(buffer);
        });
        
        newImageUrls.push(uploadResult.secure_url);
      }
    }
    
    // Filter out removed images and add new ones
    const updatedImages = [
      ...existingProduct.images.filter(
        img => !imagesToRemove.includes(img.split('/').pop().split('.')[0])
      ),
      ...newImageUrls
    ];
    
    // Update product
    const updatedProduct = await productModel.findByIdAndUpdate(
      existingProduct._id,
      {
        name,
        description,
        price,
        stock,
        category,
        status,
        images: updatedImages
      },
      { new: true }
    ).populate('category', 'name');
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product: " + error.message },
      { status: 500 }
    );
  }
}

// Delete product
export async function DELETE(request, { params }) {
  try {
    // console.log("product delelte process started")
    await dbConnect();
    
    const product = await productModel.findOne({
      $or: [
        { _id: params.product_slug },
        { slug: params.product_slug }
      ]
    });
    
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
    // Delete images from Cloudinary
    if (product.image) {

          try {
            const publicId = product.image.split('/').pop().split('.')[0];
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





