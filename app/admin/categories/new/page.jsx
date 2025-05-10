"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Upload, X } from "lucide-react";

export default function AddCategory() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [showSavingPopup, setShowSavingPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "name") {
      const generatedSlug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: generatedSlug,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowSavingPopup(true); // Show the popup when submitting

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("slug", formData.slug);
      form.append("description", formData.description);
      if (imageFile) form.append("image", imageFile);

      const res = await fetch("/api/categories", {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error("Something went wrong");

      const data = await res.json();
      setShowSavingPopup(false); // Hide popup on success
      alert("Category created successfully!");
      router.push("/admin/categories");
    } catch (error) {
      console.error("Error creating category:", error);
      setShowSavingPopup(false); // Hide popup on error
      alert("Failed to create category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.name && formData.slug && imageFile;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Saving Popup */}
      {showSavingPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
              <p className="text-lg font-medium text-gray-900">
                Saving category...
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <form id="category-form" onSubmit={handleSubmit} className="space-y-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Link
                href="/admin/categories"
                className="mr-4 text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Add New Category
              </h1>
            </div>
            <button
              type="button"
              onClick={() =>
                document.getElementById("category-form").requestSubmit()
              }
              disabled={loading || !isFormValid}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? (
                <>Processing...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Category
                </>
              )}
            </button>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="slug"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Slug *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    id="slug"
                    required
                    value={formData.slug}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Image */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Product Image
              </h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="flex flex-col space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Product Image (Required)
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

              <div className="flex justify-end mt-5">
                <Link
                  href="/admin/categories"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading || !isFormValid}
                  className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                    loading
                      ? "bg-indigo-400"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  {loading ? "Saving..." : "Save Category"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
