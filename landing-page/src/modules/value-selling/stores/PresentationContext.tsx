import { createContext, useContext, useState, type ReactNode } from 'react';
import type { FinastraProduct } from '../data/FinastraData';

// We import the record type from our hook
export interface FDICBankRecord {
  ID: string;
  NAME: string;
  CERT: string;
  ASSET: number;
  DEP: number;
  ROE: number;
  ROA: number;
  STNAME: string;
  STALP?: string;
  CITY: string;
  EEFFR?: number;
  NIMY?: number;
  NETLNLS?: number;
  LNLSNET?: number;
  NONII?: number;
  NONIX?: number;
  YLDLN?: number;
  NTLNLS?: number;
  LNCI?: number;
  LNRE?: number;
  ASSET5Y_GROWTH?: number;
  DEP5Y_GROWTH?: number;
  NONIX5Y_GROWTH?: number;
}

export interface PresentationState {
  selectedBank: FDICBankRecord | null;
  selectedProduct: FinastraProduct | null;
  setBank: (b: FDICBankRecord) => void;
  setProduct: (p: FinastraProduct) => void;
}

const PresentationContext = createContext<PresentationState | undefined>(undefined);

export const PresentationProvider = ({ children }: { children: ReactNode }) => {
  const [selectedBank, setBank] = useState<FDICBankRecord | null>(null);
  const [selectedProduct, setProduct] = useState<FinastraProduct | null>(null);

  return (
    <PresentationContext.Provider value={{ selectedBank, selectedProduct, setBank, setProduct }}>
      {children}
    </PresentationContext.Provider>
  );
};

export const usePresentationStore = () => {
  const context = useContext(PresentationContext);
  if (!context) {
    // Fail loudly if context is missing
    throw new Error("usePresentationStore must be used within a PresentationProvider");
  }
  return context;
};
