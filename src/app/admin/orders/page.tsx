
'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { AlertTriangle, CheckCircle, ShoppingCart } from 'lucide-react';

import { DataTable } from '@/app/admin/_components/data-table';
import AdminHeader from '@/app/admin/_components/admin-header';
import { mockOrders } from '@/app/admin/_lib/mock-data';
import type { Order } from '@/app/admin/_types';
import { 
  createSelectColumn, 
  createStatusColumn, 
  createActionsColumn,
  createGenericColumn
} from '@/app/admin/_components/columns-common';
import { Badge } from '@/components/ui/badge';

export default function OrderManagementPage() {
  const [data, setData] = React.useState<Order[]>(mockOrders);
  
  // No direct delete for orders, usually cancel or refund
  // const handleDeleteOrder = (orderId: string) => { ... }

  const columns: ColumnDef<Order>[] = [
    createSelectColumn<Order>(),
    createGenericColumn<Order>('id', 'Order ID'),
    createGenericColumn<Order>('customerName', 'Customer'),
    createGenericColumn<Order>('orderDate', 'Order Date'),
    createGenericColumn<Order>('totalAmount', 'Total (ETB)'),
    createStatusColumn<Order>('status', 'Order Status'),
    {
      accessorKey: 'paymentStatus',
      header: 'Payment Status',
      cell: ({ row }) => {
        const paymentStatus = row.getValue('paymentStatus') as Order['paymentStatus'];
        let variant: 'default' | 'secondary' | 'destructive' = 'default';
        if (paymentStatus === 'Paid') variant = 'default';
        else if (paymentStatus === 'Unpaid') variant = 'destructive';
        else if (paymentStatus === 'Pending Refund') variant = 'secondary';
        
        return <Badge variant={variant}>{paymentStatus}</Badge>;
      },
    },
    createActionsColumn<Order>({
      viewHref: (id) => `/admin/orders/${id}`,
      // Edit might redirect to view/update status, or a specific edit form
      editHref: (id) => `/admin/orders/edit/${id}`, 
      customActions: (order) => [
        ...(order.status === 'Pending' ? [{ label: 'Process Order', icon: CheckCircle, onClick: () => console.log(`Process order ${order.id}`) }] : []),
        ...(order.status === 'Delivered' && order.paymentStatus === 'Paid' ? [{ label: 'Initiate Refund', icon: AlertTriangle, href: `/admin/orders/refunds?orderId=${order.id}` }] : []),
      ]
    }),
  ];

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Order Management"
        // No "Add New Order" button as orders come from customers
      />
      
      {/* TODO: Add filter controls, e.g., by status, date range */}

      <DataTable 
        columns={columns} 
        data={data}
        searchKey="customerName" // or "id"
        searchPlaceholder="Search by customer name or Order ID..."
      />
    </div>
  );
}
