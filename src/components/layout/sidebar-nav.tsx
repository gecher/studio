
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import {
  HomeIcon,
  Pill as PillIconLucide, 
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
  SheetClose 
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useChatbot } from '@/contexts/chatbot-context';

interface NavItem {
  href?: string;
  label: string;
  icon: LucideIcon;
  adminOnly?: boolean;
  action?: () => void;
}

const navItemsList = (setIsChatbotOpen: (open: boolean) => void): NavItem[] => [
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
  { 
    label: 'Support Chatbot', 
    icon: MessageCircle, 
    action: () => setIsChatbotOpen(true) 
  },
  { href: '/admin', label: 'Admin Dashboard', icon: Settings2, adminOnly: true },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const { openMobile, setOpenMobile, isMobile } = useSidebar();
  const { setIsChatbotOpen } = useChatbot();

  // Placeholder for admin check
  const isAdmin = true; 
  
  const currentNavItems = navItemsList(setIsChatbotOpen);

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="p-4 flex items-center justify-between">
        {isMobile && (
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </Button>
          </SheetClose>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {currentNavItems.map((item) => {
            if (item.adminOnly && !isAdmin) {
              return null;
            }
            const Icon = item.icon;
            const isActive = item.href ? (pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))) : false;

            if (item.action) {
              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    onClick={() => {
                      item.action!();
                      if (isMobile) setOpenMobile(false);
                    }}
                    isActive={false} // Action items typically don't have an 'active' state like links
                    tooltip={{ children: item.label, side: 'right', align: 'center' }}
                    className={cn("hover:bg-sidebar-accent hover:text-sidebar-accent-foreground")}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            } else if (item.href) {
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
            }
            return null;
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        {/* Footer content like settings, logout can go here */}
      </SidebarFooter>
    </Sidebar>
  );
}
