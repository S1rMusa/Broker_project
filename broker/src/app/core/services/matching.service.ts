import { Injectable } from '@angular/core';
import { MOCK_LENDERS } from '../constants/mock-lenders';
import {
  BorrowerProfile,
  CrbStatus,
  EmploymentType,
  Lender,
  LenderMatch,
  MatchResult,
  RiskLevel,
} from '../models';

@Injectable({ providedIn: 'root' })
export class MatchingService {
  calculateMatch(profile: BorrowerProfile, lenders: Lender[] = MOCK_LENDERS): MatchResult {
    const affordability = this.calculateAffordability(profile);
    const matches = lenders
      .map((lender) => ({
        lender,
        compatibility_score: this.scoreCompatibility(profile, lender, affordability),
        approval_likelihood: this.scoreApprovalLikelihood(profile, lender, affordability),
        rank_position: 0,
      }))
      .filter((m) => m.compatibility_score >= 40)
      .sort((a, b) => b.compatibility_score - a.compatibility_score)
      .slice(0, 5)
      .map((m, i) => ({ ...m, rank_position: i + 1 }));

    const avgCompatibility =
      matches.length > 0
        ? matches.reduce((s, m) => s + m.compatibility_score, 0) / matches.length
        : 0;
    const avgApproval =
      matches.length > 0
        ? matches.reduce((s, m) => s + m.approval_likelihood, 0) / matches.length
        : 0;

    return {
      compatibility_score: Math.round(avgCompatibility),
      approval_likelihood: Math.round(avgApproval),
      affordability_score: Math.round(affordability),
      top_lenders: matches,
    };
  }

  private calculateAffordability(profile: BorrowerProfile): number {
    const disposable = profile.monthly_income - profile.monthly_expenses;
    if (disposable <= 0) return 10;
    const monthlyPayment = profile.requested_amount / 24;
    const ratio = monthlyPayment / disposable;
    if (ratio <= 0.2) return 95;
    if (ratio <= 0.35) return 80;
    if (ratio <= 0.5) return 60;
    if (ratio <= 0.7) return 35;
    return 15;
  }

  private scoreCompatibility(
    profile: BorrowerProfile,
    lender: Lender,
    affordability: number
  ): number {
    let score = 0;

    if (
      profile.requested_amount >= lender.minimum_loan_amount &&
      profile.requested_amount <= lender.maximum_loan_amount
    ) {
      score += 30;
    } else if (profile.requested_amount < lender.minimum_loan_amount) {
      score += 10;
    } else {
      score += 5;
    }

    score += affordability * 0.25;

    const debtScore = profile.debt_ratio <= 30 ? 20 : profile.debt_ratio <= 50 ? 12 : 5;
    score += debtScore;

    score += this.employmentScore(profile.employment_type, lender.risk_level);
    score += this.crbScore(profile.crb_status);
    score += this.stabilityScore(profile.business_stability_months, profile.employment_type);

    return Math.min(100, Math.round(score));
  }

  private scoreApprovalLikelihood(
    profile: BorrowerProfile,
    lender: Lender,
    affordability: number
  ): number {
    const base = lender.acceptance_rate * 0.4;
    const affordabilityFactor = affordability * 0.35;
    const crbFactor = this.crbScore(profile.crb_status) * 0.5;
    const debtFactor = profile.debt_ratio <= 40 ? 15 : profile.debt_ratio <= 60 ? 8 : 0;
    return Math.min(99, Math.round(base + affordabilityFactor + crbFactor + debtFactor));
  }

  private employmentScore(employment: EmploymentType, risk: RiskLevel): number {
    const matrix: Record<EmploymentType, Record<RiskLevel, number>> = {
      employed: { low: 18, medium: 15, high: 10 },
      self_employed: { low: 12, medium: 14, high: 12 },
      business_owner: { low: 14, medium: 16, high: 14 },
      contract: { low: 10, medium: 12, high: 8 },
      unemployed: { low: 2, medium: 2, high: 4 },
    };
    return matrix[employment][risk];
  }

  private crbScore(status: CrbStatus): number {
    const scores: Record<CrbStatus, number> = {
      clear: 15,
      mild: 10,
      moderate: 5,
      severe: 0,
      unknown: 7,
    };
    return scores[status];
  }

  private stabilityScore(months: number, employment: EmploymentType): number {
    if (employment === 'employed' || employment === 'contract') return 10;
    if (months >= 24) return 12;
    if (months >= 12) return 8;
    if (months >= 6) return 4;
    return 2;
  }
}
