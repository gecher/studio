
'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { PlusCircle, PackageSearch, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/app/admin/_components/data-table';
import AdminHeader from '@/app/admin/_components/admin-header';
import { mockProducts } from '@/app/admin/_lib/mock-data';
import type { Product } from '@/app/admin/_types';
import { 
  createSelectColumn, 
  createStatusColumn, 
  createActionsColumn,
  createGenericColumn
} from '@/app/admin/_components/columns-common';
import { Badge } from '@/components/ui/badge';

export default function InventoryManagementPage() {
  const [data, setData] = React.useState<Product[]>(mockProducts);
  
  const handleDeleteProduct = (productId: string) => {
    console.log("Delete product:", productId);
    setData(prev => prev.filter(product => product.id !== productId));
  };

  const columns: ColumnDef<Product>[] = [
    createSelectColumn<Product>(),
    createGenericColumn<Product>('id', 'Product ID'),
    createGenericColumn<Product>('name', 'Name'),
    createGenericColumn<Product>('category', 'Category'),
    createGenericColumn<Product>('price', 'Price (ETB)'),
    createGenericColumn<Product>('stock', 'Stock'),
    createGenericColumn<Product>('sku', 'SKU'),
    {
      accessorKey: 'requiresPrescription',
      header: 'Rx?',
      cell: ({ row }) => row.getValue('requiresPrescription') ? <CheckCircle className="h-5 w-5 text-primary" /> : <span className="text-muted-foreground">-</span>,
    },
    createStatusColumn<Product>('status', 'Stock Status'),
    createGenericColumn<Product>('lastUpdated', 'Last Updated'),
    createActionsColumn<Product>({
      viewHref: (id) => `/admin/inventory/${id}`,
      editHref: (id) => `/admin/inventory/edit/${id}`,
      onDelete: handleDeleteProduct,
       customActions: (product) => [
        ...(product.status === 'out_of_stock' ? [{ label: 'Notify When In Stock', icon: AlertTriangle, onClick: () => console.log(`Set up notification for ${product.id}`) }] : []),
        { label: 'Manage Batches', icon: PackageSearch, href: `/admin/inventory/batches?productId=${product.id}` },
      ]
    }),
  ];

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Inventory Management"
        actionButton={
          <div className="flex gap-2">
            <Link href="/admin/inventory/batches" passHref>
                <Button variant="outline">
                    <PackageSearch className="mr-2 h-4 w-4" /> Manage All Batches
                </Button>
            </Link>
            <Link href="/admin/inventory/add" passHref>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
              </Button>
            </Link>
          </div>
        }
      />
      
      {/* TODO: Add filter controls, e.g., by category, stock status */}

      <DataTable 
        columns={columns} 
        data={data}
        searchKey="name"
        searchPlaceholder="Search by product name or SKU..."
      />
    </div>
  );
}
