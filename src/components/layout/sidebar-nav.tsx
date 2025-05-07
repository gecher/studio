
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Added useRouter
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
  LogIn,
  LogOut,
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
  SheetClose, 
  CloseIcon
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useChatbot } from '@/contexts/chatbot-context';
import { useLanguage, type Language as AppLanguage } from '@/contexts/language-context'; 
import { useAuth } from '@/contexts/auth-context'; 
import { useToast } from '@/hooks/use-toast';

interface NavItem {
  href?: string;
  label: string;
  amharicLabel?: string; 
  icon: LucideIcon;
  adminOnly?: boolean;
  authRequired?: boolean; 
  guestOnly?: boolean; 
  action?: () => void;
}

const navItemsList = (
  setIsChatbotOpen: (open: boolean) => void, 
  handleLogout: () => void,
  currentLanguage: AppLanguage,
  isAuthenticated: boolean,
  isAdmin: boolean
): NavItem[] => [
  { href: '/', label: 'Home', amharicLabel: 'ዋና ገጽ', icon: HomeIcon },
  { href: '/order-medicines', label: 'Order Medicines', amharicLabel: 'መድኃኒቶችን ይዘዙ', icon: PillIconLucide },
  { href: '/products', label: 'Healthcare Products', amharicLabel: 'የጤና ምርቶች', icon: BriefcaseMedical },
  { href: '/diagnostics', label: 'Book Diagnostics', amharicLabel: 'ምርመራ ያስይዙ', icon: FlaskConical },
  { href: '/teleconsultation', label: 'Teleconsultation', amharicLabel: 'የቴሌ ምክክር', icon: Video },
  { href: '/subscriptions', label: 'Subscriptions', amharicLabel: 'ምዝገባዎች', icon: Repeat, authRequired: true },
  { href: '/health-hub', label: 'Health Hub', amharicLabel: 'የጤና መረጃ ማዕከል', icon: BookOpenText },
  { href: '/pharmacy-locator', label: 'Pharmacy Locator', amharicLabel: 'ፋርማሲ አመልካች', icon: MapPin },
  { href: '/insurance', label: 'My Insurance', amharicLabel: 'የእኔ መድን', icon: ShieldCheck, authRequired: true },
  { href: '/profile', label: 'My Profile', amharicLabel: 'የእኔ መገለጫ', icon: UserCircle2, authRequired: true },
  { 
    label: 'Support Chatbot', 
    amharicLabel: 'የድጋፍ ቻትቦት',
    icon: MessageCircle, 
    action: () => setIsChatbotOpen(true) 
  },
  // Conditional Auth Links
  { href: '/auth/login', label: 'Login', amharicLabel: 'ግባ', icon: LogIn, guestOnly: true },
  { label: 'Logout', amharicLabel: 'ውጣ', icon: LogOut, authRequired: true, action: handleLogout },
  
  // Admin Link
  ...(isAdmin && isAuthenticated ? [{ href: '/admin', label: 'Admin Dashboard', amharicLabel: 'የአስተዳዳሪ ዳሽቦርድ', icon: Settings2, adminOnly: true, authRequired: true }] : []),
];

export default function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter(); 
  const { openMobile, setOpenMobile, isMobile } = useSidebar();
  const { setIsChatbotOpen } = useChatbot();
  const { language, mounted: languageMounted } = useLanguage(); 
  const { isAuthenticated, currentUser, logout, mounted: authMounted } = useAuth();
  const { toast } = useToast();

  const isAdmin = currentUser?.role === 'admin'; 
  
  if (!languageMounted || !authMounted) { 
    return null; 
  }

  const handleLogout = () => {
    logout();
    toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
    });
    if (isMobile) setOpenMobile(false);
    router.push('/'); 
  };

  const currentNavItems = navItemsList(setIsChatbotOpen, handleLogout, language, isAuthenticated, isAdmin);

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="p-4 flex items-center justify-between">
        {isMobile && (
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <CloseIcon className="h-6 w-6" />
            </Button>
          </SheetClose>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {currentNavItems.map((item) => {
            if (item.authRequired && !isAuthenticated) return null;
            if (item.guestOnly && isAuthenticated) return null;
            if (item.adminOnly && (!isAuthenticated || !isAdmin)) return null;

            const Icon = item.icon;
            const isActive = item.href ? (pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))) : false;
            
            const displayLabel = language === 'amharic' && item.amharicLabel ? item.amharicLabel : item.label;

            if (item.action) {
              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    onClick={() => {
                      item.action!();
                      if (isMobile) setOpenMobile(false);
                    }}
                    isActive={false} 
                    tooltip={{ children: displayLabel, side: 'right', align: 'center' }}
                    className={cn("hover:bg-sidebar-accent hover:text-sidebar-accent-foreground")}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{displayLabel}</span>
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
                      tooltip={{ children: displayLabel, side: 'right', align: 'center' }}
                      className={cn(
                        isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <a>
                        <Icon className="h-5 w-5" />
                        <span>{displayLabel}</span>
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
      </SidebarFooter>
    </Sidebar>
  );
}
