
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
  LifeBuoy, // Example for a support/help icon
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
import { Pill } from 'lucide-react'; // For logo
import { Separator } from '../ui/separator';

interface NavItem {
  href?: string;
  label: string;
  amharicLabel?: string; 
  icon: LucideIcon;
  adminOnly?: boolean;
  authRequired?: boolean; 
  guestOnly?: boolean; 
  action?: () => void;
  isFooter?: boolean; // To identify footer items
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
  
  // Conditional Auth Links
  { href: '/auth/login', label: 'Login', amharicLabel: 'ግባ', icon: LogIn, guestOnly: true, isFooter: true },
  
  // Admin Link
  ...(isAdmin && isAuthenticated ? [{ href: '/admin', label: 'Admin Dashboard', amharicLabel: 'የአስተዳዳሪ ዳሽቦርድ', icon: Settings2, adminOnly: true, authRequired: true }] : []),

  // Footer items
  { 
    label: 'Support Chatbot', 
    amharicLabel: 'የድጋፍ ቻትቦት',
    icon: MessageCircle, 
    action: () => setIsChatbotOpen(true),
    isFooter: true,
  },
  { label: 'Logout', amharicLabel: 'ውጣ', icon: LogOut, authRequired: true, action: handleLogout, isFooter: true },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter(); 
  const { openMobile, setOpenMobile, isMobile, state } = useSidebar();
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
  const mainNavItems = currentNavItems.filter(item => !item.isFooter);
  const footerNavItems = currentNavItems.filter(item => item.isFooter);


  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="p-3 flex items-center justify-between border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold" onClick={() => isMobile && setOpenMobile(false)}>
          <Pill className="h-7 w-7 text-primary" />
          {state === 'expanded' && <span className="font-bold text-xl text-sidebar-foreground">EasyMeds</span>}
        </Link>
        {isMobile && (
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <CloseIcon className="h-6 w-6" />
            </Button>
          </SheetClose>
        )}
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {mainNavItems.map((item) => {
            if (item.authRequired && !isAuthenticated) return null;
            if (item.guestOnly && isAuthenticated) return null;
            if (item.adminOnly && (!isAuthenticated || !isAdmin)) return null;

            const Icon = item.icon;
            const isActive = item.href ? (pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))) : false;
            
            const displayLabel = language === 'amharic' && item.amharicLabel ? item.amharicLabel : item.label;

            if (item.action) {
              return (
                <SidebarMenuItem key={item.label} className="my-0.5">
                  <SidebarMenuButton
                    onClick={() => {
                      item.action!();
                      if (isMobile) setOpenMobile(false);
                    }}
                    isActive={false} 
                    tooltip={{ children: displayLabel, side: 'right', align: 'center' }}
                    className={cn("hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm py-2.5 px-3 rounded-md")}
                    size="default"
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span>{displayLabel}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            } else if (item.href) {
              return (
                <SidebarMenuItem key={item.label} className="my-0.5">
                  <Link href={item.href} passHref legacyBehavior>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      onClick={() => isMobile && setOpenMobile(false)}
                      tooltip={{ children: displayLabel, side: 'right', align: 'center' }}
                       className={cn(
                        "text-sm py-2.5 px-3 rounded-md",
                        isActive ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                      size="default"
                    >
                      <a>
                        <Icon className="h-5 w-5 mr-3" />
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
      <SidebarFooter className="p-2 border-t border-sidebar-border">
        <SidebarMenu>
           {footerNavItems.map((item) => {
            if (item.authRequired && !isAuthenticated) return null;
            if (item.guestOnly && isAuthenticated) return null;

            const Icon = item.icon;
            const displayLabel = language === 'amharic' && item.amharicLabel ? item.amharicLabel : item.label;

            if (item.action) {
              return (
                <SidebarMenuItem key={item.label} className="my-0.5">
                  <SidebarMenuButton
                    onClick={() => {
                      item.action!();
                      if (isMobile) setOpenMobile(false);
                    }}
                    isActive={false} 
                    tooltip={{ children: displayLabel, side: 'right', align: 'center' }}
                    className={cn("hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm py-2.5 px-3 rounded-md")}
                    size="default"
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span>{displayLabel}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            } else if (item.href) {
              return (
                <SidebarMenuItem key={item.label} className="my-0.5">
                  <Link href={item.href} passHref legacyBehavior>
                    <SidebarMenuButton
                      asChild
                      onClick={() => isMobile && setOpenMobile(false)}
                      tooltip={{ children: displayLabel, side: 'right', align: 'center' }}
                       className={cn(
                        "text-sm py-2.5 px-3 rounded-md",
                         "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                      size="default"
                    >
                      <a>
                        <Icon className="h-5 w-5 mr-3" />
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
         {state === 'expanded' && (
          <div className="text-center text-xs text-sidebar-foreground/60 mt-4 px-2">
            &copy; {new Date().getFullYear()} EasyMeds Ethiopia
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

