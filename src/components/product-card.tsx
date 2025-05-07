import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useCart, type CartItem } from '@/contexts/cart-context'; // Import useCart

interface Product {
  id: string;
  name: string;
  price: string; // Keep as string for display, convert to number for cart
  image: string;
  description?: string;
  category?: string;
  dataAiHint?: string;
  type?: 'product' | 'test' | 'teleconsultation'; // Add type for cart item
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated, mounted: authMounted } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { addToCart } = useCart(); // Use cart context

  const handleAddToCart = () => {
    if (!authMounted) return;
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please log in to add items to your cart.',
        variant: 'destructive',
      });
      router.push('/auth/login?redirect=/order-medicines'); // Or current page
      return;
    }

    const priceAsNumber = parseFloat(product.price.replace(/[^\d.-]/g, ''));
    if (isNaN(priceAsNumber)) {
        console.error("Invalid product price:", product.price);
        toast({ variant: "destructive", title: "Error", description: "Invalid product price."});
        return;
    }
    
    const cartProduct: Omit<CartItem, 'quantity'> = {
      id: product.id,
      name: product.name,
      price: priceAsNumber,
      image: product.image,
      dataAiHint: product.dataAiHint,
      type: product.type || 'product', // Default to 'product' if type isn't specified
    };
    addToCart(cartProduct);
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative w-full h-48 bg-secondary">
          <Image
            src={product.image}
            alt={product.name}
            layout="fill"
            objectFit="contain"
            className="p-2"
            data-ai-hint={product.dataAiHint || "product image"}
          />
        </div>
      </Link>
      <CardHeader className="pb-2">
        <Link href={`/products/${product.id}`} className="block">
          <CardTitle className="text-lg hover:text-primary truncate">{product.name}</CardTitle>
        </Link>
        {product.category && (
          <CardDescription className="text-xs text-muted-foreground">{product.category}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-lg font-semibold text-foreground">{product.price}</p>
        {product.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
        )}
      </CardContent>
      <CardFooter className="mt-auto">
        <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
