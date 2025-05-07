
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit, DollarSign, CalendarDays, User, Hash, Truck, ShoppingBag, CheckCircle, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AdminHeader from '@/app/admin/_components/admin-header';
import { useToast } from '@/hooks/use-toast';
import { mockOrders, mockOrderItems, mockUsers } from '@/app/admin/_lib/mock-data';
import type { Order, OrderItem, User as Customer } from '@/app/admin/_types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function ViewOrderPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const orderId = params.id as string;

  const [order, setOrder] = React.useState<Order | null>(null);
  const [items, setItems] = React.useState<OrderItem[]>([]);
  const [customer, setCustomer] = React.useState<Customer | null>(null);

  React.useEffect(() => {
    const foundOrder = mockOrders.find(o => o.id === orderId);
    if (foundOrder) {
      setOrder(foundOrder);
      setItems(mockOrderItems[orderId] || []);
      // Try to find customer by name (simple mock logic)
      const foundCustomer = mockUsers.find(u => u.name === foundOrder.customerName);
      setCustomer(foundCustomer || null);
    } else {
      toast({ variant: "destructive", title: "Order not found" });
      router.push('/admin/orders');
    }
  }, [orderId, router, toast]);

  if (!order) {
    return <div>Loading order data...</div>;
  }

  const DetailItem = ({ icon: Icon, label, value, isBadge = false }: { icon: React.ElementType, label: string, value?: string | number, isBadge?: boolean }) => {
    if (value === undefined || value === null || value === '') return null;
    let displayValue: React.ReactNode = String(value);
     if (isBadge) {
        let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
        const lowerValue = String(value).toLowerCase();
        if (['delivered', 'paid', 'shipped'].includes(lowerValue)) badgeVariant = 'default';
        else if (['pending', 'processing'].includes(lowerValue)) badgeVariant = 'secondary';
        else if (['cancelled', 'unpaid', 'refunded'].includes(lowerValue)) badgeVariant = 'destructive';
        displayValue = <Badge variant={badgeVariant} className="capitalize">{lowerValue}</Badge>;
    } else if (label.toLowerCase().includes('amount') || label.toLowerCase().includes('price')) {
        displayValue = `${value} ETB`;
    }

    return (
        <div className="flex items-start text-sm py-1">
            <Icon className="h-4 w-4 text-muted-foreground mr-2 mt-0.5 shrink-0" />
            <span className="font-medium text-muted-foreground w-32">{label}:</span>
            <span className="text-foreground">{displayValue}</span>
        </div>
    );
  };

  return (
    <div className="space-y-6">
      <AdminHeader 
        title={`Order Details: ${order.id}`}
        breadcrumbs={[{ label: 'Order Management', href: '/admin/orders' }, { label: 'View Order' }]}
        actionButton={
          <div className="flex gap-2">
            <Link href="/admin/orders" passHref>
              <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders</Button>
            </Link>
            {/* Edit might mean update status, add tracking etc. */}
            <Link href={`/admin/orders/edit/${order.id}`} passHref> 
              <Button><Edit className="mr-2 h-4 w-4" /> Update Order Status</Button>
            </Link>
          </div>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Details of order {order.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-semibold mb-2">Order Information</h3>
                <DetailItem icon={Hash} label="Order ID" value={order.id} />
                <DetailItem icon={CalendarDays} label="Order Date" value={order.orderDate} />
                <DetailItem icon={DollarSign} label="Total Amount" value={order.totalAmount} />
                <DetailItem icon={CheckCircle} label="Order Status" value={order.status} isBadge={true} />
                <DetailItem icon={CheckCircle} label="Payment Status" value={order.paymentStatus} isBadge={true} />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <DetailItem icon={User} label="Customer Name" value={order.customerName} />
                {customer && (
                    <>
                        <DetailItem icon={Mail} label="Email" value={customer.email} />
                        <Link href={`/admin/users/${customer.id}`} className="text-sm text-primary hover:underline mt-1 block">View Customer Profile</Link>
                    </>
                )}
                 {/* Add Shipping details if available */}
              </div>
            </div>
            
            <Separator className="my-4" />
            <h3 className="font-semibold mb-2 text-lg">Items Ordered</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>SKU/ID</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>
                        <Link href={`/admin/inventory/${item.productId}`} className="text-primary hover:underline">
                            {item.productName}
                        </Link>
                    </TableCell>
                    <TableCell>{item.productId}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{item.unitPrice.toFixed(2)} ETB</TableCell>
                    <TableCell className="text-right">{item.totalPrice.toFixed(2)} ETB</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Order Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Example Actions, make these conditional based on order.status */}
            {order.status === 'Pending' && (
              <Button className="w-full" onClick={() => alert(`Marking ${order.id} as Processing...`)}>Mark as Processing</Button>
            )}
            {order.status === 'Processing' && (
              <Button className="w-full" onClick={() => alert(`Marking ${order.id} as Shipped...`)}>Mark as Shipped</Button>
            )}
            {order.status === 'Shipped' && (
              <Button className="w-full" onClick={() => alert(`Marking ${order.id} as Delivered...`)}>Mark as Delivered</Button>
            )}
            {order.status !== 'Cancelled' && order.status !== 'Delivered' && order.status !== 'Refunded' && (
                 <Button variant="outline" className="w-full" onClick={() => alert(`Cancelling ${order.id}...`)}>Cancel Order</Button>
            )}
            {order.paymentStatus === 'Paid' && (order.status === 'Delivered' || order.status === 'Shipped') && (
              <Link href={`/admin/orders/refunds?orderId=${order.id}`} className="w-full block">
                 <Button variant="destructive" className="w-full">Process Refund</Button>
              </Link>
            )}
            <Button variant="outline" className="w-full">Print Invoice</Button>
             <Button variant="outline" className="w-full">Send Order Update Email</Button>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
