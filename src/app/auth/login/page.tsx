
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
import { useAuth } from '@/contexts/auth-context';
import { MOCK_ADMIN_USER, MOCK_REGULAR_USER } from '@/contexts/auth-context'; // Import mock users

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth(); // Get auth context
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

    if (data.email === MOCK_ADMIN_USER.email && data.password === '1234') {
      auth.login(MOCK_ADMIN_USER);
      toast({
        title: 'Admin Login Successful',
        description: `Welcome back, ${MOCK_ADMIN_USER.name}!`,
      });
      router.push('/admin'); // Redirect admin to admin dashboard
    } else if (data.email === MOCK_REGULAR_USER.email && data.password === 'password') { // Example regular user
      auth.login(MOCK_REGULAR_USER);
       toast({
        title: 'Login Successful',
        description: `Welcome back, ${MOCK_REGULAR_USER.name}!`,
      });
      router.push('/order-medicines');
    }
     else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid email or password.',
      });
    }
  };

  const handleGoogleSignIn = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Simulate Google sign-in with a mock regular user
    auth.login(MOCK_REGULAR_USER); 
    toast({
      title: 'Google Sign-In Successful',
      description: `Welcome, ${MOCK_REGULAR_USER.name}!`,
    });
    router.push('/order-medicines');
  };

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
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              aria-invalid={errors.password ? "true" : "false"}
            />
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

