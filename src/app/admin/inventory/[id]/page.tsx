
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Edit, ArrowLeft, Package, DollarSign, Hash, Archive, AlertTriangle, CheckCircle, CalendarDays, Tag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AdminHeader from '@/app/admin/_components/admin-header';
import { useToast } from '@/hooks/use-toast';
import { mockProducts, mockBatches } from '@/app/admin/_lib/mock-data';
import type { Product, Batch } from '@/app/admin/_types';
import { DataTable } from '@/app/admin/_components/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { createStatusColumn, createGenericColumn } from '@/app/admin/_components/columns-common';

export default function ViewProductPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const productId = params.id as string;

  const [product, setProduct] = React.useState<Product | null>(null);
  const [batches, setBatches] = React.useState<Batch[]>([]);

  React.useEffect(() => {
    const foundProduct = mockProducts.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
      setBatches(mockBatches.filter(b => b.productId === productId));
    } else {
      toast({ variant: "destructive", title: "Product not found" });
      router.push('/admin/inventory');
    }
  }, [productId, router, toast]);

  if (!product) {
    return <div>Loading product data...</div>;
  }

  const DetailItem = ({ icon: Icon, label, value, isBadge = false }: { icon: React.ElementType, label: string, value?: string | number | boolean | null, isBadge?: boolean }) => {
    if (value === undefined || value === null || value === '') return null;
    let displayValue: React.ReactNode = String(value);
    if (typeof value === 'boolean') {
      displayValue = value ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-orange-500" />;
    } else if (isBadge) {
      let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
      const lowerValue = String(value).toLowerCase();
      if (lowerValue.includes('in_stock')) badgeVariant = 'default';
      else if (lowerValue.includes('low_stock')) badgeVariant = 'outline';
      else if (lowerValue.includes('out_of_stock')) badgeVariant = 'destructive';
      displayValue = <Badge variant={badgeVariant} className="capitalize">{lowerValue.replace('_', ' ')}</Badge>;
    } else if (label.toLowerCase().includes('price')) {
        displayValue = `${value} ETB`;
    }

    return (
        <div className="flex items-start text-sm py-1">
            <Icon className="h-4 w-4 text-muted-foreground mr-2 mt-0.5 shrink-0" />
            <span className="font-medium text-muted-foreground w-36">{label}:</span>
            <span className="text-foreground">{displayValue}</span>
        </div>
    );
  };
  
  const batchColumns: ColumnDef<Batch>[] = [
    createGenericColumn<Batch>('batchNumber', 'Batch #'),
    createGenericColumn<Batch>('quantity', 'Quantity'),
    createGenericColumn<Batch>('expiryDate', 'Expiry Date'),
    createStatusColumn<Batch>('status', 'Batch Status'),
    // Add actions for batches if needed (e.g., edit batch, mark as disposed)
  ];


  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Product Details"
        breadcrumbs={[{ label: 'Inventory Management', href: '/admin/inventory' }, { label: product.name }]}
        actionButton={
          <div className="flex gap-2">
            <Link href="/admin/inventory" passHref>
              <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Inventory</Button>
            </Link>
            <Link href={`/admin/inventory/edit/${product.id}`} passHref>
              <Button><Edit className="mr-2 h-4 w-4" /> Edit Product</Button>
            </Link>
          </div>
        }
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl">{product.name}</CardTitle>
            <CardDescription>Product ID: {product.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <DetailItem icon={Package} label="Category" value={product.category} />
            <DetailItem icon={DollarSign} label="Price" value={product.price} />
            <DetailItem icon={Archive} label="Stock" value={product.stock} />
            <DetailItem icon={Hash} label="SKU" value={product.sku} />
            <DetailItem icon={CheckCircle} label="Requires Rx" value={product.requiresPrescription} />
            <DetailItem icon={AlertTriangle} label="Stock Status" value={product.status} isBadge={true} />
            <DetailItem icon={CalendarDays} label="Last Updated" value={product.lastUpdated} />
            {product.name && <DetailItem icon={Tag} label="Description" value={product.name} /> /* Mocking description with name */}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Product Batches</CardTitle>
            <CardDescription>Manage and view batches for this product.</CardDescription>
          </CardHeader>
          <CardContent>
            {batches.length > 0 ? (
              <DataTable columns={batchColumns} data={batches} searchKey="batchNumber" searchPlaceholder="Search batches..." />
            ) : (
              <p className="text-muted-foreground">No batches found for this product.</p>
            )}
            <Link href={`/admin/inventory/batches/add?productId=${product.id}`} passHref>
                 <Button variant="outline" className="mt-4">Add New Batch</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for Sales History / Analytics for this product */}
      <Card>
        <CardHeader>
          <CardTitle>Sales History & Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Sales charts and statistics for this product will be displayed here.</p>
          {/* Example: <ProductSalesChart productId={product.id} /> */}
        </CardContent>
      </Card>
    </div>
  );
}
