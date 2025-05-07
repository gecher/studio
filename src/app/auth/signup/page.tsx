
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
import { Pill, Eye, EyeOff } from 'lucide-react';
import { useAuth, MOCK_BASIC_CUSTOMER_USER } from '@/contexts/auth-context'; 
import { useState, useEffect } from 'react'; 

const signupSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'], 
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth(); 
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const [clientMounted, setClientMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setClientMounted(true);
  }, []);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const newUser = { 
        ...MOCK_BASIC_CUSTOMER_USER, 
        id: `usr_${Date.now()}`, 
        name: data.fullName, 
        email: data.email, 
        dateJoined: new Date().toISOString().split('T')[0],
        password: data.password, 
    };
    auth.signup(newUser); 

    toast({
      title: 'Account Created Successfully',
      description: 'Welcome to EasyMeds! Please log in.',
    });
    router.push('/auth/login'); 
  };

  const handleGoogleSignUp = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const googleUser = {
      ...MOCK_BASIC_CUSTOMER_USER,
      name: "Google User", 
      email: "googleuser@example.com", 
      id: `usr_google_${Date.now()}`
    }
    auth.signup(googleUser); 
    toast({
      title: 'Google Sign-Up Successful',
      description: `Welcome, ${googleUser.name}! Your account is created.`,
    });
    router.push('/order-medicines'); 
  };


  if (!clientMounted) {
    // Skeleton loader for SSR
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
          <div className="space-y-6 animate-pulse">
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
            <div className="h-10 bg-primary/50 rounded"></div>
            <div className="flex items-center">
              <div className="flex-grow border-t border-border/50"></div>
              <span className="mx-4 text-xs text-muted-foreground">OR</span>
              <div className="flex-grow border-t border-border/50"></div>
            </div>
            <div className="h-10 bg-secondary rounded"></div>
          </div>
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
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                {...register('password')}
                aria-invalid={errors.password ? "true" : "false"}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:bg-transparent"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password && <p className="text-sm text-destructive mt-1">{errors.password.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                {...register('confirmPassword')}
                aria-invalid={errors.confirmPassword ? "true" : "false"}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:bg-transparent"
                onClick={toggleConfirmPasswordVisibility}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
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
