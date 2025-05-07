'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, ShoppingBag, Printer, Home } from 'lucide-react';
import { mockOrders, mockOrderItems } from '@/app/admin/_lib/mock-data'; // Import mock data
import type { Order, OrderItem } from '@/app/admin/_types';
import Image from 'next/image';

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      // Simulate fetching order details
      const foundOrder = mockOrders.find(o => o.id === orderId);
      const foundItems = mockOrderItems[orderId] || [];

      if (foundOrder) {
        setOrder(foundOrder);
        setItems(foundItems);
      } else {
        // Handle order not found, maybe redirect or show error
        console.error("Order not found:", orderId);
        router.replace('/order-medicines'); // Or a dedicated error page
      }
      setLoading(false);
    }
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <ShoppingBag className="w-24 h-24 text-muted-foreground mb-6 animate-pulse" />
        <p className="text-muted-foreground text-lg">Loading your order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <ShoppingBag className="w-24 h-24 text-muted-foreground mb-6" />
        <h2 className="text-2xl font-semibold mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-6">We couldn't find the details for this order. It might have been an issue during placement.</p>
        <Link href="/order-medicines">
            <Button>Back to Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Card className="shadow-xl">
        <CardHeader className="text-center bg-accent/10 p-8 rounded-t-lg">
          <CheckCircle className="w-20 h-20 text-accent mx-auto mb-4" />
          <CardTitle className="text-3xl font-bold text-accent">Order Confirmed!</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Thank you for your purchase, {order.customerName}.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground">Your Order ID:</p>
            <p className="text-xl font-semibold text-primary">{order.id}</p>
          </div>
          
          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm py-2 border-b last:border-b-0">
                 <div className="flex items-center gap-3">
                     <Image 
                        src={`https://picsum.photos/seed/${item.productId}/40`} 
                        alt={item.productName} 
                        width={40} height={40} 
                        className="rounded object-cover border"
                        data-ai-hint={"product tiny " + item.productName.split(" ")[0]}
                     />
                    <span>{item.productName} (x{item.quantity})</span>
                  </div>
                <span className="font-medium">{(item.unitPrice * item.quantity).toFixed(2)} ETB</span>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>{(order.totalAmount - 50).toFixed(2)} ETB</span> {/* Assuming 50 ETB delivery */}
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery Fee:</span>
              <span>50.00 ETB</span>
            </div>
             <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Status:</span>
              <span className={`font-semibold ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-500'}`}>{order.paymentStatus}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount:</span>
              <span>{order.totalAmount.toFixed(2)} ETB</span>
            </div>
          </div>
          
          <Separator />

          <div className="text-center text-muted-foreground text-sm">
            <p>Your order is now being processed. You will receive updates via email/SMS.</p>
            <p>Expected delivery within 1-3 business days for Addis Ababa.</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-3 p-6 border-t">
          <Button variant="outline" onClick={() => window.print()} className="w-full sm:w-auto">
            <Printer className="mr-2 h-4 w-4" /> Print Receipt
          </Button>
          <Link href="/order-medicines" className="w-full sm:w-auto">
            <Button className="w-full bg-primary hover:bg-primary/90">
                <Home className="mr-2 h-4 w-4" /> Continue Shopping
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
