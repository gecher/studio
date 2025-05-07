
'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation'; 
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import GoogleButton from '@/components/ui/google-button';
import { Pill, LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth, MOCK_ADMIN_USER, MOCK_BASIC_CUSTOMER_USER, MOCK_PLUS_CUSTOMER_USER, MOCK_PHARMACIST_USER, MOCK_DOCTOR_USER, MOCK_PARTNER_USER } from '@/contexts/auth-context';
import { useState, useEffect } from 'react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const auth = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const [clientMounted, setClientMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setClientMounted(true);
  }, []);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); 

    let loggedInUser = null;
    let redirectPath = '/';

    // Expanded mock user check
    const mockUsers = [
      MOCK_ADMIN_USER, 
      MOCK_BASIC_CUSTOMER_USER, 
      MOCK_PLUS_CUSTOMER_USER, 
      MOCK_PHARMACIST_USER, 
      MOCK_DOCTOR_USER, 
      MOCK_PARTNER_USER
    ];

    const foundUser = mockUsers.find(user => user.email === data.email && user.password === data.password);

    if (foundUser) {
      loggedInUser = foundUser;
      switch(foundUser.role) {
        case 'admin':
          redirectPath = '/admin';
          break;
        case 'pharmacist':
          redirectPath = '/admin/inventory'; // Or a dedicated pharmacist dashboard
          break;
        case 'doctor':
          redirectPath = '/admin/teleconsultations/appointments'; // Or a dedicated doctor dashboard
          break;
        case 'partner':
          redirectPath = '/admin/inventory'; // Or a dedicated partner dashboard
          break;
        case 'customer':
        default:
          redirectPath = searchParams.get('redirect') || '/order-medicines';
          break;
      }
    }


    if (loggedInUser) {
      auth.login(loggedInUser);
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${loggedInUser.name}!`,
      });
      router.push(redirectPath);
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid email or password.',
      });
    }
  };

  const handleGoogleSignIn = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    auth.login(MOCK_BASIC_CUSTOMER_USER); 
    toast({
      title: 'Google Sign-In Successful',
      description: `Welcome, ${MOCK_BASIC_CUSTOMER_USER.name}!`,
    });
    router.push(searchParams.get('redirect') || '/order-medicines');
  };


  if (!clientMounted) {
    // Skeleton loader or simplified static version for SSR
    return (
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mx-auto mb-4">
              <Pill className="w-12 h-12 text-primary" />
          </Link>
          <CardTitle className="text-3xl font-bold">Welcome Back!</CardTitle>
          <CardDescription>Log in to access your EasyMeds account.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="space-y-6 animate-pulse">
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-1/4"></div> {/* Label */}
              <div className="h-10 bg-muted rounded"></div>      {/* Input */}
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-1/4"></div> {/* Label */}
              <div className="h-10 bg-muted rounded"></div>      {/* Input */}
            </div>
            <div className="h-10 bg-primary/50 rounded"></div>   {/* Button */}
            <div className="flex items-center">
              <div className="flex-grow border-t border-border/50"></div>
              <span className="mx-4 text-xs text-muted-foreground">OR</span>
              <div className="flex-grow border-t border-border/50"></div>
            </div>
            <div className="h-10 bg-secondary rounded"></div>    {/* Google Button */}
          </div>
        </CardContent>
         <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="font-medium text-primary hover:underline">
              Sign up
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
        <CardTitle className="text-3xl font-bold">Welcome Back!</CardTitle>
        <CardDescription>Log in to access your EasyMeds account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/auth/forgot-password" passHref>
                    <Button variant="link" size="sm" className="p-0 h-auto text-xs">Forgot password?</Button>
                </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
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
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </Button>
        </form>
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-border"></div>
          <span className="mx-4 text-xs text-muted-foreground">OR</span>
          <div className="flex-grow border-t border-border"></div>
        </div>
        <GoogleButton onClick={handleGoogleSignIn} disabled={isSubmitting}>
          Sign in with Google
        </GoogleButton>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
