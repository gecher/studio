
'use client';

import *ాలు
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Save, X, MapPin, Phone, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AdminHeader from '@/app/admin/_components/admin-header';
import { useToast } from '@/hooks/use-toast';
import { mockLocations } from '@/app/admin/_lib/mock-data';
import type { Location } from '@/app/admin/_types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


const locationEditSchema = z.object({
  name: z.string().min(3, { message: "Location name is required." }),
  type: z.enum(['pharmacy', 'lab']),
  address: z.string().min(10, { message: "Full address is required." }),
  contactNumber: z.string().min(9, { message: "Valid contact number is required." }),
  status: z.enum(['active', 'inactive']),
  services: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});

type LocationEditFormData = z.infer<typeof locationEditSchema>;

export default function EditLocationPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const locationId = params.id as string;

  const [location, setLocation] = React.useState<Location | null>(null);
  
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<LocationEditFormData>({
    resolver: zodResolver(locationEditSchema),
  });

  React.useEffect(() => {
    const foundLocation = mockLocations.find(loc => loc.id === locationId);
    if (foundLocation) {
      setLocation(foundLocation);
      reset({
        name: foundLocation.name,
        type: foundLocation.type,
        address: foundLocation.address,
        contactNumber: foundLocation.contactNumber,
        status: foundLocation.status,
        services: foundLocation.services?.join(', ') || '',
        latitude: foundLocation.services ? parseFloat(foundLocation.services[0]) : undefined, // MOCK latitude/longitude
        longitude: foundLocation.services ? parseFloat(foundLocation.services[1]) : undefined,
      });
    } else {
      toast({ variant: "destructive", title: "Location not found" });
      router.push('/admin/locations');
    }
  }, [locationId, reset, router, toast]);

  const onSubmit: SubmitHandler<LocationEditFormData> = async (data) => {
     const locationData = {
        ...data,
        id: locationId, // ensure ID is part of the data for update
        services: data.services?.split(',').map(s => s.trim()).filter(s => s) || [],
    };
    console.log('Updated location data:', locationData);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Location Updated",
      description: `Location "${data.name}" has been updated.`,
    });
    router.push('/admin/locations');
  };
  
  const handleDeleteLocation = async () => {
    console.log("Deleting location:", locationId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Location Deleted",
      description: `Location "${location?.name}" has been deleted.`,
      variant: "destructive"
    });
    router.push('/admin/locations');
  };


  if (!location) {
    return <div>Loading location data...</div>;
  }

  return (
    <div className="space-y-6">
      <AdminHeader 
        title={`Edit Location: ${location.name}`}
        breadcrumbs={[{ label: 'Location Management', href: '/admin/locations' }, { label: 'Edit Location' }]}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Location Details</CardTitle>
            <CardDescription>Location ID: {location.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Location Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="type">Location Type</Label>
                    <Controller name="type" control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="type"><MapPin className="mr-2 h-4 w-4 text-muted-foreground" /><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pharmacy">Pharmacy</SelectItem>
                                <SelectItem value="lab">Diagnostic Lab</SelectItem>
                            </SelectContent>
                            </Select>
                        )}
                    />
                </div>
                <div>
                    <Label htmlFor="status">Status</Label>
                     <Controller name="status" control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            </div>
            
            <div>
              <Label htmlFor="address">Full Address</Label>
              <Textarea id="address" {...register('address')} />
              {errors.address && <p className="text-sm text-destructive mt-1">{errors.address.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="contactNumber">Contact Number</Label>
              <div className="relative">
                <Phone className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                <Input id="contactNumber" {...register('contactNumber')} className="pl-7"/>
              </div>
              {errors.contactNumber && <p className="text-sm text-destructive mt-1">{errors.contactNumber.message}</p>}
            </div>
             <div>
                <Label htmlFor="services">Services Offered (comma-separated)</Label>
                <Input id="services" {...register('services')} />
            </div>

            <Separator className="my-6" />
            <h3 className="text-lg font-medium">Geographical Coordinates (Optional)</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input id="latitude" type="number" step="any" {...register('latitude')} />
                </div>
                <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input id="longitude" type="number" step="any" {...register('longitude')} />
                </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
             <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" type="button"><Trash2 className="mr-2 h-4 w-4" /> Delete Location</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone and will permanently delete this location.</AlertDialogDescription></AlertDialogHeader>
                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteLocation}>Continue</AlertDialogAction></AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <div className="flex gap-2">
              <Link href="/admin/locations" passHref><Button variant="outline" type="button"><X className="mr-2 h-4 w-4" /> Cancel</Button></Link>
              <Button type="submit"><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

function Separator({ className }: { className?: string }) {
  return <hr className={`border-border ${className}`} />;
}
