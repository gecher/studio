
'use client';

import * as React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Save, X, PackageSearch } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AdminHeader from '@/app/admin/_components/admin-header';
import { useToast } from '@/hooks/use-toast';
import { mockProducts } from '@/app/admin/_lib/mock-data';
import type { Product } from '@/app/admin/_types';

const batchSchema = z.object({
  productId: z.string().min(1, { message: "Product selection is required." }),
  batchNumber: z.string().min(1, { message: "Batch number is required." }),
  expiryDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Valid expiry date is required."}),
  quantity: z.coerce.number().int().min(1, { message: "Quantity must be at least 1." }),
  status: z.enum(['active', 'near_expiry', 'expired']).default('active'),
});

type BatchFormData = z.infer<typeof batchSchema>;

export default function AddBatchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [products, setProducts] = React.useState<Product[]>(mockProducts); // In real app, fetch this

  const preselectedProductId = searchParams.get('productId');

  const { register, handleSubmit, control, formState: { errors } } = useForm<BatchFormData>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      productId: preselectedProductId || undefined,
      status: 'active',
    }
  });

  const onSubmit: SubmitHandler<BatchFormData> = async (data) => {
    console.log('New batch data:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Batch Created",
      description: `Batch ${data.batchNumber} for product ID ${data.productId} has been successfully created.`,
    });
    // Update product stock if necessary (logic would be in backend)
    router.push('/admin/inventory/batches'); 
  };

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Add New Product Batch"
        breadcrumbs={[
            { label: 'Inventory Management', href: '/admin/inventory' }, 
            { label: 'Batches', href: '/admin/inventory/batches' },
            { label: 'Add New' }
        ]}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Batch Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="productId">Product</Label>
              <Controller
                  name="productId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="productId">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map(product => (
                            <SelectItem key={product.id} value={product.id}>{product.name} (ID: {product.id})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              {errors.productId && <p className="text-sm text-destructive mt-1">{errors.productId.message}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="batchNumber">Batch Number</Label>
                    <Input id="batchNumber" {...register('batchNumber')} />
                    {errors.batchNumber && <p className="text-sm text-destructive mt-1">{errors.batchNumber.message}</p>}
                </div>
                <div>
                    <Label htmlFor="quantity">Quantity in this Batch</Label>
                    <Input id="quantity" type="number" {...register('quantity')} />
                    {errors.quantity && <p className="text-sm text-destructive mt-1">{errors.quantity.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input id="expiryDate" type="date" {...register('expiryDate')} />
                    {errors.expiryDate && <p className="text-sm text-destructive mt-1">{errors.expiryDate.message}</p>}
                </div>
                <div>
                    <Label htmlFor="status">Initial Status</Label>
                    <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="near_expiry">Near Expiry</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                        </Select>
                    )}
                    />
                    {errors.status && <p className="text-sm text-destructive mt-1">{errors.status.message}</p>}
                </div>
            </div>

          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Link href="/admin/inventory/batches" passHref>
              <Button variant="outline" type="button">
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </Link>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" /> Save Batch
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
