
'use client';

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mock cart items - replace with actual cart data logic
const mockCartItems = [
  { id: 'med1', name: 'Amoxicillin 250mg', price: 80, quantity: 2, image: 'https://picsum.photos/seed/amoxicillin_cart/100/100', dataAiHint: 'pills medicine' },
  { id: 'otc1', name: 'Vitamin C Tablets', price: 90, quantity: 1, image: 'https://picsum.photos/seed/vitaminc_cart/100/100', dataAiHint: 'vitamin bottle' },
];

export default function CartPageContent() {
  // In a real app, you'd use state management (e.g., Context, Zustand, Redux) for cart items
  const cartItems = mockCartItems; 
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cartItems.length > 0 ? 50 : 0; // Example delivery fee
  const total = subtotal + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center flex-1">
        <ShoppingCart className="w-24 h-24 text-muted-foreground mb-6" />
        <h2 className="text-2xl font-semibold mb-2">Your Cart is Empty</h2>
        <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/order-medicines">
            <Button size="lg">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center gap-4 p-3 bg-secondary/50 rounded-lg">
              <Image 
                  src={item.image} 
                  alt={item.name} 
                  width={64} 
                  height={64} 
                  className="rounded-md border"
                  data-ai-hint={item.dataAiHint}
              />
              <div className="flex-grow">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                <p className="text-sm font-medium">{(item.price * item.quantity).toFixed(2)} ETB</p>
              </div>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80">
                <Trash2 className="w-5 h-5" />
                <span className="sr-only">Remove item</span>
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 flex-col space-y-3 border-t bg-card">
        <div className="w-full flex justify-between text-sm">
          <span>Subtotal:</span>
          <span className="font-medium">{subtotal.toFixed(2)} ETB</span>
        </div>
        <div className="w-full flex justify-between text-sm">
          <span>Delivery Fee:</span>
          <span className="font-medium">{deliveryFee.toFixed(2)} ETB</span>
        </div>
        <Separator />
        <div className="w-full flex justify-between text-lg font-semibold">
          <span>Total:</span>
          <span>{total.toFixed(2)} ETB</span>
        </div>
        <Button size="lg" className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
          Proceed to Checkout
        </Button>
        <Link href="/order-medicines" className="w-full">
          <Button variant="outline" className="w-full">Continue Shopping</Button>
        </Link>
      </div>
    </>
  );
}
