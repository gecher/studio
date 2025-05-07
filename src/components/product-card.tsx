import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  description?: string;
  category?: string;
  dataAiHint?: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative w-full h-48 bg-secondary">
          <Image
            src={product.image}
            alt={product.name}
            layout="fill"
            objectFit="contain" // Changed to contain to see product better
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
        <Button className="w-full bg-primary hover:bg-primary/90">
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
