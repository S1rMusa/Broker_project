import { Injectable, signal } from '@angular/core';
import { MOCK_LENDERS } from '../constants/mock-lenders';
import { Lender, RiskLevel } from '../models';

export interface LenderFilters {
  search?: string;
  minRate?: number;
  maxRate?: number;
  riskLevel?: RiskLevel;
  minAmount?: number;
}

@Injectable({ providedIn: 'root' })
export class LenderService {
  private readonly _lenders = signal<Lender[]>(MOCK_LENDERS);
  readonly lenders = this._lenders.asReadonly();

  getAll(): Lender[] {
    return this._lenders();
  }

  getBySlug(slug: string): Lender | undefined {
    return this._lenders().find((l) => l.slug === slug);
  }

  getById(id: string): Lender | undefined {
    return this._lenders().find((l) => l.id === id);
  }

  filter(filters: LenderFilters): Lender[] {
    return this._lenders().filter((l) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !l.name.toLowerCase().includes(q) &&
          !l.description.toLowerCase().includes(q) &&
          !l.target_customer.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (filters.riskLevel && l.risk_level !== filters.riskLevel) return false;
      if (filters.minRate && l.maximum_interest_rate < filters.minRate) return false;
      if (filters.maxRate && l.minimum_interest_rate > filters.maxRate) return false;
      if (filters.minAmount && l.maximum_loan_amount < filters.minAmount) return false;
      return true;
    });
  }

  paginate<T>(items: T[], page: number, pageSize: number): { items: T[]; total: number; pages: number } {
    const total = items.length;
    const pages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    return { items: items.slice(start, start + pageSize), total, pages };
  }
}
