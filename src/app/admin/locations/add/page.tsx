
'use client';

import * as React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Save, X, MapPin, Phone } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AdminHeader from '@/app/admin/_components/admin-header';
import { useToast } from '@/hooks/use-toast';

const locationSchema = z.object({
  name: z.string().min(3, { message: "Location name is required." }),
  type: z.enum(['pharmacy', 'lab']),
  address: z.string().min(10, { message: "Full address is required." }),
  contactNumber: z.string().min(9, { message: "Valid contact number is required." }), // Basic validation
  status: z.enum(['active', 'inactive']).default('active'),
  services: z.string().optional(), // Comma-separated list of services
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});

type LocationFormData = z.infer<typeof locationSchema>;

export default function AddLocationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { register, handleSubmit, control, formState: { errors } } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      type: 'pharmacy',
      status: 'active',
    }
  });

  const onSubmit: SubmitHandler<LocationFormData> = async (data) => {
    const locationData = {
        ...data,
        services: data.services?.split(',').map(s => s.trim()).filter(s => s) || [],
    };
    console.log('New location data:', locationData);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Location Created",
      description: `Location "${data.name}" has been successfully created.`,
    });
    router.push('/admin/locations'); 
  };

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Add New Location"
        breadcrumbs={[{ label: 'Location Management', href: '/admin/locations' }, { label: 'Add New' }]}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Location Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Location Name</Label>
              <Input id="name" {...register('name')} placeholder="e.g., Bole Atlas Pharmacy, CMC Lab Services" />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="type">Location Type</Label>
                    <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger id="type"><MapPin className="mr-2 h-4 w-4 text-muted-foreground" /><SelectValue placeholder="Select type" /></SelectTrigger>
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
                    <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger id="status"><SelectValue placeholder="Select status" /></SelectTrigger>
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
              <Textarea id="address" {...register('address')} placeholder="e.g., Atlas Area, Bole Sub-city, Addis Ababa" />
              {errors.address && <p className="text-sm text-destructive mt-1">{errors.address.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="contactNumber">Contact Number</Label>
              <div className="relative">
                <Phone className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                <Input id="contactNumber" {...register('contactNumber')} placeholder="+251 9XX XXX XXX" className="pl-7"/>
              </div>
              {errors.contactNumber && <p className="text-sm text-destructive mt-1">{errors.contactNumber.message}</p>}
            </div>

            <div>
                <Label htmlFor="services">Services Offered (comma-separated)</Label>
                <Input id="services" {...register('services')} placeholder="e.g., Prescription Filling, Blood Test, Consultation"/>
            </div>

            <Separator className="my-6" />
            <h3 className="text-lg font-medium">Geographical Coordinates (Optional)</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input id="latitude" type="number" step="any" {...register('latitude')} placeholder="e.g., 9.005405"/>
                </div>
                <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input id="longitude" type="number" step="any" {...register('longitude')} placeholder="e.g., 38.763611"/>
                </div>
            </div>


          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Link href="/admin/locations" passHref><Button variant="outline" type="button"><X className="mr-2 h-4 w-4" /> Cancel</Button></Link>
            <Button type="submit"><Save className="mr-2 h-4 w-4" /> Save Location</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

function Separator({ className }: { className?: string }) {
  return <hr className={`border-border ${className}`} />;
}
