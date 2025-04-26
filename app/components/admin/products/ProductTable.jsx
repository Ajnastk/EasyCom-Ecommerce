'use client';
import { Checkbox } from '../../../../app/components/ui/Checkbox';
import { Badge } from '../../../../app/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';

export default function ProductTable({
  products,
  selectedProducts,
  setSelectedProducts,
  onEdit,
  onDelete
}) {
  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(products.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const toggleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
              <Checkbox
                checked={selectedProducts.length === products.length && products.length > 0}
                onChange={toggleSelectAll}
              />
            </th>
            <th scope="col" className="px-3 py-3 text-left text-sm font-semibold text-gray-900">
              Product
            </th>
            <th scope="col" className="px-3 py-3 text-left text-sm font-semibold text-gray-900">
              SKU
            </th>
            <th scope="col" className="px-3 py-3 text-left text-sm font-semibold text-gray-900">
              Category
            </th>
            <th scope="col" className="px-3 py-3 text-left text-sm font-semibold text-gray-900">
              Price
            </th>
            <th scope="col" className="px-3 py-3 text-left text-sm font-semibold text-gray-900">
              Stock
            </th>
            <th scope="col" className="px-3 py-3 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
            <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {products.map((product) => (
            <tr 
              key={product.id} 
              className={selectedProducts.includes(product.id) ? 'bg-gray-50' : undefined}
            >
              <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                <Checkbox
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => toggleSelectProduct(product.id)}
                />
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <img 
                      className="h-10 w-10 rounded-md object-cover" 
                      src={product.images[0] || '/placeholder-product.jpg'} 
                      alt={product.name} 
                    />
                  </div>
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">{product.name}</div>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {product.sku}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {product.category}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                {formatCurrency(product.price)}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                {product.stock}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <Badge 
                  variant={
                    product.status === 'active' ? 'success' : 
                    product.status === 'draft' ? 'warning' : 'danger'
                  }
                >
                  {product.status}
                </Badge>
              </td>
              <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <button
                  onClick={() => onEdit(product)}
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(product)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}