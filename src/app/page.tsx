import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, UploadCloud, Stethoscope, Microscope, BookOpenText, MapPin, ArrowRight } from 'lucide-react';
import ProductCard from '@/components/product-card'; // Assuming this will be created

const featuredProducts = [
  { id: '1', name: 'Multivitamins', price: '150 ETB', image: 'https://picsum.photos/seed/multivitamin/300/200', dataAiHint: 'vitamin pills' },
  { id: '2', name: 'Pain Relief Gel', price: '120 ETB', image: 'https://picsum.photos/seed/painrelief/300/200', dataAiHint: 'ointment tube' },
  { id: '3', name: 'Digital Thermometer', price: '250 ETB', image: 'https://picsum.photos/seed/thermometer/300/200', dataAiHint: 'digital thermometer' },
];

const featuredArticles = [
  { id: '1', title: 'Understanding Diabetes', summary: 'Learn about causes, symptoms, and management.', image: 'https://picsum.photos/seed/diabetes/300/200', href: '/health-hub/diabetes', dataAiHint: 'health info' },
  { id: '2', title: 'Benefits of Regular Checkups', summary: 'Why preventive care is important for your health.', image: 'https://picsum.photos/seed/checkup/300/200', href: '/health-hub/checkups', dataAiHint: 'doctor patient' },
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-r from-primary/10 via-secondary/5 to-background rounded-lg shadow-lg overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Welcome to EasyMeds Ethiopia
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
            Your trusted partner for online medicines, healthcare products, diagnostics, and teleconsultations. Fast, reliable, and convenient.
          </p>
          <div className="relative max-w-xl mx-auto mb-8">
            <Input
              type="search"
              placeholder="Search for medicines, tests, or doctors..."
              className="h-12 pl-12 pr-4 text-lg rounded-full shadow-md focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/order-medicines">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-md transition-transform hover:scale-105">
                Order Medicines
              </Button>
            </Link>
            <Link href="/teleconsultation">
              <Button size="lg" variant="outline" className="rounded-full shadow-md transition-transform hover:scale-105 border-primary text-primary hover:bg-primary/10">
                Consult a Doctor
              </Button>
            </Link>
          </div>
        </div>
         <div className="absolute -bottom-1/3 -left-16 w-72 h-72 bg-primary/20 rounded-full opacity-50 blur-2xl animate-pulse"></div>
        <div className="absolute -top-1/4 -right-16 w-80 h-80 bg-accent/20 rounded-full opacity-50 blur-2xl animate-pulse animation-delay-2000"></div>
      </section>

      {/* Quick Actions Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Upload Prescription", icon: UploadCloud, href: "/order-medicines#upload", description: "Quickly upload your prescription." , dataAiHint: "prescription document"},
            { title: "Book Lab Test", icon: Microscope, href: "/diagnostics", description: "Schedule tests from home.", dataAiHint: "lab test" },
            { title: "Online Consultation", icon: Stethoscope, href: "/teleconsultation", description: "Talk to a doctor anytime.", dataAiHint: "doctor online" },
            { title: "Find Pharmacies", icon: MapPin, href: "/pharmacy-locator", description: "Locate nearby pharmacies.", dataAiHint: "map pharmacy" },
          ].map(action => (
            <Link href={action.href} key={action.title} className="block group">
              <Card className="hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                <CardHeader className="flex-row items-center gap-4 pb-2">
                  <action.icon className="w-10 h-10 text-primary" />
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
                 <CardFooter>
                   <Button variant="link" className="p-0 text-primary group-hover:underline">Learn More <ArrowRight className="ml-2 h-4 w-4"/></Button>
                 </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Featured Healthcare Products */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-2 text-center">Healthcare Essentials</h2>
        <p className="text-muted-foreground text-center mb-8">Top picks for your well-being.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
           {/* Placeholder card for more products */}
          <Card className="flex flex-col items-center justify-center text-center border-dashed border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Explore More</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Find a wide range of healthcare products.</p>
            </CardContent>
            <CardFooter>
              <Link href="/products">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">View All Products <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-secondary/50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-8 text-center">Simple Steps to Better Health</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-primary text-primary-foreground rounded-full p-4 mb-4 inline-block">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium mb-2">1. Search or Upload</h3>
              <p className="text-muted-foreground">Find your medicines or upload a prescription.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary text-primary-foreground rounded-full p-4 mb-4 inline-block">
                <Stethoscope className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium mb-2">2. Consult or Order</h3>
              <p className="text-muted-foreground">Book a test, consult a doctor, or place your order.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary text-primary-foreground rounded-full p-4 mb-4 inline-block">
                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-truck"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.63a1 1 0 0 0-.44-.82l-3.56-2.55a1 1 0 0 0-1.56.82V18Z"/><circle cx="7.5" cy="18.5" r="2.5"/><circle cx="17.5" cy="18.5" r="2.5"/></svg>
              </div>
              <h3 className="text-xl font-medium mb-2">3. Fast Delivery</h3>
              <p className="text-muted-foreground">Get your health needs delivered to your doorstep.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Health Hub Preview */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold">Health Information Hub</h2>
            <Link href="/health-hub">
              <Button variant="link" className="text-primary">View All Articles <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredArticles.map(article => (
            <Link href={article.href} key={article.id} className="block group">
            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row">
              <div className="md:w-1/3 h-48 md:h-auto relative">
                <Image 
                  src={article.image} 
                  alt={article.title} 
                  layout="fill" 
                  objectFit="cover" 
                  data-ai-hint={article.dataAiHint}
                />
              </div>
              <div className="md:w-2/3">
                <CardHeader>
                  <CardTitle className="group-hover:text-primary">{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">{article.summary}</p>
                </CardContent>
                 <CardFooter>
                   <Button variant="link" className="p-0 text-primary group-hover:underline">Read More <ArrowRight className="ml-2 h-4 w-4"/></Button>
                 </CardFooter>
              </div>
            </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Call to Action / Subscription */}
      <section className="bg-gradient-to-r from-accent/80 to-accent py-16 text-accent-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join EasyMeds Plus</h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Get exclusive discounts, free deliveries, and priority support with our subscription plan.
          </p>
          <Link href="/subscriptions#plus">
            <Button size="lg" variant="outline" className="bg-accent-foreground text-accent hover:bg-accent-foreground/90 rounded-full shadow-lg transition-transform hover:scale-105 border-accent-foreground">
              Learn More & Subscribe
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
