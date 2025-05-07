
'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Edit3, Shield, Bell, LogOut, Camera, Mail, Phone, MapPinIcon, Briefcase, ShoppingBag } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const { currentUser, logout, mounted: authMounted } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [userData, setUserData] = useState(currentUser); // Initialize with currentUser
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(currentUser);

  useEffect(() => {
    if (authMounted && !currentUser) {
      router.push('/auth/login?redirect=/profile');
    } else if (authMounted && currentUser) {
      setUserData(currentUser);
      setFormData(currentUser);
    }
  }, [authMounted, currentUser, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? ({ ...prev, [name]: value }) : null);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes - In a real app, this would be an API call
      if (formData) {
        setUserData(formData); 
        // Potentially update context or local storage if those are sources of truth after API call
        toast({
          title: "Profile Updated",
          description: "Your profile information has been successfully updated.",
        });
      }
    } else {
      // Enter edit mode
      setFormData(userData);
    }
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setFormData(userData);
    setIsEditing(false);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => prev ? ({ ...prev, avatarUrl: reader.result as string }) : null);
        toast({
          title: "Avatar Changed",
          description: "Your new avatar is previewed. Save to apply.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    logout();
    toast({ title: "Logged Out", description: "You have been successfully logged out."});
    router.push('/');
  };

  if (!authMounted || !currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <User className="w-24 h-24 text-muted-foreground mb-6 animate-pulse" />
          <p className="text-muted-foreground text-lg">Loading profile or redirecting...</p>
      </div>
    );
  }
  // Use `userData` for display (committed state) and `formData` for editing form
  const displayUser = isEditing ? formData : userData;

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
          <User /> Your Profile
        </h1>
        <p className="text-muted-foreground">Manage your account information and preferences.</p>
      </header>

      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="items-center text-center">
          <div className="relative group">
            <Avatar className="w-32 h-32 border-4 border-primary shadow-md">
              <AvatarImage src={(displayUser as any).avatarUrl || `https://picsum.photos/seed/${displayUser?.id}/200`} alt={displayUser?.name} data-ai-hint="user avatar" />
              <AvatarFallback className="text-4xl">{displayUser?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            {isEditing && (
              <label htmlFor="avatar-upload" className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-8 w-8 text-white" />
                <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </label>
            )}
          </div>
          <CardTitle className="text-2xl mt-4">{displayUser?.name}</CardTitle>
          <CardDescription>Member since: {displayUser?.dateJoined}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-6 md:px-8">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-muted-foreground">Full Name</Label>
              {isEditing ? (
                <Input id="name" name="name" value={displayUser?.name || ''} onChange={handleInputChange} className="text-base" />
              ) : (
                <p className="text-lg font-semibold flex items-center gap-2"><User className="w-4 h-4 text-primary" /> {displayUser?.name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email Address</Label>
              {isEditing ? (
                <Input id="email" name="email" type="email" value={displayUser?.email || ''} onChange={handleInputChange} className="text-base" />
              ) : (
                <p className="text-lg flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> {displayUser?.email}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-muted-foreground">Phone Number</Label>
              {isEditing ? (
                <Input id="phone" name="phone" type="tel" value={(displayUser as any).phone || ''} onChange={handleInputChange} className="text-base" placeholder="e.g. +251 9XX XXX XXX"/>
              ) : (
                <p className="text-lg flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> {(displayUser as any).phone || 'Not set'}</p>
              )}
            </div>
            <div>
              <Label htmlFor="address" className="text-sm font-medium text-muted-foreground">Address</Label>
              {isEditing ? (
                <Input id="address" name="address" value={(displayUser as any).address || ''} onChange={handleInputChange} className="text-base" placeholder="e.g. Bole Sub-city, Woreda 03, Addis Ababa"/>
              ) : (
                <p className="text-lg flex items-center gap-2"><MapPinIcon className="w-4 h-4 text-primary" /> {(displayUser as any).address || 'Not set'}</p>
              )}
            </div>
            {displayUser?.role === 'customer' && (
                 <div>
                    <Label className="text-sm font-medium text-muted-foreground">Account Type</Label>
                    <p className="text-lg flex items-center gap-2"><Briefcase className="w-4 h-4 text-primary" /> <span className="capitalize">{(displayUser as User).accountType.replace('_', ' ')} Account</span></p>
                 </div>
            )}
          </div>
          <Separator />
           <div className="space-y-3">
                <h3 className="text-lg font-semibold">More Options</h3>
                {displayUser?.role === 'customer' && displayUser.accountType === 'basic' && (
                    <Link href="/subscriptions#plus">
                        <Button variant="outline" className="w-full justify-start gap-2 bg-accent/10 border-accent text-accent hover:bg-accent/20">
                            <ShoppingBag className="w-5 h-5" /> Upgrade to EasyMeds Plus
                        </Button>
                    </Link>
                )}
                 <Link href="/order-history"> {/* Assume an order history page */}
                    <Button variant="outline" className="w-full justify-start gap-2">
                        <ShoppingBag className="w-5 h-5 text-primary" /> Order History
                    </Button>
                </Link>
            </div>

          <Separator />
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Account Settings</h3>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Shield className="w-5 h-5 text-primary" /> Security & Password
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Bell className="w-5 h-5 text-primary" /> Notification Preferences
            </Button>
            <Button variant="destructive" className="w-full justify-start gap-2" onClick={handleLogout}>
              <LogOut className="w-5 h-5" /> Log Out
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 px-6 md:px-8 pb-6">
          {isEditing && (
            <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
          )}
          <Button onClick={handleEditToggle} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            {isEditing ? (<><User className="mr-2 h-4 w-4" /> Save Changes</>) : (<><Edit3 className="mr-2 h-4 w-4" /> Edit Profile</>)}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
