'use client';

import * as React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import { PlusCircle, Save, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AdminHeader from '@/app/admin/_components/admin-header';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox'; 
import type { User } from '@/app/admin/_types'; 

const NO_PROVIDER_SELECTED_VALUE = "NO_PROVIDER_SELECTED_VALUE";

const userSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  role: z.enum(['admin', 'pharmacist', 'customer', 'doctor']),
  status: z.enum(['active', 'suspended', 'pending_verification']).default('pending_verification'),
  insuranceProvider: z.enum(['Nyala Insurance', 'CBHI', 'Other', NO_PROVIDER_SELECTED_VALUE]).optional(),
  insurancePolicyNumber: z.string().optional(),
  insuranceVerified: z.boolean().default(false),
});

type UserFormData = z.infer<typeof userSchema>;

export default function AddUserPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { register, handleSubmit, control, formState: { errors }, setValue, watch } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: 'customer',
      status: 'pending_verification',
      insuranceVerified: false,
      insuranceProvider: undefined, // Explicitly undefined to show placeholder initially
    }
  });

  const showInsuranceFields = watch('role') === 'customer';

  const onSubmit: SubmitHandler<UserFormData> = async (formData) => {
    const { insuranceProvider, ...restData } = formData;
    
    let finalInsuranceProvider: User['insuranceProvider'] = null;
    if (insuranceProvider && insuranceProvider !== NO_PROVIDER_SELECTED_VALUE) {
      finalInsuranceProvider = insuranceProvider as 'Nyala Insurance' | 'CBHI' | 'Other';
    }

    const dataToSubmit = {
      ...restData,
      insuranceProvider: finalInsuranceProvider,
      // Ensure other fields match the User type or are transformed as needed
      // For mock purposes, we'll log the transformed data
      id: `usr_${Date.now()}`, // Mock ID generation
      dateJoined: new Date().toISOString().split('T')[0], // Mock dateJoined
    };

    console.log('New user data (transformed for submission):', dataToSubmit);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "User Created",
      description: `User ${formData.name} has been successfully created.`,
    });
    router.push('/admin/users'); 
  };

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Add New User"
        breadcrumbs={[{ label: 'User Management', href: '/admin/users' }, { label: 'Add New' }]}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>User Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && <p className="text-sm text-destructive mt-1">{errors.password.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role">Role</Label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="pharmacist">Pharmacist</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.role && <p className="text-sm text-destructive mt-1">{errors.role.message}</p>}
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                 <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending_verification">Pending Verification</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status && <p className="text-sm text-destructive mt-1">{errors.status.message}</p>}
              </div>
            </div>

            {showInsuranceFields && (
              <>
                <h3 className="text-lg font-medium pt-4 border-t mt-4">Insurance Details (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                    <Controller
                      name="insuranceProvider"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || ""}> {/* Fallback to "" for placeholder if undefined */}
                          <SelectTrigger id="insuranceProvider">
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Nyala Insurance">Nyala Insurance</SelectItem>
                            <SelectItem value="CBHI">CBHI</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                            <SelectItem value={NO_PROVIDER_SELECTED_VALUE}>None</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.insuranceProvider && <p className="text-sm text-destructive mt-1">{errors.insuranceProvider.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="insurancePolicyNumber">Policy Number</Label>
                    <Input id="insurancePolicyNumber" {...register('insurancePolicyNumber')} />
                    {errors.insurancePolicyNumber && <p className="text-sm text-destructive mt-1">{errors.insurancePolicyNumber.message}</p>}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                   <Controller
                      name="insuranceVerified"
                      control={control}
                      render={({ field }) => (
                         <Checkbox 
                            id="insuranceVerified" 
                            checked={field.value} 
                            onCheckedChange={field.onChange}
                          />
                      )}
                    />
                  <Label htmlFor="insuranceVerified" className="font-normal">Insurance Verified</Label>
                </div>
              </>
            )}

          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Link href="/admin/users" passHref>
              <Button variant="outline" type="button">
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </Link>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" /> Save User
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
