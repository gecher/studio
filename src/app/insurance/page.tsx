
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Link2, PlusCircle, FileText, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

// Mock data
const linkedInsurances = [
  { id: 'ins1', providerName: 'Ethiopian Insurance Corporation (EIC)', policyNumber: 'POL-EIC-12345', coverage: 'Medicines, Basic Diagnostics', image: 'https://picsum.photos/seed/eiclogo/100/50?grayscale', dataAiHint: 'insurance logo' },
  { id: 'ins2', providerName: 'Awash Insurance Company S.C.', policyNumber: 'POL-AWASH-67890', coverage: 'Hospitalization, Specialist Consultation', image: 'https://picsum.photos/seed/awashlogo/100/50?grayscale', dataAiHint: 'company logo' },
];

const availableProviders = [
    { id: 'prov1', name: 'Ethiopian Insurance Corporation (EIC)', image: 'https://picsum.photos/seed/eiclogo/100/50?grayscale', dataAiHint: 'insurance logo' },
    { id: 'prov2', name: 'Awash Insurance Company S.C.', image: 'https://picsum.photos/seed/awashlogo/100/50?grayscale', dataAiHint: 'company logo' },
    { id: 'prov3', name: 'Nile Insurance Company S.C.', image: 'https://picsum.photos/seed/nilelogo/100/50?grayscale', dataAiHint: 'insurance company' },
    { id: 'prov4', name: 'Nyala Insurance S.C.', image: 'https://picsum.photos/seed/nyalalogo/100/50?grayscale', dataAiHint: 'brand logo' },
];


export default function InsurancePage() {
  const [isLinkingNew, setIsLinkingNew] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [memberId, setMemberId] = useState('');
  const { isAuthenticated, mounted: authMounted } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [clientMounted, setClientMounted] = useState(false);

  useEffect(() => {
    setClientMounted(true);
  }, []);


  const handleStartLinkNew = () => {
    if (!authMounted) return;
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please log in to link an insurance plan.',
        variant: 'destructive',
      });
      router.push('/auth/login?redirect=/insurance');
      return;
    }
    setIsLinkingNew(true);
  };
  
  const handleLinkInsurance = () => {
     if (!authMounted) return;
    if (!isAuthenticated) { // Double check, though covered by handleStartLinkNew
      router.push('/auth/login?redirect=/insurance');
      return;
    }

    if (selectedProvider && policyNumber && memberId) {
      toast({
        title: 'Insurance Linked Successfully!',
        description: `Insurance from ${selectedProvider} with policy ${policyNumber} has been linked.`,
      });
      console.log(`Linking insurance from ${selectedProvider} with policy ${policyNumber} and member ID ${memberId}.`);
      // Add to linkedInsurances list (mock) and reset form
      setIsLinkingNew(false);
      setSelectedProvider('');
      setPolicyNumber('');
      setMemberId('');
    } else {
       toast({
        title: 'Missing Information',
        description: 'Please fill in all fields to link your insurance.',
        variant: 'destructive',
      });
    }
  };

  if (!clientMounted) {
    return <div>Loading page...</div>; // Or a skeleton loader
  }


  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-primary flex items-center justify-center gap-2"><ShieldCheck /> Insurance Integration</h1>
        <p className="text-muted-foreground">Link your health insurance for seamless claims and benefits.</p>
      </header>

      {/* Linked Insurance Plans Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Your Linked Insurance Plans</span>
            {!isLinkingNew && (
                 <Button onClick={handleStartLinkNew} size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" /> Link New Plan
                </Button>
            )}
          </CardTitle>
          <CardDescription>Manage your linked insurance policies for direct billing and claims.</CardDescription>
        </CardHeader>
        <CardContent>
          {linkedInsurances.length > 0 ? (
            <div className="space-y-4">
              {linkedInsurances.map(ins => (
                <Card key={ins.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-secondary/30">
                  <Image
                    src={ins.image}
                    alt={`${ins.providerName} logo`}
                    width={80}
                    height={40}
                    className="object-contain rounded border border-border"
                    data-ai-hint={ins.dataAiHint}
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg">{ins.providerName}</h3>
                    <p className="text-sm text-muted-foreground">Policy #: {ins.policyNumber}</p>
                    <p className="text-sm text-muted-foreground">Coverage: {ins.coverage}</p>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </Card>
              ))}
            </div>
          ) : (
            !isLinkingNew && <p className="text-muted-foreground text-center py-4">No insurance plans linked yet. Click "Link New Plan" to add one.</p>
          )}
        </CardContent>
      </Card>

      {/* Link New Insurance Plan Section */}
      {isLinkingNew && (
        <Card className="shadow-xl border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Link2 className="text-primary" /> Link a New Insurance Plan</CardTitle>
            <CardDescription>Enter your insurance details below to link your plan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label htmlFor="insurance-provider" className="block text-sm font-medium text-foreground mb-1">
                Select Insurance Provider
              </label>
              <select
                id="insurance-provider"
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="w-full p-2 border border-input rounded-md bg-background focus:ring-primary focus:border-primary"
              >
                <option value="" disabled>Select a provider</option>
                {availableProviders.map(provider => (
                  <option key={provider.id} value={provider.name}>{provider.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="policy-number" className="block text-sm font-medium text-foreground mb-1">
                Policy Number
              </label>
              <Input
                id="policy-number"
                type="text"
                placeholder="Enter your policy number"
                value={policyNumber}
                onChange={(e) => setPolicyNumber(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="member-id" className="block text-sm font-medium text-foreground mb-1">
                Member ID / Employee ID
              </label>
              <Input
                id="member-id"
                type="text"
                placeholder="Enter your member or employee ID"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
              />
            </div>
             <Alert variant="default" className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-700 font-semibold">Data Privacy</AlertTitle>
                <AlertDescription className="text-blue-600">
                Your insurance information is kept confidential and used solely for verification and claims processing.
                </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button onClick={handleLinkInsurance} className="bg-primary hover:bg-primary/90">
              Link Insurance
            </Button>
            <Button variant="ghost" onClick={() => setIsLinkingNew(false)}>
              Cancel
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
