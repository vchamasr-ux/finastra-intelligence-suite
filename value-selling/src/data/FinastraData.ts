// @ts-ignore
import rawData from '../../../finastra_data.json';

export interface FinastraProduct {
  "Product/solution": string;
  "Concise description": string;
  "Target segments": string;
  "Primary use cases": string;
  "Key features/benefits": string;
  "Deployment options": string;
  "Pricing model (public)": string;
  "Integrations/APIs": string;
  "Known limitations / risks": string;
  "Primary sources": string;
}

export interface FinastraCustomer {
  "Customer": string;
  "Industry": string;
  "Problem/context": string;
  "Finastra solution(s) implemented": string;
  "Measurable outcomes (as published)": string;
  "Primary sources": string;
}

export interface FinastraUseCase {
  "Priority use case": string;
  "Best-fit products/modules": string;
  "Primary buyer personas": string;
  "Typical pains": string;
  "ROI drivers and measurable outcomes": string;
  "Proof anchors": string;
}

export const finastraData = rawData as {
  products: FinastraProduct[];
  customers: FinastraCustomer[];
  useCases: FinastraUseCase[];
};
