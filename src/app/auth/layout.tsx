
import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-background p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
