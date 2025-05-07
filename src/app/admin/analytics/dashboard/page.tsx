
'use client';

import AdminHeader from '@/app/admin/_components/admin-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, ShoppingCart, DollarSign, Download, LineChart as LineChartIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';

const salesData = [
  { month: 'Jan', sales: 4000, revenue: 240000 },
  { month: 'Feb', sales: 3000, revenue: 139800 },
  { month: 'Mar', sales: 2000, revenue: 980000 },
  { month: 'Apr', sales: 2780, revenue: 390800 },
  { month: 'May', sales: 1890, revenue: 480000 },
  { month: 'Jun', sales: 2390, revenue: 380000 },
  { month: 'Jul', sales: 3490, revenue: 430000 },
];

const salesChartConfig = {
  sales: {
    label: "Sales (Units)",
    color: "hsl(var(--primary))",
  },
  revenue: {
    label: "Revenue (ETB)",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

const topProductsData = [
  { name: 'Amoxicillin 250mg', sales: 1235, revenue: 98800 },
  { name: 'Paracetamol 500mg', sales: 980, revenue: 49000 },
  { name: 'Vitamin C 1000mg', sales: 750, revenue: 90000 },
  { name: 'Digital Thermometer', sales: 450, revenue: 112500 },
  { name: 'Loratadine 10mg', sales: 300, revenue: 36000 },
];

const topProductsChartConfig = {
  sales: {
    label: "Units Sold",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


const userActivityData = [
  { month: 'Jan', registrations: 120, activeUsers: 500 },
  { month: 'Feb', registrations: 150, activeUsers: 550 },
  { month: 'Mar', registrations: 130, activeUsers: 600 },
  { month: 'Apr', registrations: 180, activeUsers: 620 },
  { month: 'May', registrations: 200, activeUsers: 680 },
  { month: 'Jun', registrations: 170, activeUsers: 710 },
  { month: 'Jul', registrations: 210, activeUsers: 750 },
];

const userActivityChartConfig = {
  registrations: {
    label: "New Registrations",
    color: "hsl(var(--accent))",
  },
  activeUsers: {
    label: "Active Users",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const PIE_COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--secondary))", "hsl(var(--muted))", "hsl(var(--destructive))"];


export default function AnalyticsDashboardPage() {
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
            <CardDescription>Monthly sales units and revenue trends.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={salesChartConfig} className="h-[350px] w-full">
              <LineChart data={salesData} margin={{ left: 12, right: 12, top:5, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis yAxisId="left" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line yAxisId="left" dataKey="sales" type="monotone" stroke="var(--color-sales)" strokeWidth={2} dot={false} />
                <Line yAxisId="right" dataKey="revenue" type="monotone" stroke="var(--color-revenue)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Top Selling Products (Units)</CardTitle>
             <CardDescription>Most popular products by sales volume.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ChartContainer config={topProductsChartConfig} className="h-full w-full">
                <BarChart data={topProductsData} layout="vertical" margin={{left: 50, right: 10, top: 5, bottom: 5}}>
                    <CartesianGrid horizontal={false} />
                    <XAxis type="number" dataKey="sales" />
                    <YAxis dataKey="name" type="category" tick={{fontSize: 10}} width={100} interval={0} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
       <Card>
        <CardHeader>
          <CardTitle>User Activity</CardTitle>
          <CardDescription>Overview of user engagement and registrations.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ChartContainer config={userActivityChartConfig} className="h-full w-full">
            <BarChart data={userActivityData} margin={{ left: 12, right: 12, top:5, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="registrations" fill="var(--color-registrations)" radius={4} />
                <Bar dataKey="activeUsers" fill="var(--color-activeUsers)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Distribution by Product Category</CardTitle>
          <CardDescription>Breakdown of revenue from different product categories.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
           <ChartContainer config={{}} className="h-full w-full aspect-auto">
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="revenue" hideLabel />}
              />
              <Pie
                data={[
                  { category: 'Antibiotics', revenue: 150000, fill: PIE_COLORS[0] },
                  { category: 'Pain Relief', revenue: 80000, fill: PIE_COLORS[1] },
                  { category: 'Supplements', revenue: 120000, fill: PIE_COLORS[2] },
                  { category: 'Medical Devices', revenue: 100000, fill: PIE_COLORS[3] },
                  { category: 'Other', revenue: 50000, fill: PIE_COLORS[4] },
                ]}
                dataKey="revenue"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={120}
                labelLine={false}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  return (
                    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="10px">
                      {`${payload.category} (${(percent * 100).toFixed(0)}%)`}
                    </text>
                  );
                }}
              >
                 {/* This explicit Cell mapping isn't always necessary if `fill` is in data, but good for consistency */}
                {[
                  { category: 'Antibiotics', revenue: 150000, fill: PIE_COLORS[0] },
                  { category: 'Pain Relief', revenue: 80000, fill: PIE_COLORS[1] },
                  { category: 'Supplements', revenue: 120000, fill: PIE_COLORS[2] },
                  { category: 'Medical Devices', revenue: 100000, fill: PIE_COLORS[3] },
                  { category: 'Other', revenue: 50000, fill: PIE_COLORS[4] },
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="category" />} className="flex justify-center pt-4" />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

    </div>
  );
}

