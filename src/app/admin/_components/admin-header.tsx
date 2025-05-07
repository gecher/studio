
'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  actionButton?: React.ReactNode;
}

export default function AdminHeader({ title, breadcrumbs, actionButton }: AdminHeaderProps) {
  const defaultBreadcrumbs: BreadcrumbItem[] = [
    { label: 'Admin', href: '/admin' },
    ...(breadcrumbs || []),
  ];

  return (
    <div className="mb-6">
      {defaultBreadcrumbs.length > 1 && (
        <nav className="mb-2 text-sm text-muted-foreground flex items-center space-x-1">
          <Link href="/admin" className="hover:text-primary">
            <Home className="h-4 w-4 inline-block mr-1" />
            Admin
          </Link>
          {defaultBreadcrumbs.slice(1).map((crumb, index) => (
            <span key={index} className="flex items-center space-x-1">
              <ChevronRight className="h-4 w-4" />
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-primary">
                  {crumb.label}
                </Link>
              ) : (
                <span>{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 md:mb-0">{title}</h1>
        {actionButton && <div>{actionButton}</div>}
      </div>
    </div>
  );
}
