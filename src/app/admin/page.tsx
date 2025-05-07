
'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Users, PackageSearch, ShoppingCart, FlaskConical, Video, ShieldCheck, BookOpenText, MapPin, MessageSquare, BarChart3, ArrowRight, PlusCircle, Search } from "lucide-react";
import { Input } from '@/components/ui/input'; // Keep Input if search on main dashboard is intended

export default function AdminDashboardPage() {
  const features = [
    {
      title: "User Management",
      icon: Users,
      description: "View, edit, and manage user accounts and roles.",
      links: [
        { label: "View All Users", href: "/admin/users", icon: Users },
        { label: "Add New User", href: "/admin/users/add", icon: PlusCircle },
      ],
      searchPlaceholder: "Search users...",
    },
    {
      title: "Inventory Management",
      icon: PackageSearch,
      description: "Manage medicines, products, stock levels, and batches.",
      links: [
        { label: "View All Products", href: "/admin/inventory", icon: PackageSearch },
        { label: "Add New Product", href: "/admin/inventory/add", icon: PlusCircle },
        { label: "Manage Batches", href: "/admin/inventory/batches", icon: PackageSearch },
      ],
      searchPlaceholder: "Search products...",
    },
    {
      title: "Order Management",
      icon: ShoppingCart,
      description: "Track orders, update statuses, and manage refunds.",
      links: [
        { label: "View All Orders", href: "/admin/orders", icon: ShoppingCart },
        { label: "Process Refunds", href: "/admin/orders/refunds", icon: ShoppingCart }, // Consider making this a dedicated page or part of order details
        { label: "Manage Subscriptions", href: "/admin/orders/subscriptions", icon: ShoppingCart },
      ],
      searchPlaceholder: "Search orders...",
    },
    {
      title: "Diagnostic Tests",
      icon: FlaskConical,
      description: "Manage test bookings, results, and lab partnerships.",
      links: [
        { label: "View Test Bookings", href: "/admin/diagnostics/bookings", icon: FlaskConical },
        { label: "Upload Results", href: "/admin/diagnostics/results", icon: FlaskConical }, // Could be a page or feature within bookings
        { label: "Manage Labs", href: "/admin/diagnostics/labs", icon: FlaskConical },
      ],
    },
    {
      title: "Teleconsultations",
      icon: Video,
      description: "Oversee appointments, doctor profiles, and call logs.",
      links: [
        { label: "View Appointments", href: "/admin/teleconsultations/appointments", icon: Video },
        { label: "Manage Doctor Profiles", href: "/admin/teleconsultations/doctors", icon: Video },
      ],
    },
    {
      title: "Insurance Management",
      icon: ShieldCheck,
      description: "Verify policies and manage insurance claims.",
      links: [
        { label: "Verify Policies", href: "/admin/insurance/verify", icon: ShieldCheck },
        { label: "Manage Claims", href: "/admin/insurance/claims", icon: ShieldCheck },
        { label: "Manage Providers", href: "/admin/insurance/providers", icon: ShieldCheck },
      ],
    },
    {
      title: "Content Management",
      icon: BookOpenText,
      description: "Manage Health Hub articles, videos, and FAQs.",
      links: [
        { label: "View All Content", href: "/admin/content", icon: BookOpenText },
        { label: "Add New Content", href: "/admin/content/add", icon: PlusCircle },
      ],
    },
    {
      title: "Location Management",
      icon: MapPin,
      description: "Manage partner pharmacies and lab locations.",
      links: [
        { label: "View All Locations", href: "/admin/locations", icon: MapPin },
        { label: "Add New Location", href: "/admin/locations/add", icon: PlusCircle },
      ],
    },
    {
      title: "Chatbot Management",
      icon: MessageSquare,
      description: "Configure chatbot responses and view logs.",
      links: [
        { label: "Configure Responses", href: "/admin/chatbot/responses", icon: MessageSquare },
        { label: "View Query Logs", href: "/admin/chatbot/logs", icon: MessageSquare },
      ],
    },
    {
      title: "Analytics & Reporting",
      icon: BarChart3,
      description: "View platform metrics and generate reports.",
      links: [
        { label: "View Dashboard", href: "/admin/analytics/dashboard", icon: BarChart3 },
        { label: "Generate Reports", href: "/admin/analytics/reports", icon: BarChart3 },
      ],
    },
    {
      title: "System Configuration",
      icon: Settings,
      description: "Manage general platform settings and integrations.",
      links: [
        { label: "General Settings", href: "/admin/settings/general", icon: Settings },
        { label: "Payment Gateways", href: "/admin/settings/payment", icon: Settings },
        { label: "Translations", href: "/admin/settings/translations", icon: Settings },
        { label: "Security Logs", href: "/admin/settings/security-logs", icon: ShieldCheck },
      ],
    },
  ];

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
        {features.map((feature) => (
          <Card key={feature.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <feature.icon className="text-primary" /> {feature.title}
              </CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 flex-grow">
              {feature.searchPlaceholder && (
                 <div className="flex gap-2">
                    <Input placeholder={feature.searchPlaceholder} />
                    <Button variant="outline" size="icon"><Search className="h-4 w-4"/></Button>
                 </div>
              )}
              {feature.links.map((link) => (
                <Link key={link.href} href={link.href} passHref>
                  <Button variant="outline" className="w-full justify-start">
                    {link.icon && <link.icon className="mr-2 h-4 w-4" />}
                    {link.label}
                    <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
                  </Button>
                </Link>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
