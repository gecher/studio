import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';
import Header from '@/components/layout/header';
import SidebarNav from '@/components/layout/sidebar-nav';
import ChatbotWidget from '@/components/layout/chatbot-widget';
import { ChatbotProvider } from '@/contexts/chatbot-context';
import { LanguageProvider } from '@/contexts/language-context';
import { AuthProvider } from '@/contexts/auth-context';
import { CartProvider } from '@/contexts/cart-context'; // Import CartProvider

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'EasyMeds Ethiopia',
  description: 'Your trusted e-pharmacy platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <LanguageProvider>
            <ChatbotProvider>
              <CartProvider> {/* Add CartProvider here */}
                <SidebarProvider defaultOpen={true}>
                  <div className="flex">
                    <SidebarNav />
                    <div className="flex flex-col flex-1 min-h-screen">
                      <Header />
                      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background">
                        {children}
                      </main>
                    </div>
                  </div>
                  <ChatbotWidget />
                </SidebarProvider>
              </CartProvider>
            </ChatbotProvider>
          </LanguageProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
