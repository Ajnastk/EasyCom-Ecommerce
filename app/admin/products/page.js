'use client';
import { useState } from 'react';
import ProductTable from '@/components/admin/Products/ProductTable';
import AddProductModal from '@/components/admin/Modals/AddProductModal';
import { Button } from '@/components/ui/Button';

export default function ProductsPage() {
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <Button onClick={() => setAddModalOpen(true)}>
          Add New Product
        </Button>
      </div>

      <ProductTable />

      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={() => setAddModalOpen(false)}
      />
    </div>
  );
}