"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Upload, X } from "lucide-react";

export default function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [showSavingPopup, setShowSavingPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brand: "",
    price: 0,
    stock: 0,
    color: "",
    category: "",
    NewArrival: false,
    TopProduct: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "NewArrival" || name === "TopProduct") {
      setFormData({
        ...formData,
        [name]: value === "true",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/categories?limit=full`);
        const data = await res.json();

        // console.log(data.categories);

        setCategories(data.categories);
        // setTotalPages(2); // Optional: calculate total pages based on result length
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    setImagePreview("");
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowSavingPopup(true);

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("brand", formData.brand);
      form.append("price", formData.price);
      form.append("stock", formData.stock);
      form.append("color", formData.color);
      form.append("category", formData.category);
      form.append("NewArrival", formData.NewArrival);
      form.append("TopProduct", formData.TopProduct);
      if (imageFile) form.append("image", imageFile);

      const response = await fetch("/api/products", {
        method: "POST",
        body: form,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to create product");
      }

      const data = await response.json();
      setShowSavingPopup(false);
      // console.log("Product created successfully:", data);
      alert("Product created successfully!");
      router.push("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error);
      setShowSavingPopup(false);
      alert("Failed to create product");
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Saving Popup */}
      {showSavingPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
              <p className="text-lg font-medium text-gray-900">
                Saving Product...
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link
              href="/admin/products"
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Add New Product
            </h1>
          </div>
          <button
            type="button"
            onClick={() => document.getElementById("product-form").submit()}
            disabled={loading}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {loading ? (
              <>Processing...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Product
              </>
            )}
          </button>
        </div>

        <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-semibold text-gray-900">
                Basic Information
              </h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                {/* Product Name */}
                <div className="sm:col-span-4">
                  <label className="block text-sm font-semibold text-gray-800">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter product name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-gray-50 text-gray-900 shadow-sm focus:ring-indigo-600 focus:border-indigo-600 block w-full sm:text-sm border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                {/* Price */}
                <div className="sm:col-span-3">
                  <label className="block text-sm font-semibold text-gray-800">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    min="0"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    className="bg-gray-50 text-gray-900 shadow-sm focus:ring-indigo-600 focus:border-indigo-600 block w-full sm:text-sm border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                {/* Category */}
                <div className="sm:col-span-3">
                  <label className="block text-sm font-semibold text-gray-800">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="bg-gray-50 text-gray-900 shadow-sm focus:ring-indigo-600 focus:border-indigo-600 block w-full sm:text-sm border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stock Quantity */}
                <div className="sm:col-span-3">
                  <label className="block text-sm font-semibold text-gray-800">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    id="stock"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    className="bg-gray-50 text-gray-900 shadow-sm focus:ring-indigo-600 focus:border-indigo-600 block w-full sm:text-sm border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                {/* Brand */}
                <div className="sm:col-span-3">
                  <label className="block text-sm font-semibold text-gray-800">
                    Brand <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="brand"
                    id="brand"
                    required
                    value={formData.brand}
                    onChange={handleChange}
                    className="bg-gray-50 text-gray-900 shadow-sm focus:ring-indigo-600 focus:border-indigo-600 block w-full sm:text-sm border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                {/* Color */}
                <div className="sm:col-span-3">
                  <label className="block text-sm font-semibold text-gray-800">
                    Color <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="color"
                    id="color"
                    required
                    value={formData.color}
                    onChange={handleChange}
                    className="bg-gray-50 text-gray-900 shadow-sm focus:ring-indigo-600 focus:border-indigo-600 block w-full sm:text-sm border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div className="sm:col-span-3"></div>

                {/* New or Not  */}
                <div className="sm:col-span-3">
                  <label className="block text-sm font-semibold text-gray-800">
                    New Product <span className="text-red-500">*</span>
                  </label>

                  <div className="flex items-center gap-4 mt-2">
                    <label className="flex items-center gap-1 text-sm text-gray-700">
                      <input
                        type="radio"
                        name="NewArrival"
                        value="true"
                        checked={formData.NewArrival === true}
                        onChange={handleChange}
                        required
                      />
                      Yes
                    </label>
                    <label className="flex items-center gap-1 text-sm text-gray-700">
                      <input
                        type="radio"
                        name="NewArrival"
                        value="false"
                        checked={formData.NewArrival === false}
                        onChange={handleChange}
                      />
                      No
                    </label>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-semibold text-gray-800">
                    is Top Product <span className="text-red-500">*</span>
                  </label>

                  <div className="flex items-center gap-4 mt-2">
                    <label className="flex items-center gap-1 text-sm text-gray-700">
                      <input
                        type="radio"
                        name="TopProduct"
                        value="true"
                        checked={formData.TopProduct === true}
                        onChange={handleChange}
                        required
                      />
                      Yes
                    </label>
                    <label className="flex items-center gap-1 text-sm text-gray-700">
                      <input
                        type="radio"
                        name="TopProduct"
                        value="false"
                        checked={formData.TopProduct === false}
                        onChange={handleChange}
                      />
                      No
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div className="sm:col-span-6">
                  <label className="block text-sm font-semibold text-gray-800">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className="bg-gray-50 text-gray-900 shadow-sm focus:ring-indigo-600 focus:border-indigo-600 block w-full sm:text-sm border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-semibold text-gray-900">
                Product Image
              </h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="flex flex-col space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Product Image <span className="text-red-500">*</span>
                </label>

                {imagePreview ? (
                  <div className="mt-4">
                    <div className="relative w-1/3">
                      <div className="group block w-full aspect-w-10 aspect-h-10 rounded-lg bg-gray-100 overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          className="object-cover w-full h-full"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-bl-lg"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleImageUpload}
                            accept="image/*"
                            required
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end">
            <Link
              href="/admin/products"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
