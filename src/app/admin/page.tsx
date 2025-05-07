
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Users, PackageSearch, ShoppingCart, FlaskConical, Video, ShieldCheck, BookOpenText, MapPin, MessageSquare, BarChart3, Search, Edit, PlusCircle, Upload, Eye } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary flex items-center justify-center gap-3">
          <Settings className="w-8 h-8" /> Admin Dashboard
        </h1>
        <p className="text-center text-muted-foreground mt-2 text-lg">
          Manage platform settings, operations, and content.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Management */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="text-primary" /> User Management
            </CardTitle>
            <CardDescription>View, edit, and manage user accounts and roles.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input placeholder="Search users..." />
              <Button variant="outline" size="icon"><Search className="h-4 w-4"/></Button>
            </div>
            <Button className="w-full justify-start" variant="outline"><Eye className="mr-2"/>View All Users</Button>
            <Button className="w-full justify-start" variant="outline"><PlusCircle className="mr-2"/>Add New User</Button>
          </CardContent>
        </Card>

        {/* Inventory Management */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <PackageSearch className="text-primary" /> Inventory Management
            </CardTitle>
            <CardDescription>Manage medicines, products, stock levels, and batches.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input placeholder="Search products..." />
              <Button variant="outline" size="icon"><Search className="h-4 w-4"/></Button>
            </div>
            <Button className="w-full justify-start" variant="outline"><Eye className="mr-2"/>View All Products</Button>
            <Button className="w-full justify-start" variant="outline"><PlusCircle className="mr-2"/>Add New Product</Button>
             <Button className="w-full justify-start" variant="outline"><Edit className="mr-2"/>Manage Batches</Button>
          </CardContent>
        </Card>

        {/* Order Management */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ShoppingCart className="text-primary" /> Order Management
            </CardTitle>
            <CardDescription>Track orders, update statuses, and manage refunds.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
             <div className="flex gap-2">
              <Input placeholder="Search orders..." />
              <Button variant="outline" size="icon"><Search className="h-4 w-4"/></Button>
            </div>
            <Button className="w-full justify-start" variant="outline"><Eye className="mr-2"/>View All Orders</Button>
            <Button className="w-full justify-start" variant="outline"><Edit className="mr-2"/>Process Refunds</Button>
          </CardContent>
        </Card>

        {/* Diagnostic Test Management */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <FlaskConical className="text-primary" /> Diagnostic Tests
            </CardTitle>
            <CardDescription>Manage test bookings, results, and lab partnerships.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline"><Eye className="mr-2"/>View Test Bookings</Button>
            <Button className="w-full justify-start" variant="outline"><Upload className="mr-2"/>Upload Results</Button>
            <Button className="w-full justify-start" variant="outline"><PlusCircle className="mr-2"/>Manage Labs</Button>
          </CardContent>
        </Card>

        {/* Teleconsultation Management */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Video className="text-primary" /> Teleconsultations
            </CardTitle>
            <CardDescription>Oversee appointments, doctor profiles, and call logs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline"><Eye className="mr-2"/>View Appointments</Button>
            <Button className="w-full justify-start" variant="outline"><Edit className="mr-2"/>Manage Doctor Profiles</Button>
          </CardContent>
        </Card>

        {/* Insurance Management */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ShieldCheck className="text-primary" /> Insurance Management
            </CardTitle>
            <CardDescription>Verify policies and manage insurance claims.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline"><ShieldCheck className="mr-2"/>Verify Policies</Button>
            <Button className="w-full justify-start" variant="outline"><Upload className="mr-2"/>Submit Claims</Button>
          </CardContent>
        </Card>
        
        {/* Content Management (Health Hub) */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <BookOpenText className="text-primary" /> Content Management
            </CardTitle>
            <CardDescription>Manage Health Hub articles, videos, and FAQs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline"><PlusCircle className="mr-2"/>Add New Article</Button>
            <Button className="w-full justify-start" variant="outline"><Edit className="mr-2"/>Edit Content</Button>
          </CardContent>
        </Card>

        {/* Location Management */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <MapPin className="text-primary" /> Location Management
            </CardTitle>
            <CardDescription>Manage partner pharmacies and lab locations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline"><PlusCircle className="mr-2"/>Add New Location</Button>
            <Button className="w-full justify-start" variant="outline"><Edit className="mr-2"/>Edit Locations</Button>
          </CardContent>
        </Card>

        {/* Chatbot Management */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <MessageSquare className="text-primary" /> Chatbot Management
            </CardTitle>
            <CardDescription>Configure chatbot responses and view logs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline"><Edit className="mr-2"/>Configure Responses</Button>
            <Button className="w-full justify-start" variant="outline"><Eye className="mr-2"/>View Query Logs</Button>
          </CardContent>
        </Card>

        {/* Analytics & Reporting */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <BarChart3 className="text-primary" /> Analytics & Reporting
            </CardTitle>
            <CardDescription>View platform metrics and generate reports.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline"><BarChart3 className="mr-2"/>View Dashboard</Button>
            <Button className="w-full justify-start" variant="outline"><Upload className="mr-2"/>Generate Reports</Button>
          </CardContent>
        </Card>

        {/* System Configuration */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Settings className="text-primary" /> System Configuration
            </CardTitle>
            <CardDescription>Manage general platform settings and integrations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline"><Settings className="mr-2"/>General Settings</Button>
            <Button className="w-full justify-start" variant="outline"><ShieldCheck className="mr-2"/>Security Logs</Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
