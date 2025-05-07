
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Pill, ShieldCheck, ShoppingBag, Stethoscope, UploadCloud, VideoIcon } from 'lucide-react';

const keyFeatures = [
  {
    title: 'Order Medicines Online',
    description: 'Easily order prescription and over-the-counter medicines. Upload your prescription for quick processing.',
    icon: ShoppingBag,
    href: '/order-medicines',
    dataAiHint: 'online pharmacy',
  },
  {
    title: 'Teleconsultations',
    description: 'Connect with experienced doctors from various specialties for online video consultations.',
    icon: VideoIcon,
    href: '/teleconsultation',
    dataAiHint: 'doctor video call',
  },
  {
    title: 'Diagnostic Test Booking',
    description: 'Schedule lab tests and health packages with home sample collection services.',
    icon: Stethoscope, // Using Stethoscope as a general medical icon, could be Microscope too
    href: '/diagnostics',
    dataAiHint: 'lab test',
  },
  {
    title: 'Insurance Integration',
    description: 'Link your health insurance for seamless claims and direct billing with partner providers.',
    icon: ShieldCheck,
    href: '/insurance',
    dataAiHint: 'health insurance',
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-secondary/5 to-background text-center">
          <div className="container mx-auto px-4">
            <Pill className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
              EasyMeds Ethiopia
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-3xl mx-auto">
              Your trusted digital health partner. Access medicines, consultations, lab tests, and health information seamlessly.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6 rounded-lg shadow-md transition-transform hover:scale-105">
                  Get Started Today
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 rounded-lg shadow-md transition-transform hover:scale-105 border-primary text-primary hover:bg-primary/5">
                  Login to Your Account
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">
              Comprehensive Healthcare at Your Fingertips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {keyFeatures.map((feature) => (
                <Card key={feature.title} className="hover:shadow-xl transition-shadow duration-300 flex flex-col text-center">
                  <CardHeader className="items-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4 inline-block">
                      <feature.icon className="w-10 h-10 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                  <CardFooter className="justify-center">
                    <Link href={feature.href}>
                      <Button variant="link" className="text-primary group">
                        Learn More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-20 bg-secondary/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">
              Simple Steps to Better Health
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-md">
                <div className="bg-accent text-accent-foreground rounded-full p-4 mb-4 inline-block">
                  <UploadCloud className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-medium mb-2">1. Register & Upload</h3>
                <p className="text-muted-foreground">Sign up, and if needed, upload your prescription securely.</p>
              </div>
              <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-md">
                <div className="bg-accent text-accent-foreground rounded-full p-4 mb-4 inline-block">
                  <Stethoscope className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-medium mb-2">2. Search or Consult</h3>
                <p className="text-muted-foreground">Find medicines, book tests, or consult with our expert doctors online.</p>
              </div>
              <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-md">
                 <div className="bg-accent text-accent-foreground rounded-full p-4 mb-4 inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.63a1 1 0 0 0-.44-.82l-3.56-2.55a1 1 0 0 0-1.56.82V18Z"/><circle cx="7.5" cy="18.5" r="2.5"/><circle cx="17.5" cy="18.5" r="2.5"/></svg>
                </div>
                <h3 className="text-xl font-medium mb-2">3. Fast Delivery</h3>
                <p className="text-muted-foreground">Get your medicines and health products delivered to your doorstep quickly.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonial Placeholder */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-8">Loved by Ethiopians</h2>
            <div className="max-w-2xl mx-auto">
              <Card className="bg-card p-6 rounded-lg shadow-lg">
                <CardContent>
                  <Image src="https://picsum.photos/seed/person1/100/100" alt="Testimonial User" width={80} height={80} className="rounded-full mx-auto mb-4" data-ai-hint="happy person"/>
                  <p className="text-muted-foreground italic mb-4">
                    "EasyMeds has revolutionized how I manage my family's health. Ordering medicines is so simple, and the teleconsultations are incredibly convenient!"
                  </p>
                  <p className="font-semibold text-primary">- Fatuma R., Addis Ababa</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-gray-900 text-gray-400 text-center">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} EasyMeds Ethiopia. All rights reserved.</p>
          <p className="text-sm">Your Health, Simplified.</p>
        </div>
      </footer>
    </div>
  );
}
