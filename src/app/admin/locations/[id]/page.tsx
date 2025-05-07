
'use client';

import *ాలు
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Edit, ArrowLeft, MapPin, Phone, ListChecks, Activity, Globe, Satellite } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminHeader from '@/app/admin/_components/admin-header';
import { useToast } from '@/hooks/use-toast';
import { mockLocations } from '@/app/admin/_lib/mock-data';
import type { Location } from '@/app/admin/_types';

export default function ViewLocationPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const locationId = params.id as string;

  const [location, setLocation] = React.useState<Location | null>(null);

  React.useEffect(() => {
    const foundLocation = mockLocations.find(loc => loc.id === locationId);
    if (foundLocation) {
      setLocation(foundLocation);
    } else {
      toast({ variant: "destructive", title: "Location not found" });
      router.push('/admin/locations');
    }
  }, [locationId, router, toast]);

  if (!location) {
    return <div>Loading location data...</div>;
  }

  const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value?: string | string[] | null | boolean}) => {
    if (value === undefined || value === null || (Array.isArray(value) && value.length === 0) || value === '') return null;
    
    let displayValue: React.ReactNode;
    if (Array.isArray(value)) {
        displayValue = (
            <div className="flex flex-wrap gap-1">
                {value.map(item => <Badge key={item} variant="secondary">{item}</Badge>)}
            </div>
        );
    } else if (typeof value === 'boolean') {
        displayValue = value ? <Badge variant="default">Yes</Badge> : <Badge variant="destructive">No</Badge>;
    }
     else {
        displayValue = <span className="text-foreground">{String(value)}</span>;
    }
    
    return (
        <div className="flex items-start text-sm py-1">
            <Icon className="h-4 w-4 text-muted-foreground mr-2 mt-0.5 shrink-0" />
            <span className="font-medium text-muted-foreground w-32">{label}:</span>
            {displayValue}
        </div>
    );
  };

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Location Details"
        breadcrumbs={[{ label: 'Location Management', href: '/admin/locations' }, { label: location.name }]}
        actionButton={
          <div className="flex gap-2">
            <Link href="/admin/locations" passHref><Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Locations</Button></Link>
            <Link href={`/admin/locations/edit/${location.id}`} passHref><Button><Edit className="mr-2 h-4 w-4" /> Edit Location</Button></Link>
          </div>
        }
      />
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <MapPin className="text-primary"/> {location.name}
          </CardTitle>
          <CardDescription>Location ID: {location.id} <Badge variant="outline" className="ml-2 capitalize">{location.type}</Badge></CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
            <DetailItem icon={MapPin} label="Address" value={location.address} />
            <DetailItem icon={Phone} label="Contact #" value={location.contactNumber} />
            <DetailItem icon={Activity} label="Status" value={<Badge variant={location.status === 'active' ? 'default' : 'destructive'} className="capitalize">{location.status}</Badge>} />
            <DetailItem icon={ListChecks} label="Services" value={location.services} />
             {/* Mock coordinates for display */}
            <DetailItem icon={Globe} label="Latitude" value={"9.005"} />
            <DetailItem icon={Satellite} label="Longitude" value={"38.763"} />
        </CardContent>
      </Card>
      
      {/* Placeholder for map view or related entities (e.g., staff, inventory if pharmacy) */}
       <Card>
        <CardHeader>
            <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Future sections for map integration, assigned staff, or related inventory/bookings.</p>
        </CardContent>
      </Card>
    </div>
  );
}
