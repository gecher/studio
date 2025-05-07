'use client';

import Link from 'next/link';
import { Menu, Search, ShoppingCart, UserCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import LanguageToggle from '@/components/language-toggle';
import { SheetTrigger, Sheet, SheetContent } from '@/components/ui/sheet';
import CartPageContent from '@/components/cart/cart-content';
import { useState, useEffect } from 'react';

export default function Header() {
  const { isMobile } = useSidebar();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 shadow-sm">
      <SidebarTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </SidebarTrigger>
      
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
        <PillIcon className="h-7 w-7 text-primary" />
        <span className="font-bold text-xl text-primary">EasyMeds Ethiopia</span>
      </Link>
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search medicines, products..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <LanguageToggle />
        {mounted ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Open Cart</span>
                {/* Optional: Add a badge for item count */}
                {/* <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">3</span> */}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md">
              <CartPageContent />
            </SheetContent>
          </Sheet>
        ) : (
          <Button variant="ghost" size="icon" className="relative" disabled>
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Open Cart</span>
          </Button>
        )}
        <Link href="/login">
          <Button variant="ghost" size="icon">
            <UserCircle2 className="h-5 w-5" />
            <span className="sr-only">User Profile</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}

// Custom PillIcon as it's not directly in lucide-react with this exact style often used for pharmacy
function PillIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <path d="m8.5 8.5 7 7" />
    </svg>
  );
}