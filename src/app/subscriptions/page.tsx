
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Repeat, Zap, ShieldCheck, Truck, Award } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

const subscriptionPlans = [
  {
    id: 'basic',
    name: 'EasyMeds Basic',
    priceMonth: 'Free',
    priceYear: 'Free',
    description: 'Standard access to our platform services.',
    features: [
      'Order medicines & products',
      'Book lab tests',
      'Basic teleconsultation access',
      'Standard delivery charges',
    ],
    actionLabel: 'Continue with Basic',
    isCurrent: true, // Example: Mark one as current
    dataAiHint: 'free plan'
  },
  {
    id: 'plus',
    name: 'EasyMeds Plus',
    priceMonth: '199 ETB / month',
    priceYear: '1999 ETB / year (Save 16%)',
    description: 'Unlock exclusive benefits and savings.',
    features: [
      'All Basic features',
      'Free & faster delivery on orders over 500 ETB',
      'Exclusive discounts on medicines & products (up to 20%)',
      'Priority access to specialist doctors',
      'Discounted lab test packages',
      '24/7 priority customer support',
    ],
    actionLabel: 'Upgrade to Plus',
    isPopular: true,
    dataAiHint: 'premium plan'
  },
  {
    id: 'family',
    name: 'EasyMeds Family',
    priceMonth: '399 ETB / month',
    priceYear: '3999 ETB / year (Save 20%)',
    description: 'Comprehensive care for your entire family.',
    features: [
      'All Plus features',
      'Add up to 4 family members',
      'Additional discounts on family health packages',
      'Personalized health reminders for family',
      'Dedicated family health manager (coming soon)',
    ],
    actionLabel: 'Choose Family Plan',
    dataAiHint: 'family plan'
  },
];

export default function SubscriptionsPage() {
  const { isAuthenticated, mounted: authMounted } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [clientMounted, setClientMounted] = useState(false);

  useEffect(() => {
    setClientMounted(true);
  }, []);


  const handleSubscriptionAction = (planName: string) => {
    if (!authMounted) return;
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please log in to subscribe to a plan.',
        variant: 'destructive',
      });
      router.push('/auth/login?redirect=/subscriptions');
      return;
    }
    // Proceed with subscription logic
     toast({
        title: 'Subscription Updated!',
        description: `You are now subscribed to ${planName}.`,
      });
    console.log(`Subscribing to ${planName}`);
  };

  if (!clientMounted) {
    return <div>Loading page...</div>; // Or a skeleton loader
  }

  return (
    <div className="space-y-12">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-primary flex items-center justify-center gap-2"><Repeat /> Our Subscription Plans</h1>
        <p className="text-xl text-muted-foreground mt-2">Choose a plan that fits your healthcare needs and enjoy exclusive benefits.</p>
      </header>

      {/* Subscription Plans Grid */}
      <section id="plus" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {subscriptionPlans.map(plan => (
          <Card
            key={plan.id}
            className={`flex flex-col hover:shadow-2xl transition-shadow duration-300 ${plan.isPopular ? 'border-2 border-accent shadow-accent/30' : 'shadow-lg'}`}
          >
            {plan.isPopular && (
              <div className="bg-accent text-accent-foreground text-center py-1.5 font-semibold text-sm rounded-t-lg">
                Most Popular
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription className="text-sm h-10">{plan.description}</CardDescription>
              <p className="text-3xl font-bold text-primary mt-2">{plan.priceMonth}</p>
              <p className="text-xs text-muted-foreground">{plan.priceYear}</p>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className={`w-full text-lg py-6 ${plan.isPopular ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : plan.isCurrent ? 'bg-gray-200 text-gray-700 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'}`}
                disabled={plan.isCurrent}
                onClick={() => handleSubscriptionAction(plan.name)}
              >
                {plan.actionLabel}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>
      
      {/* Benefits Section */}
      <section className="bg-secondary/50 py-12 rounded-lg">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-8 text-center">Why Subscribe to EasyMeds Plus?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: 'Free & Fast Delivery', description: 'Enjoy free and prioritized delivery on eligible orders.' },
              { icon: Zap, title: 'Exclusive Discounts', description: 'Save more with special member-only prices on medicines and products.' },
              { icon: ShieldCheck, title: 'Priority Support', description: 'Get your queries resolved faster with our dedicated support team.' },
              { icon: Award, title: 'Early Access', description: 'Be the first to know about new products, services, and health camps.' },
              { icon: UserMdIcon, title: 'Specialist Access', description: 'Quicker appointments and consultations with top specialist doctors.' },
              { icon: Repeat, title: 'Auto-Refills', description: 'Never run out of essential medicines with smart auto-refill options.' },
            ].map(benefit => (
              <div key={benefit.title} className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md">
                <div className="bg-primary text-primary-foreground rounded-full p-4 mb-4 inline-block">
                  <benefit.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-medium mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-8 text-center">Frequently Asked Questions</h2>
        {/* Replace with Accordion component for better UX */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <div>
            <h3 className="font-semibold text-lg">How do I subscribe?</h3>
            <p className="text-muted-foreground text-sm">You can choose a plan above and click on the subscribe button. You will be guided through the payment process.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Can I cancel my subscription?</h3>
            <p className="text-muted-foreground text-sm">Yes, you can cancel your subscription anytime from your profile settings. The benefits will continue until the end of your current billing cycle.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">What payment methods are accepted?</h3>
            <p className="text-muted-foreground text-sm">We accept major credit/debit cards, mobile money, and other local payment options.</p>
          </div>
        </div>
      </section>

      {/* Manage Subscription Section (for logged-in users) */}
      {isAuthenticated && authMounted && (
        <section className="text-center">
            <p className="text-muted-foreground">You are currently subscribed or can manage your subscription options.</p>
            <Link href="/profile#subscriptions">
            <Button variant="link" className="text-primary text-lg">Manage Your Subscription</Button>
            </Link>
        </section>
      )}
    </div>
  );
}

// Placeholder UserMdIcon
const UserMdIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2a5 5 0 0 0-5 5v2"/>
    <path d="M12 22V8"/>
    <path d="M5 12H2a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h3v3a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-3h2v3a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-3h3a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-3"/>
    <path d="M7 12v2a5 5 0 0 0 10 0v-2"/>
    <circle cx="12" cy="7" r="3"/>
  </svg>
);
