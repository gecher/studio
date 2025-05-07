
'use client';

import * as React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Save, X, Trash2, Eye, EyeOff } from 'lucide-react'; // Added Eye, EyeOff

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AdminHeader from '@/app/admin/_components/admin-header';
import { useToast } from '@/hooks/use-toast';
import { mockUsers, MOCK_ADMIN_USER } from '@/app/admin/_lib/mock-data'; // Added MOCK_ADMIN_USER
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

const NO_PROVIDER_SELECTED_VALUE_PLACEHOLDER = "NO_PROVIDER_SELECTED_VALUE_PLACEHOLDER";

const userEditSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  role: z.enum(['admin', 'pharmacist', 'customer', 'doctor', 'partner']),
  status: z.enum(['active', 'suspended', 'pending_verification']),
  accountType: z.enum(['basic', 'easymeds_plus']).default('basic'),
  insuranceProvider: z.enum(['Nyala Insurance', 'CBHI', 'Other', NO_PROVIDER_SELECTED_VALUE_PLACEHOLDER]).default(NO_PROVIDER_SELECTED_VALUE_PLACEHOLDER).optional(),
  insurancePolicyNumber: z.string().optional(),
  insuranceVerified: z.boolean().default(false),
  newPassword: z.string().min(8, { message: "New password must be at least 8 characters." }).optional().or(z.literal('')),
});

type UserEditFormData = z.infer<typeof userEditSchema>;

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const userId = params.id as string;

  const [user, setUser] = React.useState<User | null>(null);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
  
  const { register, handleSubmit, control, formState: { errors }, reset, watch, setValue } = useForm<UserEditFormData>({
    resolver: zodResolver(userEditSchema),
  });
  
  const selectedRole = watch('role');

  React.useEffect(() => {
    const foundUser = mockUsers.find(u => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
      
      let formInsuranceProvider: UserEditFormData['insuranceProvider'];
      if (foundUser.insuranceProvider === null || foundUser.insuranceProvider === undefined) {
        formInsuranceProvider = NO_PROVIDER_SELECTED_VALUE_PLACEHOLDER;
      } else {
        formInsuranceProvider = foundUser.insuranceProvider;
      }

      reset({
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        status: foundUser.status,
        accountType: foundUser.accountType || 'basic',
        insuranceProvider: formInsuranceProvider,
        insurancePolicyNumber: foundUser.insurancePolicyNumber || '',
        insuranceVerified: foundUser.insuranceVerified || false,
        newPassword: '', 
      });
    } else {
      toast({ variant: "destructive", title: "User not found" });
      router.push('/admin/users');
    }
  }, [userId, reset, router, toast]);

  React.useEffect(() => {
    if (selectedRole && selectedRole !== 'customer') {
      setValue('accountType', 'basic');
      setValue('insuranceProvider', NO_PROVIDER_SELECTED_VALUE_PLACEHOLDER);
      setValue('insurancePolicyNumber', '');
      setValue('insuranceVerified', false);
    }
  }, [selectedRole, setValue]);

  const showInsuranceFields = selectedRole === 'customer';
  const showAccountTypeField = selectedRole === 'customer';


  const onSubmit: SubmitHandler<UserEditFormData> = async (formData) => {
    const { insuranceProvider, newPassword, ...restData } = formData;

    let finalInsuranceProvider: User['insuranceProvider'] = null;
    if (selectedRole === 'customer' && insuranceProvider && insuranceProvider !== NO_PROVIDER_SELECTED_VALUE_PLACEHOLDER) {
      finalInsuranceProvider = insuranceProvider as User['insuranceProvider'];
    }
    
    const dataToUpdate: Partial<User> & { newPassword?: string } = { // Ensure newPassword can be part of this type
        ...restData,
        insuranceProvider: finalInsuranceProvider,
    };

    if (newPassword && newPassword.trim() !== '') {
        dataToUpdate.password = newPassword; // Use 'password' to match User type, or 'newPassword' if backend expects that
        dataToUpdate.newPassword = newPassword; // Keep for clarity if used elsewhere or if type needs it
    }

    console.log('Updated user data (transformed for submission):', dataToUpdate);
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        const updatedUser: User = {
            ...mockUsers[userIndex], 
            name: dataToUpdate.name!,
            email: dataToUpdate.email!,
            role: dataToUpdate.role!,
            status: dataToUpdate.status!,
            accountType: dataToUpdate.accountType!,
            insuranceProvider: dataToUpdate.insuranceProvider,
            insurancePolicyNumber: dataToUpdate.insurancePolicyNumber || '', 
            insuranceVerified: dataToUpdate.insuranceVerified || false,
            ...(dataToUpdate.password && { password: dataToUpdate.password }), // Conditionally add password
        };
        mockUsers[userIndex] = updatedUser;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "User Updated",
      description: `User ${formData.name}'s details have been successfully updated.`,
    });
    router.push('/admin/users');
  };
  
  const handleDeleteUser = async () => {
    console.log("Deleting user:", userId);
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        mockUsers.splice(userIndex, 1);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "User Deleted",
      description: `User ${user?.name} has been deleted.`,
      variant: "destructive"
    });
    router.push('/admin/users');
  };


  if (!user) {
    return <div>Loading user data...</div>;
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
                        <SelectItem value="partner">Partner (Pharmacy/Lab)</SelectItem>
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
            {showAccountTypeField && (
                 <div>
                    <Label htmlFor="accountType">Account Type (Customer)</Label>
                    <Controller
                        name="accountType"
                        control={control}
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="accountType">
                            <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="basic">Basic</SelectItem>
                            <SelectItem value="easymeds_plus">EasyMeds Plus</SelectItem>
                            </SelectContent>
                        </Select>
                        )}
                    />
                    {errors.accountType && <p className="text-sm text-destructive mt-1">{errors.accountType.message}</p>}
                </div>
            )}
             <div>
              <Label htmlFor="newPassword">New Password (optional)</Label>
              <div className="relative">
                <Input 
                  id="newPassword" 
                  type={showNewPassword ? 'text' : 'password'} 
                  {...register('newPassword')} 
                  placeholder="Leave blank to keep current password" 
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:bg-transparent"
                  onClick={toggleNewPasswordVisibility}
                  aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.newPassword && <p className="text-sm text-destructive mt-1">{errors.newPassword.message}</p>}
            </div>

            {showInsuranceFields && (
              <>
                <h3 className="text-lg font-medium pt-4 border-t mt-4">Insurance Details (Customer)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                    <Controller
                      name="insuranceProvider"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || NO_PROVIDER_SELECTED_VALUE_PLACEHOLDER}>
                          <SelectTrigger id="insuranceProvider">
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={NO_PROVIDER_SELECTED_VALUE_PLACEHOLDER}>None</SelectItem>
                            <SelectItem value="Nyala Insurance">Nyala Insurance</SelectItem>
                            <SelectItem value="CBHI">CBHI</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
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
                <Button variant="destructive" type="button" disabled={user.id === MOCK_ADMIN_USER.id}> 
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
