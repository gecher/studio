
'use client';

import *ాలు
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Save, X, Building, MapPin, User, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AdminHeader from '@/app/admin/_components/admin-header';
import { useToast } from '@/hooks/use-toast';
// No mock data needed for adding, but type is useful
import type { LabPartner } from '@/app/admin/_types';

const labPartnerSchema = z.object({
  name: z.string().min(3, { message: "Lab name must be at least 3 characters." }),
  location: z.string().min(10, { message: "Full address is required." }),
  contactPerson: z.string().min(2, { message: "Contact person name is required." }),
  contactEmail: z.string().email({ message: "Invalid email address." }),
  status: z.enum(['active', 'inactive']).default('active'),
  // services: z.string().optional(), // Future: comma-separated list or multi-select
});

type LabPartnerFormData = z.infer<typeof labPartnerSchema>;

export default function AddLabPartnerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { register, handleSubmit, control, formState: { errors } } = useForm<LabPartnerFormData>({
    resolver: zodResolver(labPartnerSchema),
    defaultValues: {
      status: 'active',
    }
  });

  const onSubmit: SubmitHandler<LabPartnerFormData> = async (data) => {
    const newLabPartnerData: LabPartner = {
      ...data,
      id: `lab_${Date.now()}`, // Mock ID generation
      // services: data.services?.split(',').map(s => s.trim()).filter(s => s) || [],
    };
    console.log('New lab partner data:', newLabPartnerData);
    // Simulate API call
    // In a real app: await api.addLabPartner(newLabPartnerData);
    // mockLabPartners.push(newLabPartnerData); // This would modify mock data, but usually managed by backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Lab Partner Added",
      description: `Lab partner "${data.name}" has been successfully created.`,
    });
    router.push('/admin/diagnostics/labs'); 
  };

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Add New Lab Partner"
        breadcrumbs={[
          { label: 'Diagnostics', href: '/admin/diagnostics/bookings' }, 
          { label: 'Labs', href: '/admin/diagnostics/labs' }, 
          { label: 'Add New' }
        ]}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Lab Partner Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Lab Name</Label>
              <div className="relative">
                <Building className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                <Input id="name" {...register('name')} placeholder="e.g., Central Diagnostic Services" className="pl-7"/>
              </div>
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="location">Location / Full Address</Label>
              <div className="relative">
                 <MapPin className="absolute left-2 top-3 h-4 w-4 text-muted-foreground"/>
                <Textarea id="location" {...register('location')} placeholder="e.g., Bole Medhanialem, DH Geda Building, 5th Floor, Addis Ababa" className="pl-7"/>
              </div>
              {errors.location && <p className="text-sm text-destructive mt-1">{errors.location.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactPerson">Contact Person</Label>
                <div className="relative">
                  <User className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                  <Input id="contactPerson" {...register('contactPerson')} placeholder="e.g., Ato. Lemma Tesfaye" className="pl-7"/>
                </div>
                {errors.contactPerson && <p className="text-sm text-destructive mt-1">{errors.contactPerson.message}</p>}
              </div>
              <div>
                <Label htmlFor="contactEmail">Contact Email</Label>
                <div className="relative">
                  <Mail className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                  <Input id="contactEmail" type="email" {...register('contactEmail')} placeholder="e.g., contact@labname.com" className="pl-7"/>
                </div>
                {errors.contactEmail && <p className="text-sm text-destructive mt-1">{errors.contactEmail.message}</p>}
              </div>
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
            {/* 
            <div>
                <Label htmlFor="services">Services Offered (comma-separated, optional)</Label>
                <Input id="services" {...register('services')} placeholder="e.g., Blood Test, Urine Analysis, PCR Test"/>
            </div>
            */}

          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Link href="/admin/diagnostics/labs" passHref>
              <Button variant="outline" type="button">
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </Link>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" /> Save Lab Partner
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
