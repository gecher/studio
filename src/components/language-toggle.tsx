
'use client';

import { useState, useEffect } from 'react';
import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function LanguageToggle() {
  const [mounted, setMounted] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('EN'); // Default to English

  useEffect(() => {
    setMounted(true);
    // Here you would typically load the saved language preference
    // For now, it defaults to EN
  }, []);

  const setLanguage = (lang: 'EN' | 'AM') => {
    setCurrentLanguage(lang);
    // Here you would typically save the preference and update i18n context
    console.log(`Language changed to ${lang}`);
  };

  if (!mounted) {
    // Return null to ensure server and initial client renders match (render nothing)
    // The component will "pop in" on the client after mount.
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Current language: ${currentLanguage}. Change language`}>
          <Languages className="h-5 w-5" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage('EN')} disabled={currentLanguage === 'EN'}>
          English (EN)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('AM')} disabled={currentLanguage === 'AM'}>
          አማርኛ (AM)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

