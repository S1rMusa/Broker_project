/**
 * Placeholder architecture for future Broker integrations.
 * These modules define interfaces only — implementations pending.
 */

export interface AIUnderwritingResult {
  risk_score: number;
  recommended_amount: number;
  flags: string[];
  model_version: string;
}

export interface OCRScanResult {
  document_type: string;
  extracted_fields: Record<string, string>;
  confidence: number;
}

export interface MpesaPaymentIntent {
  amount: number;
  phone_number: string;
  reference: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface LenderApiResponse {
  lender_id: string;
  external_reference: string;
  status: string;
}

export interface FraudAlert {
  severity: 'low' | 'medium' | 'high';
  reason: string;
  entity_id: string;
}

export interface CRBReport {
  status: 'clear' | 'mild' | 'moderate' | 'severe';
  score: number;
  last_checked: string;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FutureIntegrations {
  export const AI_UNDERWRITING = 'ai-underwriting/v1';
  export const OCR_SCANNING = 'ocr/v1';
  export const MPESA = 'mpesa/stk-push';
  export const LENDER_API = 'lender-api/v1';
  export const FRAUD_DETECTION = 'fraud/v1';
  export const CRB = 'crb/metropol';
}
