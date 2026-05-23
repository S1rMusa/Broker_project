export type UserRole = 'borrower' | 'lender_admin' | 'super_admin';
export type ApplicationStatus =
  | 'draft' | 'submitted' | 'under_review' | 'matched' | 'sent_to_lender'
  | 'approved' | 'rejected' | 'withdrawn';
export type EmploymentType =
  | 'employed' | 'self_employed' | 'business_owner' | 'contract' | 'unemployed';
export type CrbStatus = 'clear' | 'mild' | 'moderate' | 'severe' | 'unknown';
export type TrendDirection = 'up' | 'down' | 'stable';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  phone_number?: string;
  avatar_url?: string;
  role: UserRole;
  lender_id?: string;
  is_active: boolean;
  created_at: string;
}

export interface Lender {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  minimum_interest_rate: number;
  maximum_interest_rate: number;
  minimum_loan_amount: number;
  maximum_loan_amount: number;
  processing_time: string;
  acceptance_rate: number;
  target_customer: string;
  risk_level: RiskLevel;
  trend_direction: TrendDirection;
  trend_percentage: number;
  active_offers: number;
  contact_email: string;
  phone_number: string;
  physical_address: string;
}

export interface BorrowerApplication {
  id: string;
  borrower_id: string;
  requested_amount: number;
  loan_purpose?: string;
  employment_type?: EmploymentType;
  monthly_income?: number;
  monthly_expenses?: number;
  debt_ratio?: number;
  crb_status?: CrbStatus;
  business_stability_months?: number;
  affordability_score?: number;
  approval_probability?: number;
  status: ApplicationStatus;
  notes?: string;
  submitted_at?: string;
  created_at: string;
}

export interface LenderMatch {
  lender: Lender;
  compatibility_score: number;
  approval_likelihood: number;
  rank_position: number;
}

export interface MatchResult {
  compatibility_score: number;
  approval_likelihood: number;
  affordability_score: number;
  top_lenders: LenderMatch[];
}

export interface BorrowerProfile {
  monthly_income: number;
  monthly_expenses: number;
  employment_type: EmploymentType;
  requested_amount: number;
  debt_ratio: number;
  crb_status: CrbStatus;
  business_stability_months: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  link?: string;
  created_at: string;
}

export interface MarketRatePoint {
  label: string;
  rate: number;
  previous_rate: number;
  trend: TrendDirection;
}

export interface MarketSnapshot {
  rates: MarketRatePoint[];
  approval_speed_avg: number;
  trending_offers: { lender: string; offer: string; rate: number }[];
  lender_rankings: { name: string; score: number; change: number }[];
}
