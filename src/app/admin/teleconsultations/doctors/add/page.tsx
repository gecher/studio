
'use client';

import * as React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Save, X, UserPlus, Stethoscope, BadgeCheck, Briefcase, Mail, Phone, Info, Image as ImageIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AdminHeader from '@/app/admin/_components/admin-header';
import { useToast } from '@/hooks/use-toast';
import type { DoctorProfile } from '@/app/admin/_types'; // Assuming this type exists

const doctorProfileSchema = z.object({
  name: z.string().min(2, { message: "Doctor's name must be at least 2 characters." }),
  specialty: z.string().min(2, { message: "Specialty is required." }), // Could be a Select with predefined options
  licenseNumber: z.string().min(5, { message: "License number must be at least 5 characters." }),
  licenseVerified: z.boolean().default(false),
  yearsExperience: z.coerce.number().int().min(0, { message: "Years of experience cannot be negative." }),
  status: z.enum(['active', 'inactive', 'pending_verification']).default('pending_verification'),
  contactEmail: z.string().email({ message: "Invalid email address." }),
  contactPhone: z.string().optional(),
  bio: z.string().optional(),
  profilePictureUrl: z.string().url({ message: "Invalid URL for profile picture." }).optional(),
});

type DoctorProfileFormData = z.infer<typeof doctorProfileSchema>;

export default function AddDoctorProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { register, handleSubmit, control, formState: { errors } } = useForm<DoctorProfileFormData>({
    resolver: zodResolver(doctorProfileSchema),
    defaultValues: {
      licenseVerified: false,
      status: 'pending_verification',
    }
  });

  const onSubmit: SubmitHandler<DoctorProfileFormData> = async (data) => {
    const newDoctorProfile: DoctorProfile = {
      ...data,
      id: `doc_${Date.now()}`, // Mock ID generation
    };
    console.log('New doctor profile data:', newDoctorProfile);
    // In a real app: await api.addDoctorProfile(newDoctorProfile);
    // mockDoctorProfiles.push(newDoctorProfile); // This would modify mock data array if it's mutable and accessible
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Doctor Profile Created",
      description: `Profile for Dr. ${data.name} has been successfully created.`,
    });
    router.push('/admin/teleconsultations/doctors'); 
  };

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Add New Doctor Profile"
        breadcrumbs={[
          { label: 'Teleconsultations', href: '/admin/teleconsultations/appointments' }, 
          { label: 'Doctors', href: '/admin/teleconsultations/doctors' }, 
          { label: 'Add New' }
        ]}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Doctor Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <UserPlus className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                <Input id="name" {...register('name')} placeholder="e.g., Dr. Jane Doe" className="pl-7"/>
              </div>
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="specialty">Specialty</Label>
                <div className="relative">
                    <Stethoscope className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                    {/* TODO: Convert to Select with predefined specialties */}
                    <Input id="specialty" {...register('specialty')} placeholder="e.g., General Physician, Pediatrician" className="pl-7"/>
                </div>
                {errors.specialty && <p className="text-sm text-destructive mt-1">{errors.specialty.message}</p>}
              </div>
              <div>
                <Label htmlFor="yearsExperience">Years of Experience</Label>
                 <div className="relative">
                    <Briefcase className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                    <Input id="yearsExperience" type="number" {...register('yearsExperience')} className="pl-7"/>
                </div>
                {errors.yearsExperience && <p className="text-sm text-destructive mt-1">{errors.yearsExperience.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input id="licenseNumber" {...register('licenseNumber')} />
              {errors.licenseNumber && <p className="text-sm text-destructive mt-1">{errors.licenseNumber.message}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="contactEmail">Contact Email</Label>
                     <div className="relative">
                        <Mail className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input id="contactEmail" type="email" {...register('contactEmail')} className="pl-7"/>
                    </div>
                    {errors.contactEmail && <p className="text-sm text-destructive mt-1">{errors.contactEmail.message}</p>}
                </div>
                 <div>
                    <Label htmlFor="contactPhone">Contact Phone (Optional)</Label>
                     <div className="relative">
                        <Phone className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input id="contactPhone" type="tel" {...register('contactPhone')} className="pl-7"/>
                    </div>
                </div>
            </div>

            <div>
              <Label htmlFor="profilePictureUrl">Profile Picture URL (Optional)</Label>
              <div className="relative">
                <ImageIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                <Input id="profilePictureUrl" type="url" {...register('profilePictureUrl')} placeholder="https://example.com/image.jpg" className="pl-7"/>
              </div>
              {errors.profilePictureUrl && <p className="text-sm text-destructive mt-1">{errors.profilePictureUrl.message}</p>}
            </div>

            <div>
              <Label htmlFor="bio">Bio / Description (Optional)</Label>
              <Textarea id="bio" {...register('bio')} placeholder="Short biography or description of expertise..." rows={3}/>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                    <Label htmlFor="status">Account Status</Label>
                    <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger id="status"><SelectValue placeholder="Select status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending_verification">Pending Verification</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                        </Select>
                    )}
                    />
                </div>
                <div className="pt-5"> {/* Align checkbox with label */}
                     <Controller
                        name="licenseVerified"
                        control={control}
                        render={({ field }) => (
                            <div className="flex items-center space-x-2">
                            <Checkbox 
                                id="licenseVerified" 
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                            <Label htmlFor="licenseVerified" className="font-normal flex items-center gap-1">
                                <BadgeCheck className="h-4 w-4 text-muted-foreground"/> License Verified
                            </Label>
                            </div>
                        )}
                    />
                </div>
            </div>

          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Link href="/admin/teleconsultations/doctors" passHref>
              <Button variant="outline" type="button">
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </Link>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" /> Save Doctor Profile
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
