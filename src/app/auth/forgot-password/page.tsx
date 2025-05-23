
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
import { Pill, Undo2, Eye, EyeOff } from 'lucide-react'; // Added Eye, EyeOff
import { useState, useEffect } from 'react'; 

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const [clientMounted, setClientMounted] = useState(false);
  // const [showPassword, setShowPassword] = useState(false); // If a password field were added

  useEffect(() => {
    setClientMounted(true);
  }, []);

  // const togglePasswordVisibility = () => setShowPassword(!showPassword); // If a password field were added

  const onSubmit: SubmitHandler<ForgotPasswordFormValues> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Forgot password for email:', data.email);
    toast({
      title: 'Password Reset Email Sent',
      description: 'If an account exists for this email, you will receive password reset instructions shortly.',
    });
  };

  if (!clientMounted) {
    // Skeleton loader for SSR
    return (
       <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mx-auto mb-4">
            <Pill className="w-12 h-12 text-primary" />
          </Link>
          <CardTitle className="text-3xl font-bold">Forgot Password?</CardTitle>
          <CardDescription>Enter your email to receive reset instructions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 animate-pulse">
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-1/4"></div> {/* Label */}
              <div className="h-10 bg-muted rounded"></div>      {/* Input */}
            </div>
            <div className="h-10 bg-primary/50 rounded"></div>   {/* Button */}
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <Link href="/auth/login" passHref>
              <Button variant="link" className="text-sm text-muted-foreground">
                  <Undo2 className="mr-2 h-4 w-4" /> Back to Login
              </Button>
          </Link>
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
        <CardTitle className="text-3xl font-bold">Forgot Password?</CardTitle>
        <CardDescription>Enter your email to receive reset instructions.</CardDescription>
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
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <Link href="/auth/login" passHref>
            <Button variant="link" className="text-sm text-muted-foreground">
                <Undo2 className="mr-2 h-4 w-4" /> Back to Login
            </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
