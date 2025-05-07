
'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Edit3, Shield, Bell, LogOut, Camera, Mail, Phone, MapPinIcon } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

// Mock user data - replace with actual data fetching
const initialUserData = {
  name: 'Abebe Bikila',
  email: 'abebe.bikila@example.com',
  phone: '+251 91 123 4567',
  address: 'Bole Sub-city, Woreda 03, Addis Ababa',
  avatarUrl: 'https://picsum.photos/seed/userprofile/200/200',
  memberSince: 'January 15, 2023',
};

export default function ProfilePage() {
  const [userData, setUserData] = useState(initialUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialUserData);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setUserData(formData);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      });
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
        setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
        // In a real app, you'd upload the file and get a new URL
        toast({
          title: "Avatar Changed",
          description: "Your new avatar is previewed. Save to apply.",
        });
      };
      reader.readAsDataURL(file);
    }
  };


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
              <AvatarImage src={isEditing ? formData.avatarUrl : userData.avatarUrl} alt={userData.name} data-ai-hint="user avatar" />
              <AvatarFallback className="text-4xl">{userData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            {isEditing && (
              <label htmlFor="avatar-upload" className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-8 w-8 text-white" />
                <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </label>
            )}
          </div>
          <CardTitle className="text-2xl mt-4">{userData.name}</CardTitle>
          <CardDescription>Member since: {userData.memberSince}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-6 md:px-8">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-muted-foreground">Full Name</Label>
              {isEditing ? (
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} className="text-base" />
              ) : (
                <p className="text-lg font-semibold flex items-center gap-2"><User className="w-4 h-4 text-primary" /> {userData.name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email Address</Label>
              {isEditing ? (
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="text-base" />
              ) : (
                <p className="text-lg flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> {userData.email}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-muted-foreground">Phone Number</Label>
              {isEditing ? (
                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="text-base" />
              ) : (
                <p className="text-lg flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> {userData.phone}</p>
              )}
            </div>
            <div>
              <Label htmlFor="address" className="text-sm font-medium text-muted-foreground">Address</Label>
              {isEditing ? (
                <Input id="address" name="address" value={formData.address} onChange={handleInputChange} className="text-base" />
              ) : (
                <p className="text-lg flex items-center gap-2"><MapPinIcon className="w-4 h-4 text-primary" /> {userData.address}</p>
              )}
            </div>
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
            <Button variant="destructive" className="w-full justify-start gap-2">
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
