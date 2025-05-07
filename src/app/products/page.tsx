'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Search, Filter, X, BriefcaseMedical } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

// Mock data - replace with API calls
const allProducts = [
  { id: 'prod1', name: 'Digital Thermometer', price: '250 ETB', image: 'https://picsum.photos/seed/thermometer/300/200', category: 'Medical Devices', brand: 'BrandA', rating: 4.5, dataAiHint: 'thermometer' },
  { id: 'prod2', name: 'Vitamin D3 Capsules', price: '180 ETB', image: 'https://picsum.photos/seed/vitamind/300/200', category: 'Supplements', brand: 'BrandB', rating: 4.2, dataAiHint: 'vitamin bottle' },
  { id: 'prod3', name: 'Hand Sanitizer (500ml)', price: '100 ETB', image: 'https://picsum.photos/seed/sanitizer/300/200', category: 'Personal Care', brand: 'BrandA', rating: 4.8, dataAiHint: 'sanitizer bottle' },
  { id: 'prod4', name: 'First Aid Kit', price: '450 ETB', image: 'https://picsum.photos/seed/firstaid/300/200', category: 'First Aid', brand: 'BrandC', rating: 4.6, dataAiHint: 'aid kit' },
  { id: 'prod5', name: 'Protein Powder (1kg)', price: '1200 ETB', image: 'https://picsum.photos/seed/protein/300/200', category: 'Supplements', brand: 'BrandB', rating: 4.9, dataAiHint: 'protein powder' },
  { id: 'prod6', name: 'Face Masks (Box of 50)', price: '150 ETB', image: 'https://picsum.photos/seed/facemasks/300/200', category: 'Personal Care', brand: 'BrandC', rating: 4.0, dataAiHint: 'face masks' },
  { id: 'prod7', name: 'Glucometer', price: '800 ETB', image: 'https://picsum.photos/seed/glucometer/300/200', category: 'Medical Devices', brand: 'BrandA', rating: 4.7, dataAiHint: 'sugar monitor' },
  { id: 'prod8', name: 'Baby Diapers (Pack L)', price: '300 ETB', image: 'https://picsum.photos/seed/diapers/300/200', category: 'Baby Care', brand: 'BrandD', rating: 4.3, dataAiHint: 'baby diapers' },
];

const categories = ['All', 'Medical Devices', 'Supplements', 'Personal Care', 'First Aid', 'Baby Care'];
const brands = ['All', 'BrandA', 'BrandB', 'BrandC', 'BrandD'];

export default function HealthcareProductsPage() {
  const [products, setProducts] = useState(allProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [sortBy, setSortBy] = useState('relevance'); // options: relevance, price_asc, price_desc, rating

  useEffect(() => {
    let filtered = allProducts;

    if (searchQuery) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    if (selectedBrand !== 'All') {
      filtered = filtered.filter(p => p.brand === selectedBrand);
    }

    if (sortBy === 'price_asc') {
      filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }
    // 'relevance' sorting would typically be handled by backend search algorithm

    setProducts(filtered);
  }, [searchQuery, selectedCategory, selectedBrand, sortBy]);

  const FilterSidebarContent = () => (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Categories</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${category}`}
                checked={selectedCategory === category}
                onCheckedChange={() => setSelectedCategory(category)}
              />
              <Label htmlFor={`cat-${category}`} className="cursor-pointer">{category}</Label>
            </div>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="text-lg font-semibold mb-2">Brands</h3>
        <div className="space-y-2">
          {brands.map(brand => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrand === brand}
                onCheckedChange={() => setSelectedBrand(brand)}
              />
              <Label htmlFor={`brand-${brand}`} className="cursor-pointer">{brand}</Label>
            </div>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <Button variant="outline" className="w-full" onClick={() => { setSelectedCategory('All'); setSelectedBrand('All'); }}>
          <X className="mr-2 h-4 w-4" /> Clear Filters
        </Button>
      </div>
    </div>
  );


  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-primary flex items-center justify-center gap-2"><BriefcaseMedical /> Healthcare Products</h1>
        <p className="text-muted-foreground">Find a wide range of health and wellness products.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar - Desktop */}
        <aside className="hidden md:block md:w-1/4 lg:w-1/5 sticky top-20 h-[calc(100vh-10rem)]">
          <ScrollArea className="h-full pr-4 rounded-md border p-2 shadow-sm">
            <FilterSidebarContent />
          </ScrollArea>
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full sm:w-auto sm:flex-grow max-w-md">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* Filters Button - Mobile */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="md:hidden w-1/2">
                      <Filter className="mr-2 h-4 w-4" /> Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                    <SheetHeader>
                      <SheetTitle>Filter Products</SheetTitle>
                    </SheetHeader>
                    <ScrollArea className="h-[calc(100%-4rem)]">
                       <FilterSidebarContent />
                    </ScrollArea>
                  </SheetContent>
                </Sheet>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">No Products Found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
