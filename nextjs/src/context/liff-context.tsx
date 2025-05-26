'use client';

import { createContext, useEffect, useState, ReactNode } from 'react';
import { initializeLiff } from '@/lib/liff';

interface LiffContextType {
  isLiffInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
}

export const LiffContext = createContext<LiffContextType>({
  isLiffInitialized: false,
  isLoading: true,
  error: null,
});

export const LiffProvider = ({ children }: { children: ReactNode }) => {
  const [isLiffInitialized, setIsLiffInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const initialized = await initializeLiff();
        setIsLiffInitialized(initialized);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize LIFF'));
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  return (
    <LiffContext.Provider value={{ isLiffInitialized, isLoading, error }}>
      {children}
    </LiffContext.Provider>
  );
}; 