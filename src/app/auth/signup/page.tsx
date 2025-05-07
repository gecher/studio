
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import GoogleButton from '@/components/ui/google-button';
import { Pill } from 'lucide-react';
import { useAuth, MOCK_REGULAR_USER } from '@/contexts/auth-context'; // Import useAuth and MOCK_REGULAR_USER
import { useState, useEffect } from 'react'; // Import useState and useEffect

const signupSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'], // path to show error under
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth(); // Get auth context
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const [clientMounted, setClientMounted] = useState(false);

  useEffect(() => {
    setClientMounted(true);
  }, []);

  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    // Mock signup
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // For mock purposes, create a user object similar to MOCK_REGULAR_USER structure
    const newUser = { 
        ...MOCK_REGULAR_USER, // Spread base structure
        id: `usr_${Date.now()}`, 
        name: data.fullName, 
        email: data.email, 
        dateJoined: new Date().toISOString().split('T')[0],
        // Password should not be stored directly in currentUser state
    };
    auth.signup(newUser); // Use auth context signup

    toast({
      title: 'Account Created Successfully',
      description: 'Welcome to EasyMeds! Please log in.',
    });
    router.push('/auth/login'); 
  };

  const handleGoogleSignUp = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Simulate Google sign-up with a mock regular user
    auth.signup(MOCK_REGULAR_USER); 
    toast({
      title: 'Google Sign-Up Successful',
      description: `Welcome, ${MOCK_REGULAR_USER.name}! Your account is created.`,
    });
    router.push('/order-medicines'); 
  };


  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center">
         <Link href="/" className="inline-block mx-auto mb-4">
            <Pill className="w-12 h-12 text-primary" />
        </Link>
        <CardTitle className="text-3xl font-bold">Create an Account</CardTitle>
        <CardDescription>Join EasyMeds for a healthier tomorrow.</CardDescription>
      </CardHeader>
      <CardContent>
        {clientMounted ? (
          <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  {...register('fullName')}
                  aria-invalid={errors.fullName ? "true" : "false"}
                />
                {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  {...register('password')}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                {errors.password && <p className="text-sm text-destructive mt-1">{errors.password.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  {...register('confirmPassword')}
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                />
                {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </form>
            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-border"></div>
              <span className="mx-4 text-xs text-muted-foreground">OR</span>
              <div className="flex-grow border-t border-border"></div>
            </div>
            <GoogleButton onClick={handleGoogleSignUp} disabled={isSubmitting}>
              Sign up with Google
            </GoogleButton>
          </>
        ) : (
          // Placeholder structure for SSR/pre-hydration
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName-placeholder">Full Name</Label>
              <Input id="fullName-placeholder" placeholder="Enter your full name" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-placeholder">Email</Label>
              <Input id="email-placeholder" type="email" placeholder="you@example.com" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-placeholder">Password</Label>
              <Input id="password-placeholder" type="password" placeholder="Create a strong password" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword-placeholder">Confirm Password</Label>
              <Input id="confirmPassword-placeholder" type="password" placeholder="Confirm your password" disabled />
            </div>
            <Button type="button" className="w-full" disabled>
              Sign Up
            </Button>
            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-border"></div>
              <span className="mx-4 text-xs text-muted-foreground">OR</span>
              <div className="flex-grow border-t border-border"></div>
            </div>
            <GoogleButton disabled>
              Sign up with Google
            </GoogleButton>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
