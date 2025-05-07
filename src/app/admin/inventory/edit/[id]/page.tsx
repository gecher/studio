
'use client';

import * as React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Save, X, DollarSign, Archive, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AdminHeader from '@/app/admin/_components/admin-header';
import { useToast } from '@/hooks/use-toast';
import { mockProducts } from '@/app/admin/_lib/mock-data';
import type { Product } from '@/app/admin/_types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const productEditSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters." }),
  description: z.string().optional(),
  category: z.string().min(2, { message: "Category is required." }),
  price: z.coerce.number().positive({ message: "Price must be a positive number." }),
  stock: z.coerce.number().int().min(0, { message: "Stock cannot be negative." }),
  sku: z.string().min(3, { message: "SKU is required." }).optional(),
  requiresPrescription: z.boolean().default(false),
  status: z.enum(['in_stock', 'out_of_stock', 'low_stock']),
});

type ProductEditFormData = z.infer<typeof productEditSchema>;

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const productId = params.id as string;

  const [product, setProduct] = React.useState<Product | null>(null);
  
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<ProductEditFormData>({
    resolver: zodResolver(productEditSchema),
  });

  React.useEffect(() => {
    const foundProduct = mockProducts.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
      reset({
        name: foundProduct.name,
        description: foundProduct.name, // Assuming description is same as name for mock
        category: foundProduct.category,
        price: foundProduct.price,
        stock: foundProduct.stock,
        sku: foundProduct.sku,
        requiresPrescription: foundProduct.requiresPrescription || false,
        status: foundProduct.status,
      });
    } else {
      toast({ variant: "destructive", title: "Product not found" });
      router.push('/admin/inventory');
    }
  }, [productId, reset, router, toast]);

  const onSubmit: SubmitHandler<ProductEditFormData> = async (data) => {
    console.log('Updated product data:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Product Updated",
      description: `Product ${data.name}'s details have been updated.`,
    });
    router.push('/admin/inventory');
  };

  const handleDeleteProduct = async () => {
    console.log("Deleting product:", productId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Product Deleted",
      description: `Product ${product?.name} has been deleted.`,
      variant: "destructive"
    });
    router.push('/admin/inventory');
  };

  if (!product) {
    return <div>Loading product data...</div>;
  }

  return (
    <div className="space-y-6">
      <AdminHeader 
        title={`Edit Product: ${product.name}`}
        breadcrumbs={[{ label: 'Inventory Management', href: '/admin/inventory' }, { label: 'Edit Product' }]}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>Product ID: {product.id}</CardDescription>
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
                <Input id="category" {...register('category')} />
                {errors.category && <p className="text-sm text-destructive mt-1">{errors.category.message}</p>}
              </div>
              <div>
                <Label htmlFor="sku">SKU</Label>
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
                <Label htmlFor="stock">Current Stock</Label>
                <div className="relative">
                  <Archive className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                  <Input id="stock" type="number" {...register('stock')} className="pl-7"/>
                </div>
                {errors.stock && <p className="text-sm text-destructive mt-1">{errors.stock.message}</p>}
              </div>
              <div>
                <Label htmlFor="status">Stock Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" type="button">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Product
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the product
                    and all associated batches.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteProduct}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <div className="flex gap-2">
              <Link href="/admin/inventory" passHref>
                <Button variant="outline" type="button">
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
              </Link>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
