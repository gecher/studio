'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CreditCard, Truck, ShoppingBag, MapPin, Phone, User } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { createMockOrder } from '@/app/admin/_lib/mock-data'; // Assume this function will be created

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phoneNumber: z.string().min(9, 'Valid phone number is required'),
  address: z.string().min(10, 'Full address is required'),
  city: z.string().min(2, 'City is required').default('Addis Ababa'), // Default city
  paymentMethod: z.enum(['cod', 'online'], { required_error: 'Please select a payment method' }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { cartItems, subtotal, totalItems, clearCart, mounted: cartMounted } = useCart();
  const { currentUser, isAuthenticated, mounted: authMounted } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const { control, handleSubmit, register, formState: { errors }, setValue } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'cod',
      city: 'Addis Ababa',
    },
  });

  useEffect(() => {
    if (authMounted && currentUser) {
      setValue('fullName', currentUser.name);
      // Assuming phone and address might be on user object, otherwise user needs to fill them.
      // setValue('phoneNumber', currentUser.phone || ''); 
      // setValue('address', currentUser.address || '');
    }
  }, [authMounted, currentUser, setValue]);

  useEffect(() => {
    if (cartMounted && cartItems.length === 0 && !isProcessing) {
      toast({ title: "Your cart is empty", description: "Redirecting to shopping page..." });
      router.replace('/order-medicines');
    }
     if (authMounted && !isAuthenticated) {
      toast({ title: "Login Required", description: "Please login to proceed to checkout.", variant: "destructive" });
      router.replace('/auth/login?redirect=/checkout');
    }
  }, [cartMounted, cartItems, router, toast, isProcessing, authMounted, isAuthenticated]);


  const deliveryFee = cartItems.length > 0 ? 50 : 0;
  const totalAmount = subtotal + deliveryFee;

  const onSubmit: SubmitHandler<CheckoutFormData> = async (data) => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const customerDetails = {
        name: data.fullName,
        email: currentUser?.email || 'guest@example.com', // Fallback if user somehow not loaded
        phone: data.phoneNumber,
        address: `${data.address}, ${data.city}`,
    };
    
    try {
        const orderId = await createMockOrder(cartItems, customerDetails, data.paymentMethod, totalAmount);
        
        toast({
            title: 'Order Placed Successfully!',
            description: `Your order ID is ${orderId}. You will receive a confirmation shortly.`,
        });
        clearCart();
        router.push(`/order-confirmation/${orderId}`);
    } catch (error) {
        console.error("Failed to create mock order:", error);
        toast({
            variant: "destructive",
            title: "Order Placement Failed",
            description: "There was an issue placing your order. Please try again."
        });
        setIsProcessing(false);
    }
  };
  
  if (!cartMounted || !authMounted || (!isAuthenticated && authMounted) || (cartItems.length === 0 && cartMounted && !isProcessing) ) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <ShoppingBag className="w-24 h-24 text-muted-foreground mb-6 animate-pulse" />
        <p className="text-muted-foreground text-lg">Loading checkout or redirecting...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">Checkout</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping & Payment Details Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><User className="text-primary" /> Shipping Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" {...register('fullName')} placeholder="Abebe Bikila" />
                {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>}
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" type="tel" {...register('phoneNumber')} placeholder="+251 91 234 5678" />
                {errors.phoneNumber && <p className="text-sm text-destructive mt-1">{errors.phoneNumber.message}</p>}
              </div>
              <div>
                <Label htmlFor="address">Full Address (Street, Woreda, Sub-city)</Label>
                <Input id="address" {...register('address')} placeholder="e.g., Bole Medhanialem, Woreda 03, Bole Sub-city" />
                {errors.address && <p className="text-sm text-destructive mt-1">{errors.address.message}</p>}
              </div>
               <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register('city')} />
                {errors.city && <p className="text-sm text-destructive mt-1">{errors.city.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CreditCard className="text-primary" /> Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                name="paymentMethod"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="space-y-3"
                  >
                    <Label
                      htmlFor="cod"
                      className="flex items-center gap-3 p-4 border rounded-md hover:border-primary cursor-pointer has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary"
                    >
                      <RadioGroupItem value="cod" id="cod" />
                      <Truck className="h-6 w-6 text-muted-foreground" />
                      <div>
                        <span className="font-medium">Cash on Delivery</span>
                        <p className="text-xs text-muted-foreground">Pay when your order arrives at your doorstep.</p>
                      </div>
                    </Label>
                    <Label
                      htmlFor="online"
                      className="flex items-center gap-3 p-4 border rounded-md hover:border-primary cursor-pointer has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary"
                    >
                      <RadioGroupItem value="online" id="online" />
                       <CreditCard className="h-6 w-6 text-muted-foreground" />
                      <div>
                        <span className="font-medium">Online Payment (Mock)</span>
                        <p className="text-xs text-muted-foreground">Pay securely with Telebirr, Chapa, or Card (Simulated).</p>
                      </div>
                    </Label>
                  </RadioGroup>
                )}
              />
              {errors.paymentMethod && <p className="text-sm text-destructive mt-2">{errors.paymentMethod.message}</p>}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShoppingBag className="text-primary"/> Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm py-1 border-b last:border-b-0">
                  <div className="flex items-center gap-2">
                     <Image 
                        src={item.image || `https://picsum.photos/seed/${item.id}/40`} 
                        alt={item.name} 
                        width={40} height={40} 
                        className="rounded object-cover"
                        data-ai-hint={item.dataAiHint || "product tiny"}
                     />
                    <span>{item.name} (x{item.quantity})</span>
                  </div>
                  <span>{(item.price * item.quantity).toFixed(2)} ETB</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-sm">
                <span>Subtotal ({totalItems} items):</span>
                <span className="font-medium">{subtotal.toFixed(2)} ETB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee:</span>
                <span className="font-medium">{deliveryFee.toFixed(2)} ETB</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount:</span>
                <span>{totalAmount.toFixed(2)} ETB</span>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-3">
               <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Place Order'}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                By placing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
