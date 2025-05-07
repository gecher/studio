
'use client';

import * as React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Save, X, RotateCcw, DollarSign, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import AdminHeader from '@/app/admin/_components/admin-header';
import { useToast } from '@/hooks/use-toast';
import { mockOrders, mockOrderItems } from '@/app/admin/_lib/mock-data';
import type { Order, OrderItem } from '@/app/admin/_types';

const refundSchema = z.object({
  refundAmount: z.coerce.number().positive({ message: "Refund amount must be positive." }),
  reason: z.string().min(10, { message: "Please provide a reason for the refund (min 10 characters)." }),
  refundMethod: z.enum(['original_payment', 'store_credit', 'bank_transfer']),
  // Add bank details if bank_transfer is selected - this would need conditional validation
  bankAccountNumber: z.string().optional(),
  bankName: z.string().optional(),
});

type RefundFormData = z.infer<typeof refundSchema>;

export default function ProcessRefundsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = React.useState<Order | null>(null);
  const [orderItems, setOrderItems] = React.useState<OrderItem[]>([]);
  
  const { register, handleSubmit, control, formState: { errors }, watch, setValue } = useForm<RefundFormData>({
    resolver: zodResolver(refundSchema),
    defaultValues: {
        refundMethod: 'original_payment',
    }
  });

  React.useEffect(() => {
    if (orderId) {
      const foundOrder = mockOrders.find(o => o.id === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
        setOrderItems(mockOrderItems[orderId] || []);
        // Set initial refund amount to order total, can be adjusted
        setValue('refundAmount', foundOrder.totalAmount); 
      } else {
        toast({ variant: "destructive", title: "Order not found" });
        // Optionally redirect if orderId is mandatory but not found
      }
    }
  }, [orderId, toast, setValue]);

  const onSubmit: SubmitHandler<RefundFormData> = async (data) => {
    console.log('Processing refund:', data, 'for order ID:', orderId);
    // Simulate API call for refund
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Refund Processed",
      description: `Refund of ${data.refundAmount} ETB for order ${orderId} has been initiated.`,
    });
    // Update order status to 'Refunded' or 'Pending Refund' in backend
    router.push(`/admin/orders/${orderId}`); 
  };

  const refundMethod = watch('refundMethod');

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Process Refund"
        breadcrumbs={[{ label: 'Order Management', href: '/admin/orders' }, { label: 'Process Refund' }]}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Refund Details</CardTitle>
            {order ? (
              <CardDescription>
                Processing refund for Order ID: {order.id} | Customer: {order.customerName} | Original Total: {order.totalAmount.toFixed(2)} ETB
              </CardDescription>
            ) : (
              <CardDescription>Select an order or enter Order ID to begin.</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {!orderId && (
                 <Alert variant="default" className="border-primary">
                    <AlertTriangle className="h-4 w-4 text-primary" />
                    <AlertTitle className="text-primary">No Order Selected</AlertTitle>
                    <AlertDescription>
                    Please select an order from the <Link href="/admin/orders" className="underline">Order Management page</Link> to process a refund, or enter an Order ID if applicable.
                    </AlertDescription>
                </Alert>
            )}

            {order && orderItems.length > 0 && (
                 <div>
                    <h4 className="font-medium mb-2">Order Items:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside pl-2">
                        {orderItems.map(item => (
                            <li key={item.id}>{item.productName} (Qty: {item.quantity}) - {item.totalPrice.toFixed(2)} ETB</li>
                        ))}
                    </ul>
                 </div>
            )}
            <Separator />

            <div>
              <Label htmlFor="refundAmount">Refund Amount (ETB)</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                <Input id="refundAmount" type="number" step="0.01" {...register('refundAmount')} className="pl-7"/>
              </div>
              {errors.refundAmount && <p className="text-sm text-destructive mt-1">{errors.refundAmount.message}</p>}
            </div>

            <div>
              <Label htmlFor="reason">Reason for Refund</Label>
              <Textarea id="reason" {...register('reason')} placeholder="e.g., Item damaged, wrong item sent, customer cancellation..." />
              {errors.reason && <p className="text-sm text-destructive mt-1">{errors.reason.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="refundMethod">Refund Method</Label>
              <Controller
                name="refundMethod"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="refundMethod">
                      <SelectValue placeholder="Select refund method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="original_payment">Original Payment Method</SelectItem>
                      <SelectItem value="store_credit">Store Credit</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {refundMethod === 'bank_transfer' && (
              <div className="space-y-4 p-4 border rounded-md bg-secondary/30">
                <h4 className="font-medium">Bank Transfer Details</h4>
                 <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input id="bankName" {...register('bankName')} />
                </div>
                <div>
                    <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
                    <Input id="bankAccountNumber" {...register('bankAccountNumber')} />
                </div>
              </div>
            )}

          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Link href={orderId ? `/admin/orders/${orderId}` : "/admin/orders"} passHref>
              <Button variant="outline" type="button">
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={!orderId || !order}>
              <RotateCcw className="mr-2 h-4 w-4" /> Process Refund
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

function Separator({className}: {className?: string}) {
    return <hr className={`border-border ${className}`} />;
}
