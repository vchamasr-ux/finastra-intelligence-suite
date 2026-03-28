/**
 * Re-export barrel for slide components.
 * All pure-logic helpers live in presentationHelpers.ts (single source of truth).
 * This file adds the SlideProps/KPIConfig interfaces needed by slide components.
 */
import { formatValue, getPeerSegment } from './presentationHelpers';
import type { FormatType, PeerSegment, CashFlowEntry } from './presentationHelpers';
import type { FDICBankRecord } from '../../stores/PresentationContext';

// Re-export everything slides need
export { formatValue, getPeerSegment };
export type { FormatType, PeerSegment, CashFlowEntry };

export interface KPIConfig {
    label: string;
    value: number | undefined;
    avg: number;
    min: number;
    max: number;
    format: string;
    lowerIsBetter?: boolean;
}

export interface SlideProps {
    bank: FDICBankRecord;
    product: any;
    peerData: PeerSegment;
    formatCurrencyObj: (val: number, maxFractions?: number) => string;
    kpis?: KPIConfig[];
    cashFlowData?: CashFlowEntry[];
    projectedSavings?: number;
    cumulative?: number;
    featuredCustomer?: any;
    featuredUseCase?: any;
    featuredCompetitor?: any;
    scoredCustomers?: any[];
    
    // New Value Engineering Props
    tcoData?: any[];
    detailedCashFlow?: any[];
    valueDrivers?: any[];
    roiMetrics?: { roi: number, irr: number, npv: number, paybackMonths: number };
    codMetrics?: { monthly: number, quarterly: number, annual: number };
    
    // Raw Financial Baseline Data (for interactive what-if math)
    ASSET_B?: number;
    totalLoans?: number;
    currentOpEx?: number;
    softwareCost?: number;
    servicesCost?: number;

    externalData?: { 
      cfpb: number | null, 
      itunes: number | null, 
      fedFunds: number | null, 
      popGrowth: number | null 
    };
}
