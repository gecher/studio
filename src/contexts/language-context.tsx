
'use client';

import type { Dispatch, ReactNode, SetStateAction} from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'english' | 'amharic';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  mounted: boolean; 
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const APP_LANGUAGE_KEY = 'appLanguage';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('english'); // Default to English
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedLanguage = localStorage.getItem(APP_LANGUAGE_KEY) as Language | null;
    if (storedLanguage && (storedLanguage === 'english' || storedLanguage === 'amharic')) {
      setLanguageState(storedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (mounted) { 
        localStorage.setItem(APP_LANGUAGE_KEY, lang);
    }
  };
  
  const contextValue = { language, setLanguage, mounted };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
