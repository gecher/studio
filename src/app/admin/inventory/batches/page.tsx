
'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { PlusCircle, PackageSearch, Edit, Trash2, Filter } from 'lucide-react';
import { useSearchParams } from 'next/navigation';


import { Button } from '@/components/ui/button';
import { DataTable } from '@/app/admin/_components/data-table';
import AdminHeader from '@/app/admin/_components/admin-header';
import { mockBatches, mockProducts } from '@/app/admin/_lib/mock-data';
import type { Batch, Product } from '@/app/admin/_types';
import { 
  createSelectColumn, 
  createStatusColumn, 
  createActionsColumn,
  createGenericColumn
} from '@/app/admin/_components/columns-common';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export default function ManageBatchesPage() {
  const searchParams = useSearchParams();
  const filterProductId = searchParams.get('productId');

  const [allBatches, setAllBatches] = React.useState<Batch[]>(mockBatches);
  const [products, setProducts] = React.useState<Product[]>(mockProducts);
  const [selectedProductId, setSelectedProductId] = React.useState<string | undefined>(filterProductId || undefined);

  const displayedBatches = React.useMemo(() => {
    let filtered = allBatches;
    if (selectedProductId) {
      filtered = filtered.filter(batch => batch.productId === selectedProductId);
    }
    return filtered.map(batch => ({
        ...batch,
        productName: products.find(p => p.id === batch.productId)?.name || 'Unknown Product'
    }));
  }, [allBatches, selectedProductId, products]);
  
  const handleDeleteBatch = (batchId: string) => {
    console.log("Delete batch:", batchId);
    setAllBatches(prev => prev.filter(batch => batch.id !== batchId));
  };

  const columns: ColumnDef<Batch & { productName?: string }>[] = [
    createSelectColumn<Batch>(),
    createGenericColumn<Batch>('id', 'Batch ID'),
    {
        accessorKey: 'productName',
        header: 'Product Name',
        cell: ({ row }) => (
            <Link href={`/admin/inventory/${row.original.productId}`} className="text-primary hover:underline">
                {row.original.productName}
            </Link>
        )
    },
    createGenericColumn<Batch>('batchNumber', 'Batch #'),
    createGenericColumn<Batch>('quantity', 'Quantity'),
    createGenericColumn<Batch>('expiryDate', 'Expiry Date'),
    createStatusColumn<Batch>('status', 'Status'),
    createActionsColumn<Batch & { productName?: string }>({
      // No direct view page for batch, edit is main action
      editHref: (id) => `/admin/inventory/batches/edit/${id}`, 
      onDelete: handleDeleteBatch,
    }),
  ];

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Manage Product Batches"
         breadcrumbs={[{ label: 'Inventory Management', href: '/admin/inventory' }, { label: 'Batches' }]}
        actionButton={
          <Link href="/admin/inventory/batches/add" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Batch
            </Button>
          </Link>
        }
      />
      
      <div className="flex items-center space-x-4">
        <div className="w-full md:w-1/3">
            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by Product..." />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={undefined as any}>All Products</SelectItem> {/* Allow "All" selection */}
                {products.map(product => (
                <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>
        {/* TODO: Add filter by status (active, near_expiry, expired) */}
      </div>

      <DataTable 
        columns={columns} 
        data={displayedBatches}
        searchKey="batchNumber"
        searchPlaceholder="Search by batch number..."
      />
    </div>
  );
}
