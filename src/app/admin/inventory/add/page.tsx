
'use client';

import * as React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Save, X, DollarSign, Hash, Archive } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AdminHeader from '@/app/admin/_components/admin-header';
import { useToast } from '@/hooks/use-toast';

const productSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters." }),
  description: z.string().optional(),
  category: z.string().min(2, { message: "Category is required." }),
  price: z.coerce.number().positive({ message: "Price must be a positive number." }),
  stock: z.coerce.number().int().min(0, { message: "Stock cannot be negative." }),
  sku: z.string().min(3, { message: "SKU is required." }).optional(),
  requiresPrescription: z.boolean().default(false),
  status: z.enum(['in_stock', 'out_of_stock', 'low_stock']).default('in_stock'),
  // Fields for first batch (optional, can be added separately)
  batchNumber: z.string().optional(),
  expiryDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), { message: "Invalid expiry date"}),
  batchQuantity: z.coerce.number().int().min(0).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AddProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { register, handleSubmit, control, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      requiresPrescription: false,
      status: 'in_stock',
    }
  });

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    console.log('New product data:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Product Created",
      description: `Product ${data.name} has been successfully created.`,
    });
    router.push('/admin/inventory'); 
  };

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Add New Product"
        breadcrumbs={[{ label: 'Inventory Management', href: '/admin/inventory' }, { label: 'Add New' }]}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea id="description" {...register('description')} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                {/* TODO: Fetch categories from API or use a predefined list */}
                <Input id="category" {...register('category')} placeholder="e.g., Antibiotic, Supplement" />
                {errors.category && <p className="text-sm text-destructive mt-1">{errors.category.message}</p>}
              </div>
              <div>
                <Label htmlFor="sku">SKU (Optional)</Label>
                <Input id="sku" {...register('sku')} />
                {errors.sku && <p className="text-sm text-destructive mt-1">{errors.sku.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Price (ETB)</Label>
                <div className="relative">
                    <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                    <Input id="price" type="number" step="0.01" {...register('price')} className="pl-7"/>
                </div>
                {errors.price && <p className="text-sm text-destructive mt-1">{errors.price.message}</p>}
              </div>
              <div>
                <Label htmlFor="stock">Initial Stock Quantity</Label>
                 <div className="relative">
                    <Archive className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                    <Input id="stock" type="number" {...register('stock')} className="pl-7" />
                </div>
                {errors.stock && <p className="text-sm text-destructive mt-1">{errors.stock.message}</p>}
              </div>
               <div>
                <Label htmlFor="status">Stock Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in_stock">In Stock</SelectItem>
                        <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                        <SelectItem value="low_stock">Low Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status && <p className="text-sm text-destructive mt-1">{errors.status.message}</p>}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Controller
                  name="requiresPrescription"
                  control={control}
                  render={({ field }) => (
                      <Checkbox 
                        id="requiresPrescription" 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                       />
                  )}
                />
              <Label htmlFor="requiresPrescription" className="font-normal">Requires Prescription</Label>
            </div>

            <Separator className="my-6" />
            <h3 className="text-lg font-medium">Initial Batch (Optional)</h3>
            <p className="text-sm text-muted-foreground">You can add more batches later.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <Label htmlFor="batchNumber">Batch Number</Label>
                    <Input id="batchNumber" {...register('batchNumber')} />
                </div>
                <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input id="expiryDate" type="date" {...register('expiryDate')} />
                     {errors.expiryDate && <p className="text-sm text-destructive mt-1">{errors.expiryDate.message}</p>}
                </div>
                <div>
                    <Label htmlFor="batchQuantity">Batch Quantity</Label>
                    <Input id="batchQuantity" type="number" {...register('batchQuantity')} />
                </div>
            </div>


          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Link href="/admin/inventory" passHref>
              <Button variant="outline" type="button">
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </Link>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" /> Save Product
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

function Separator({ className }: { className?: string }) {
  return <hr className={`border-border ${className}`} />;
}
