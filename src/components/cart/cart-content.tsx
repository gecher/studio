'use client';

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/cart-context"; // Import useCart
import { Input } from "@/components/ui/input";

export default function CartPageContent() {
  const { isAuthenticated, mounted: authMounted } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { cartItems, removeFromCart, updateQuantity, subtotal, mounted: cartMounted } = useCart(); // Use cart context

  const deliveryFee = cartItems.length > 0 ? 50 : 0; // Example delivery fee
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (!authMounted) return;
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please log in to proceed to checkout.',
        variant: 'destructive',
      });
      router.push('/auth/login?redirect=/checkout'); 
      return;
    }
    router.push('/checkout'); 
  };

  if (!cartMounted) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center flex-1">
        <ShoppingCart className="w-24 h-24 text-muted-foreground mb-6 animate-pulse" />
        <p className="text-muted-foreground">Loading your cart...</p>
      </div>
    );
  }

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
            <div key={item.id} className="flex items-start gap-4 p-3 bg-secondary/30 rounded-lg">
              <Image 
                  src={item.image || `https://picsum.photos/seed/${item.id}/64`} 
                  alt={item.name} 
                  width={64} 
                  height={64} 
                  className="rounded-md border object-cover"
                  data-ai-hint={item.dataAiHint || "product image"}
              />
              <div className="flex-grow">
                <h3 className="font-semibold text-sm sm:text-base">{item.name}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Unit Price: {item.price.toFixed(2)} ETB</p>
                <div className="flex items-center gap-2 mt-1">
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                  <Input 
                    type="number" 
                    value={item.quantity} 
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)} 
                    className="h-7 w-12 text-center px-1"
                    min="1"
                  />
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <p className="text-sm font-medium mt-1">Total: {(item.price * item.quantity).toFixed(2)} ETB</p>
              </div>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80 shrink-0" onClick={() => removeFromCart(item.id)}>
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="sr-only">Remove item</span>
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 flex-col space-y-3 border-t bg-card">
        <div className="w-full flex justify-between text-sm">
          <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items):</span>
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
        <Button size="lg" className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleCheckout}>
          Proceed to Checkout
        </Button>
        <Link href="/order-medicines" className="w-full">
          <Button variant="outline" className="w-full">Continue Shopping</Button>
        </Link>
      </div>
    </>
  );
}
