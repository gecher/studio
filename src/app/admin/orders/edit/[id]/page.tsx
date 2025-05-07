
'use client';

import * as React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Save, X, Truck, CircleDollarSign } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AdminHeader from '@/app/admin/_components/admin-header';
import { useToast } from '@/hooks/use-toast';
import { mockOrders } from '@/app/admin/_lib/mock-data';
import type { Order } from '@/app/admin/_types';

const orderStatusSchema = z.object({
  status: z.enum(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded']),
  paymentStatus: z.enum(['Paid', 'Unpaid', 'Pending Refund', 'Refunded']),
  trackingNumber: z.string().optional(),
  adminNotes: z.string().optional(),
});

type OrderStatusFormData = z.infer<typeof orderStatusSchema>;

export default function EditOrderPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const orderId = params.id as string;

  const [order, setOrder] = React.useState<Order | null>(null);
  
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<OrderStatusFormData>({
    resolver: zodResolver(orderStatusSchema),
  });

  React.useEffect(() => {
    const foundOrder = mockOrders.find(o => o.id === orderId);
    if (foundOrder) {
      setOrder(foundOrder);
      reset({
        status: foundOrder.status,
        paymentStatus: foundOrder.paymentStatus as OrderStatusFormData['paymentStatus'], // cast if necessary
        // trackingNumber and adminNotes would be fetched if they exist
      });
    } else {
      toast({ variant: "destructive", title: "Order not found" });
      router.push('/admin/orders');
    }
  }, [orderId, reset, router, toast]);

  const onSubmit: SubmitHandler<OrderStatusFormData> = async (data) => {
    console.log('Updated order status data:', data);
    // Simulate API call to update order
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Order Status Updated",
      description: `Status for order ${orderId} has been updated.`,
    });
    router.push(`/admin/orders/${orderId}`); // Go back to view order page
  };

  if (!order) {
    return <div>Loading order data...</div>;
  }

  return (
    <div className="space-y-6">
      <AdminHeader 
        title={`Update Order: ${order.id}`}
        breadcrumbs={[{ label: 'Order Management', href: '/admin/orders' }, { label: 'Update Order' }]}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Update Order Status & Details</CardTitle>
            <CardDescription>Customer: {order.customerName} | Total: {order.totalAmount} ETB</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Order Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select order status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                        <SelectItem value="Refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status && <p className="text-sm text-destructive mt-1">{errors.status.message}</p>}
              </div>
              <div>
                <Label htmlFor="paymentStatus">Payment Status</Label>
                <Controller
                  name="paymentStatus"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="paymentStatus">
                        <SelectValue placeholder="Select payment status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Unpaid">Unpaid</SelectItem>
                        <SelectItem value="Pending Refund">Pending Refund</SelectItem>
                        <SelectItem value="Refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.paymentStatus && <p className="text-sm text-destructive mt-1">{errors.paymentStatus.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="trackingNumber">Tracking Number (Optional)</Label>
              <div className="relative">
                <Truck className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                <Input id="trackingNumber" {...register('trackingNumber')} className="pl-7" placeholder="e.g., DHL123456789"/>
              </div>
            </div>

            <div>
              <Label htmlFor="adminNotes">Admin Notes (Internal)</Label>
              <Textarea id="adminNotes" {...register('adminNotes')} placeholder="Add any internal notes about this order..."/>
            </div>

          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Link href={`/admin/orders/${orderId}`} passHref>
              <Button variant="outline" type="button">
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </Link>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
