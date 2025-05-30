
'use client';

import Link from 'next/link';
import { Menu, Search, ShoppingCart, UserCircle2, LogIn, LogOut, Pill as PillIcon, Settings2 } from 'lucide-react'; // Added Settings2
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import LanguageToggle from '@/components/language-toggle';
import { SheetTrigger, Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import CartPageContent from '@/components/cart/cart-content';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context'; 
import { useCart } from '@/contexts/cart-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export default function Header() {
  const { isMobile } = useSidebar();
  const { isAuthenticated, currentUser, logout, mounted: authMounted } = useAuth(); 
  const { totalItems, mounted: cartMounted } = useCart();
  const [mounted, setMounted] = useState(false);
  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false);
  
  useEffect(() => { 
    setMounted(true); 
  }, []);

  const handleLogout = () => {
    logout();
  };

  const renderLanguageToggle = () => {
    if (!mounted) {
      // Fallback for SSR to avoid hydration mismatch with Radix components that might inject attributes
      // Render a placeholder div with the same dimensions as the Button size="icon" (h-10 w-10 => 40px)
      // This avoids rendering a Button component that might conflict with Radix attribute injection during hydration
      return <div className="h-10 w-10" aria-hidden="true" />;
    }
    return <LanguageToggle />;
  };

  const renderCartButton = () => {
    if (!mounted || !cartMounted) {
      return (
        <Button variant="ghost" size="icon" className="relative" disabled>
          <ShoppingCart className="h-5 w-5" />
          <span className="sr-only">Open Cart (loading)</span>
        </Button>
      );
    }
    return (
      <Sheet open={isCartSheetOpen} onOpenChange={setIsCartSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Open Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                {totalItems}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0 data-[state=open]:shadow-2xl">
           <SheetHeader className="p-4 border-b bg-card">
            <SheetTitle className="text-2xl flex items-center gap-2">
              <ShoppingCart className="text-primary h-6 w-6" />
              Your Shopping Cart
            </SheetTitle>
            <SheetDescription className="text-sm">
              Review items in your cart and proceed to checkout.
            </SheetDescription>
          </SheetHeader>
          <CartPageContent onCheckout={() => setIsCartSheetOpen(false)} />
        </SheetContent>
      </Sheet>
    );
  };

  const renderProfileButton = () => {
    if (!authMounted) { 
         return (
            <Button variant="ghost" size="icon" disabled>
                <UserCircle2 className="h-5 w-5" />
                <span className="sr-only">User Profile (loading)</span>
            </Button>
        );
    }

    if (isAuthenticated && currentUser) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={currentUser.avatarUrl || `https://picsum.photos/seed/${currentUser.id}/40`} alt={currentUser.name} data-ai-hint="user avatar small"/>
                <AvatarFallback>{currentUser.name.split(" ").map(n => n[0]).join("").toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {currentUser.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                <UserCircle2 className="h-4 w-4"/> Profile
              </Link>
            </DropdownMenuItem>
             {currentUser.role === 'admin' && (
              <DropdownMenuItem asChild>
                <Link href="/admin" className="flex items-center gap-2 cursor-pointer">
                  <Settings2 className="h-4 w-4"/> Admin Dashboard
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Link href="/auth/login">
        <Button variant="ghost" size="icon">
          <LogIn className="h-5 w-5" />
          <span className="sr-only">Login</span>
        </Button>
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 shadow-sm">
      {isMobile && (
        <SidebarTrigger asChild>
            <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Sidebar</span>
            </Button>
        </SidebarTrigger>
      )}
      {!isMobile && (
           <SidebarTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Sidebar</span>
                </Button>
            </SidebarTrigger>
      )}
      
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
        <PillIcon className="h-7 w-7 text-primary" />
        <span className="font-bold text-xl text-primary hidden sm:inline">EasyMeds Ethiopia</span>
      </Link>
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search medicines, products..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div>
      <div className="flex items-center gap-1 md:gap-2">
        {renderLanguageToggle()}
        {renderCartButton()}
        {renderProfileButton()}
      </div>
    </header>
  );
}
