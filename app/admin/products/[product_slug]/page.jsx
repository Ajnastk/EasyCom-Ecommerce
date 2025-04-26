'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Upload, X, Trash } from 'lucide-react'

export default function EditProduct({ params }) {
  const { id } = params
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discountPrice: '',
    category: '',
    stock: '',
    sku: '',
    status: 'active',
    featured: false,
    description: '',
    tags: []
  })
  const [currentTag, setCurrentTag] = useState('')
  const [images, setImages] = useState([])

  useEffect(() => {
    // Fetch product data
    const fetchProduct = async () => {
      try {
        // Mock API call - replace with actual fetch
        // const res = await fetch(`/api/admin/products/${id}`)
        // const data = await res.json()
        
        setTimeout(() => {
          // Mock data
          const mockProduct = {
            id,
            name: 'Premium Headphones',
            price: '199.99',
            discountPrice: '179.99',
            category: 'Electronics',
            stock: '45',
            sku: 'PH-2023-001',
            status: 'active',
            featured: true,
            description: 'High-quality wireless headphones with noise cancellation',
            tags: ['audio', 'wireless', 'premium'],
            images: [
              { id: '1', url: '/placeholder-product.jpg', name: 'headphones.jpg' }
            ]
          }
          
          setFormData({
            name: mockProduct.name,
            price: mockProduct.price,
            discountPrice: mockProduct.discountPrice,
            category: mockProduct.category,
            stock: mockProduct.stock,
            sku: mockProduct.sku,
            status: mockProduct.status,
            featured: mockProduct.featured,
            description: mockProduct.description,
            tags: mockProduct.tags
          })
          setImages(mockProduct.images)
          setLoading(false)
        }, 500)
      } catch (error) {
        console.error('Error fetching product:', error)
        setLoading(false)
      }
    }
    
    fetchProduct()
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleAddTag = (e) => {
    e.preventDefault()
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }))
      setCurrentTag('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size
    }))
    setImages([...images, ...newImages])
  }

  const removeImage = (id) => {
    setImages(images.filter(img => img.id !== id))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Mock API call - replace with actual fetch
      // const res = await fetch(`/api/admin/products/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...formData,
      //     images: images.map(img => ({ id: img.id, url: img.url }))
      //   })
      // })
      
      setTimeout(() => {
        alert('Product updated successfully!')
        router.push('/admin/products')
      }, 1000)
    } catch (error) {
      console.error('Error updating product:', error)
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        // Mock API call - replace with actual fetch
        // await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
        
        setTimeout(() => {
          alert('Product deleted successfully')
          router.push('/admin/products')
        }, 500)
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  const categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Sports',
    'Beauty',
    'Toys',
    'Furniture',
    'Office',
    'Other'
  ]

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <p>Loading product data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/admin/products" className="mr-4 text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </button>
            <button
              type="button"
              onClick={() => document.getElementById('product-form').submit()}
              disabled={loading}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700">
                    Discount Price
                  </label>
                  <input
                    type="number"
                    name="discountPrice"
                    id="discountPrice"
                    min="0"
                    step="0.01"
                    value={formData.discountPrice}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    id="stock"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                    SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    id="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="col-span-6">
                  <div className="flex items-center">
                    <input
                      id="featured"
                      name="featured"
                      type="checkbox"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                      Featured Product
                    </label>
                  </div>
                </div>

                <div className="col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Product Images</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        multiple
                        className="sr-only"
                        onChange={handleImageUpload}
                        accept="image/*"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>

              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {images.map(image => (
                    <div key={image.id} className="relative">
                      <img
                        src={image.url}
                        alt=""
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Tags</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="flex">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="ml-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>

              {formData.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center py-1 pl-3 pr-2 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 inline-flex items-center justify-center h-4 w-4 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              href="/admin/products"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}