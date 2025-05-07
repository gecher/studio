'use client';

import { useState, ChangeEvent } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, Search, FileText, Pill, Info } from 'lucide-react';
import ProductCard from '@/components/product-card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data - replace with API calls
const popularMedicines = [
  { id: 'med1', name: 'Amoxicillin 250mg', price: '80 ETB', image: 'https://picsum.photos/seed/amoxicillin/300/200', category: 'Antibiotic', dataAiHint:'medicine pills' },
  { id: 'med2', name: 'Paracetamol 500mg', price: '50 ETB', image: 'https://picsum.photos/seed/paracetamol/300/200', category: 'Pain Relief', dataAiHint:'medicine tablets' },
  { id: 'med3', name: 'Loratadine 10mg', price: '120 ETB', image: 'https://picsum.photos/seed/loratadine/300/200', category: 'Allergy Relief', dataAiHint:'medicine blister' },
  { id: 'med4', name: 'Omeprazole 20mg', price: '150 ETB', image: 'https://picsum.photos/seed/omeprazole/300/200', category: 'Acidity Relief', dataAiHint:'medicine capsules' },
];

const otcProducts = [
  { id: 'otc1', name: 'Vitamin C Tablets', price: '90 ETB', image: 'https://picsum.photos/seed/vitaminc/300/200', category: 'Supplements', dataAiHint:'vitamin bottle' },
  { id: 'otc2', name: 'Band-Aids (Pack of 20)', price: '40 ETB', image: 'https://picsum.photos/seed/bandaids/300/200', category: 'First Aid', dataAiHint:'bandages box' },
];

export default function OrderMedicinesPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setUploadedFile(event.target.files[0]);
    }
  };

  const handleSearch = () => {
    // Mock search functionality
    const query = searchQuery.toLowerCase();
    const results = [...popularMedicines, ...otcProducts].filter(
      med => med.name.toLowerCase().includes(query) || (med.category && med.category.toLowerCase().includes(query))
    );
    setSearchResults(results);
  };

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-primary">Order Medicines</h1>
        <p className="text-muted-foreground">Upload your prescription or search for medicines.</p>
      </header>

      {/* Prescription Upload Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UploadCloud className="text-primary" /> Upload Prescription</CardTitle>
          <CardDescription>
            Have a prescription? Upload it here for quick processing by our pharmacists.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4 p-6 border-2 border-dashed border-border rounded-lg">
            <UploadCloud className="w-16 h-16 text-muted-foreground" />
            <Input type="file" onChange={handleFileUpload} className="max-w-xs" accept="image/*,.pdf" />
            {uploadedFile && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-secondary p-2 rounded-md">
                <FileText className="w-5 h-5 text-primary" />
                <span>{uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(2)} KB)</span>
              </div>
            )}
            <Button disabled={!uploadedFile} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Submit Prescription
            </Button>
            <p className="text-xs text-muted-foreground">Accepted formats: JPG, PNG, PDF. Max size: 5MB.</p>
          </div>
        </CardContent>
         <CardFooter>
          <Alert variant="default" className="bg-primary/10 border-primary/20">
            <Info className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary font-semibold">Prescription Verification</AlertTitle>
            <AlertDescription className="text-primary/80">
              All uploaded prescriptions are verified by licensed pharmacists before order confirmation. You will be contacted if any clarification is needed.
            </AlertDescription>
          </Alert>
        </CardFooter>
      </Card>

      {/* Search Medicines Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Search className="text-primary" /> Search Medicines & Products</CardTitle>
          <CardDescription>
            Find specific medicines or browse our catalog of healthcare products.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Input
              type="search"
              placeholder="Enter medicine or product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>

          {searchResults.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Search Results</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {searchResults.map((med) => (
                  <ProductCard key={med.id} product={med} />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Browse Medicines / Products Section */}
       <Tabs defaultValue="prescription" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 gap-2 mb-6">
          <TabsTrigger value="prescription">Prescription Medicines <Pill className="ml-2 h-4 w-4"/></TabsTrigger>
          <TabsTrigger value="otc">Over-the-Counter <Pill className="ml-2 h-4 w-4"/></TabsTrigger>
          <TabsTrigger value="healthcare">Healthcare Products</TabsTrigger>
        </TabsList>
        
        <TabsContent value="prescription">
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"><Pill className="text-primary" /> Popular Prescription Medicines</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {popularMedicines.map((med) => (
                <ProductCard key={med.id} product={med} />
              ))}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="otc">
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"><Pill className="text-primary" /> Over-the-Counter (OTC) Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {otcProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </section>
        </TabsContent>
         <TabsContent value="healthcare">
           <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"><Pill className="text-primary" /> General Healthcare Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Add more healthcare products here, reusing ProductCard */}
              {popularMedicines.slice(0,2).map((prod) => ( // Example, replace with actual healthcare products
                <ProductCard key={`hc-${prod.id}`} product={{...prod, name: `Healthcare ${prod.name}`, id: `hc-${prod.id}`, dataAiHint: "health product" }} />
              ))}
            </div>
          </section>
        </TabsContent>
      </Tabs>

    </div>
  );
}
