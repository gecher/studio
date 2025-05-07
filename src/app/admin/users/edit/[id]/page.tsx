
'use client';

import * as React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Save, X, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AdminHeader from '@/app/admin/_components/admin-header';
import { useToast } from '@/hooks/use-toast';
import { mockUsers } from '@/app/admin/_lib/mock-data';
import type { User } from '@/app/admin/_types';
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
} from "@/components/ui/alert-dialog"

const userEditSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  role: z.enum(['admin', 'pharmacist', 'customer', 'doctor']),
  status: z.enum(['active', 'suspended', 'pending_verification']),
  insuranceProvider: z.enum(['Nyala Insurance', 'CBHI', 'Other', '']).nullable().optional(),
  insurancePolicyNumber: z.string().optional(),
  insuranceVerified: z.boolean().default(false),
  // Password field can be optional for edit, only updated if provided
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters." }).optional().or(z.literal('')),
});

type UserEditFormData = z.infer<typeof userEditSchema>;

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const userId = params.id as string;

  const [user, setUser] = React.useState<User | null>(null);
  
  const { register, handleSubmit, control, formState: { errors }, reset, watch, setValue } = useForm<UserEditFormData>({
    resolver: zodResolver(userEditSchema),
  });

  React.useEffect(() => {
    // Fetch user data - for now, use mock
    const foundUser = mockUsers.find(u => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
      reset({
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        status: foundUser.status,
        insuranceProvider: foundUser.insuranceProvider || null,
        insurancePolicyNumber: foundUser.insurancePolicyNumber || '',
        insuranceVerified: foundUser.insuranceVerified || false,
      });
    } else {
      toast({ variant: "destructive", title: "User not found" });
      router.push('/admin/users');
    }
  }, [userId, reset, router, toast]);

  const showInsuranceFields = watch('role') === 'customer';

  const onSubmit: SubmitHandler<UserEditFormData> = async (data) => {
    console.log('Updated user data:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "User Updated",
      description: `User ${data.name}'s details have been successfully updated.`,
    });
    router.push('/admin/users');
  };
  
  const handleDeleteUser = async () => {
    console.log("Deleting user:", userId);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "User Deleted",
      description: `User ${user?.name} has been deleted.`,
      variant: "destructive"
    });
    router.push('/admin/users');
  };


  if (!user) {
    return <div>Loading user data...</div>; // Or a proper loader
  }

  return (
    <div className="space-y-6">
      <AdminHeader 
        title={`Edit User: ${user.name}`}
        breadcrumbs={[{ label: 'User Management', href: '/admin/users' }, { label: 'Edit User' }]}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>User Details</CardTitle>
            <CardDescription>User ID: {user.id}</CardDescription>
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
             <div>
              <Label htmlFor="newPassword">New Password (optional)</Label>
              <Input id="newPassword" type="password" {...register('newPassword')} placeholder="Leave blank to keep current password" />
              {errors.newPassword && <p className="text-sm text-destructive mt-1">{errors.newPassword.message}</p>}
            </div>

            {showInsuranceFields && (
              <>
                <h3 className="text-lg font-medium pt-4 border-t mt-4">Insurance Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                    <Controller
                      name="insuranceProvider"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <SelectTrigger id="insuranceProvider">
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Nyala Insurance">Nyala Insurance</SelectItem>
                            <SelectItem value="CBHI">CBHI</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                             <SelectItem value="">None</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor="insurancePolicyNumber">Policy Number</Label>
                    <Input id="insurancePolicyNumber" {...register('insurancePolicyNumber')} />
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
          <CardFooter className="flex justify-between">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" type="button">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete User
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the user
                    account and remove their data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteUser}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <div className="flex gap-2">
              <Link href="/admin/users" passHref>
                <Button variant="outline" type="button">
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
              </Link>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
