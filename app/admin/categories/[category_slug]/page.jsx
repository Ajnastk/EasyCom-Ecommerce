'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Trash } from 'lucide-react'

export default function EditCategory({ params }) {
  const { id } = params
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    status: 'active',
    featured: false
  })

  useEffect(() => {
    // Fetch category data
    const fetchCategory = async () => {
      try {
        // Mock API call
        setTimeout(() => {
          const mockCategory = {
            id,
            name: 'Electronics',
            slug: 'electronics',
            description: 'All electronic devices and accessories',
            status: 'active',
            featured: true
          }
          
          setFormData({
            name: mockCategory.name,
            slug: mockCategory.slug,
            description: mockCategory.description,
            status: mockCategory.status,
            featured: mockCategory.featured
          })
          setLoading(false)
        }, 500)
      } catch (error) {
        console.error('Error fetching category:', error)
        setLoading(false)
      }
    }
    
    fetchCategory()
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Mock API call
      setTimeout(() => {
        alert('Category updated successfully!')
        router.push('/admin/categories')
      }, 1000)
    } catch (error) {
      console.error('Error updating category:', error)
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        // Mock API call
        setTimeout(() => {
          alert('Category deleted successfully')
          router.push('/admin/categories')
        }, 500)
      } catch (error) {
        console.error('Error deleting category:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <p>Loading category data...</p>
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
            <Link 
              href="/admin/categories" 
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
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
              onClick={() => document.getElementById('category-form').submit()}
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

        <form id="category-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Category Information</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name *
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

                <div className="sm:col-span-4">
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                    Slug *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    id="slug"
                    required
                    value={formData.slug}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-3">
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
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="sm:col-span-6">
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
                      Featured Category
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              href="/admin/categories"
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