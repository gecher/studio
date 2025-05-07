
'use client';

import AdminHeader from '@/app/admin/_components/admin-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Repeat } from 'lucide-react';

// Mock data structure for subscriptions
interface Subscription {
  id: string;
  userId: string;
  userName: string;
  planName: 'EasyMeds Plus' | 'EasyMeds Family';
  status: 'active' | 'cancelled' | 'paused';
  startDate: string;
  nextBillingDate: string;
  autoRefillItems?: { productId: string; productName: string; refillIntervalDays: number }[];
}

const mockSubscriptions: Subscription[] = [
  {
    id: 'sub_001',
    userId: 'usr_001',
    userName: 'Abebe Bikila',
    planName: 'EasyMeds Plus',
    status: 'active',
    startDate: '2023-11-01',
    nextBillingDate: '2024-02-01',
    autoRefillItems: [
      { productId: 'prod_001', productName: 'Amoxicillin 250mg', refillIntervalDays: 30 },
    ],
  },
  {
    id: 'sub_002',
    userId: 'usr_004',
    userName: 'Tirunesh Dibaba',
    planName: 'EasyMeds Family',
    status: 'cancelled',
    startDate: '2023-09-15',
    nextBillingDate: '2023-12-15', // last billing if cancelled
  },
];


export default function ManageSubscriptionsPage() {
  // TODO: Fetch and display subscriptions data
  // Implement DataTable for subscriptions

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Manage Subscriptions"
        breadcrumbs={[{ label: 'Order Management', href: '/admin/orders' }, { label: 'Subscriptions' }]}
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Repeat /> Customer Subscriptions</CardTitle>
          <CardDescription>View and manage active, cancelled, or paused subscriptions and auto-refill schedules.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Subscription management interface will be here.</p>
          <ul className="mt-4 space-y-2">
            {mockSubscriptions.map(sub => (
                <li key={sub.id} className="p-2 border rounded-md">
                    <strong>{sub.userName}</strong> - {sub.planName} ({sub.status})
                    <br/>Next Billing: {sub.nextBillingDate}
                    {sub.autoRefillItems && sub.autoRefillItems.length > 0 && (
                        <div className="text-xs text-muted-foreground pl-4">
                            Auto-refills: {sub.autoRefillItems.map(item => `${item.productName} (every ${item.refillIntervalDays} days)`).join(', ')}
                        </div>
                    )}
                </li>
            ))}
          </ul>
          {/* Example: DataTable for subscriptions */}
        </CardContent>
      </Card>
    </div>
  );
}
