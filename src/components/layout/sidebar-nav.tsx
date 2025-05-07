
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  Pill as PillIconLucide, // Renamed to avoid conflict
  FlaskConical,
  Video,
  Repeat,
  BookOpenText,
  MapPin,
  ShieldCheck,
  UserCircle2,
  Settings2,
  MessageCircle,
  BriefcaseMedical,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
  SheetClose // Ensure SheetClose is imported if used within mobile sidebar
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/order-medicines', label: 'Order Medicines', icon: PillIconLucide },
  { href: '/products', label: 'Healthcare Products', icon: BriefcaseMedical },
  { href: '/diagnostics', label: 'Book Diagnostics', icon: FlaskConical },
  { href: '/teleconsultation', label: 'Teleconsultation', icon: Video },
  { href: '/subscriptions', label: 'My Subscriptions', icon: Repeat },
  { href: '/health-hub', label: 'Health Hub', icon: BookOpenText },
  { href: '/pharmacy-locator', label: 'Pharmacy Locator', icon: MapPin },
  { href: '/insurance', label: 'My Insurance', icon: ShieldCheck },
  { href: '/profile', label: 'User Profile', icon: UserCircle2 },
  { href: '/support', label: 'Support Chatbot', icon: MessageCircle },
  { href: '/admin', label: 'Admin Dashboard', icon: Settings2, adminOnly: true },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const { openMobile, setOpenMobile, isMobile } = useSidebar();

  // Placeholder for admin check
  const isAdmin = true; 

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="p-4 flex items-center justify-between">
        {/* Logo can go here if needed, or keep it minimal */}
        {isMobile && (
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-accent hover:text-accent-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </Button>
          </SheetClose>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => {
            if (item.adminOnly && !isAdmin) {
              return null;
            }
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    onClick={() => isMobile && setOpenMobile(false)}
                    tooltip={{ children: item.label, side: 'right', align: 'center' }}
                    className={cn(
                      isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <a>
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        {/* Footer content like settings, logout can go here */}
      </SidebarFooter>
    </Sidebar>
  );
}

