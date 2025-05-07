
'use client';

import * as React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Save, X, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AdminHeader from '@/app/admin/_components/admin-header';
import { useToast } from '@/hooks/use-toast';
import { mockBatches, mockProducts } from '@/app/admin/_lib/mock-data';
import type { Batch, Product } from '@/app/admin/_types';
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

const batchEditSchema = z.object({
  productId: z.string().min(1, { message: "Product selection is required." }),
  batchNumber: z.string().min(1, { message: "Batch number is required." }),
  expiryDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Valid expiry date is required."}),
  quantity: z.coerce.number().int().min(0, { message: "Quantity cannot be negative." }), // Allow 0 for disposed/used
  status: z.enum(['active', 'near_expiry', 'expired', 'disposed']), // Added 'disposed'
});

type BatchEditFormData = z.infer<typeof batchEditSchema>;

export default function EditBatchPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const batchId = params.id as string;

  const [batch, setBatch] = React.useState<Batch | null>(null);
  const [products, setProducts] = React.useState<Product[]>(mockProducts);
  
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<BatchEditFormData>({
    resolver: zodResolver(batchEditSchema),
  });

  React.useEffect(() => {
    const foundBatch = mockBatches.find(b => b.id === batchId);
    if (foundBatch) {
      setBatch(foundBatch);
      reset({
        productId: foundBatch.productId,
        batchNumber: foundBatch.batchNumber,
        expiryDate: foundBatch.expiryDate,
        quantity: foundBatch.quantity,
        status: foundBatch.status as BatchEditFormData['status'], // Cast because mock status might not include 'disposed'
      });
    } else {
      toast({ variant: "destructive", title: "Batch not found" });
      router.push('/admin/inventory/batches');
    }
  }, [batchId, reset, router, toast]);

  const onSubmit: SubmitHandler<BatchEditFormData> = async (data) => {
    console.log('Updated batch data:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Batch Updated",
      description: `Batch ${data.batchNumber} has been updated.`,
    });
    router.push('/admin/inventory/batches');
  };

  const handleDeleteBatch = async () => {
    console.log("Deleting batch:", batchId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Batch Deleted",
      description: `Batch ${batch?.batchNumber} has been deleted.`,
      variant: "destructive"
    });
    router.push('/admin/inventory/batches');
  };

  if (!batch) {
    return <div>Loading batch data...</div>;
  }
  
  const selectedProduct = products.find(p => p.id === batch.productId);

  return (
    <div className="space-y-6">
      <AdminHeader 
        title={`Edit Batch: ${batch.batchNumber}`}
        breadcrumbs={[
            { label: 'Inventory Management', href: '/admin/inventory' }, 
            { label: 'Batches', href: '/admin/inventory/batches' },
            { label: 'Edit Batch' }
        ]}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Batch Details</CardTitle>
            <CardDescription>
                Product: {selectedProduct ? selectedProduct.name : 'Unknown'} (ID: {batch.productId}) | Batch ID: {batch.id}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="productId">Product (Read-only)</Label>
              <Input id="productId" value={selectedProduct ? `${selectedProduct.name} (ID: ${batch.productId})` : batch.productId} readOnly disabled />
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
                    <Label htmlFor="status">Status</Label>
                    <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="near_expiry">Near Expiry</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                            <SelectItem value="disposed">Disposed</SelectItem>
                        </SelectContent>
                        </Select>
                    )}
                    />
                    {errors.status && <p className="text-sm text-destructive mt-1">{errors.status.message}</p>}
                </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" type="button">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Batch
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this batch record.
                    Ensure product stock levels are adjusted accordingly if this batch still has quantity.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteBatch}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <div className="flex gap-2">
              <Link href="/admin/inventory/batches" passHref>
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
