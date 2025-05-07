
'use client';

import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/language-context';

export default function LanguageToggle() {
  const { language, setLanguage, mounted } = useLanguage();

  if (!mounted) {
    // Render a placeholder to avoid hydration mismatch, ensuring consistent server and initial client render
    return <div className="h-10 w-10" aria-hidden="true" />;
  }
  
  const displayLanguage = language === 'english' ? 'EN' : 'አማ';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Current language: ${displayLanguage}. Change language`}>
          <Languages className="h-5 w-5" />
          <span className="sr-only">Change language ({displayLanguage})</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage('english')} disabled={language === 'english'}>
          English (EN)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('amharic')} disabled={language === 'amharic'}>
          አማርኛ (AM)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
