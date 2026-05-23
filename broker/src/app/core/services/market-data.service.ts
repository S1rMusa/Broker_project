import { Injectable, OnDestroy, signal } from '@angular/core';
import { MOCK_LENDERS } from '../constants/mock-lenders';
import { MarketSnapshot, TrendDirection } from '../models';

@Injectable({ providedIn: 'root' })
export class MarketDataService implements OnDestroy {
  private intervalId?: ReturnType<typeof setInterval>;
  private readonly _snapshot = signal<MarketSnapshot>(this.generateSnapshot());
  readonly snapshot = this._snapshot.asReadonly();

  constructor() {
    this.startLiveUpdates();
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  startLiveUpdates(intervalMs = 4000): void {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      this._snapshot.set(this.generateSnapshot());
    }, intervalMs);
  }

  private generateSnapshot(): MarketSnapshot {
    const topLenders = MOCK_LENDERS.slice(0, 8);
    const rates = topLenders.map((l) => {
      const base = (l.minimum_interest_rate + l.maximum_interest_rate) / 2;
      const jitter = (Math.random() - 0.5) * 0.8;
      const rate = Math.round((base + jitter) * 100) / 100;
      const previous = rate + (Math.random() > 0.5 ? 0.15 : -0.15);
      const trend: TrendDirection =
        rate < previous ? 'down' : rate > previous ? 'up' : 'stable';
      return {
        label: l.name.split(' ')[0],
        rate,
        previous_rate: Math.round(previous * 100) / 100,
        trend,
      };
    });

    return {
      rates,
      approval_speed_avg: Math.round(2 + Math.random() * 4),
      trending_offers: [
        { lender: 'SwiftPesa Credit', offer: 'Same-day KES 50K', rate: 18.5 },
        { lender: 'Mwangaza Finance', offer: 'Salaried quick loan', rate: 14.2 },
        { lender: 'Kazi Yetu Lending', offer: 'Payroll deduction', rate: 11.5 },
        { lender: 'MobiCash Africa', offer: 'M-Pesa instant', rate: 22.0 },
      ],
      lender_rankings: MOCK_LENDERS.slice(0, 6)
        .map((l) => ({
          name: l.name,
          score: Math.round(l.acceptance_rate + Math.random() * 5),
          change: Math.round((Math.random() - 0.5) * 6),
        }))
        .sort((a, b) => b.score - a.score),
    };
  }
}
