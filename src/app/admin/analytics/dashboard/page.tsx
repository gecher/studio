
'use client';

import AdminHeader from '@/app/admin/_components/admin-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, ShoppingCart, DollarSign, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
// Placeholder for chart components
// import { Bar, Line, Pie } from 'recharts'; // Or ShadCN charts if available

export default function AnalyticsDashboardPage() {
  // Mock data - replace with actual data fetching and chart configurations
  const kpiData = [
    { title: 'Total Revenue', value: '550,000 ETB', icon: DollarSign, trend: '+5.2% vs last month' },
    { title: 'Total Orders', value: '1,250', icon: ShoppingCart, trend: '+10 orders today' },
    { title: 'Active Users', value: '870', icon: Users, trend: '+15 new users this week' },
    { title: 'Conversion Rate', value: '3.5%', icon: TrendingUp, trend: '-0.2% vs last period' },
  ];

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Analytics Dashboard"
        breadcrumbs={[{ label: 'Analytics & Reporting' }]}
        actionButton={
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export Dashboard Summary (PDF)
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map(kpi => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Monthly sales trends.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2 h-[350px] flex items-center justify-center bg-secondary/30">
            {/* Placeholder for Sales Chart */}
            <BarChart3 className="h-24 w-24 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">Sales Chart (e.g., Line/Bar) will be displayed here.</p>
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
             <CardDescription>Most popular products by sales volume.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center bg-secondary/30">
             {/* Placeholder for Top Products List/Chart */}
            <ShoppingCart className="h-24 w-24 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">Top Products List/Pie Chart here.</p>
          </CardContent>
        </Card>
      </div>
      
       <Card>
        <CardHeader>
          <CardTitle>User Activity</CardTitle>
          <CardDescription>Overview of user engagement and registrations.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center bg-secondary/30">
          {/* Placeholder for User Activity Chart */}
          <Users className="h-24 w-24 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">User Registrations / Active Users Chart here.</p>
        </CardContent>
      </Card>

    </div>
  );
}
