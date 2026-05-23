import { Component } from '@angular/core';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { MarketChartComponent } from '../../../shared/components/market-chart/market-chart.component';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [StatCardComponent, MarketChartComponent],
  template: `
    <div class="space-y-6">
      <h2 class="font-display text-2xl font-bold">Platform Analytics</h2>
      <div class="grid gap-4 sm:grid-cols-3">
        <app-stat-card label="Match Success Rate" [value]="74.2" [isPercent]="true" />
        <app-stat-card label="Avg Referral Commission" [value]="38500" [isCurrency]="true" />
        <app-stat-card label="Platform GMV Referrals" [value]="890000000" [isCurrency]="true" />
      </div>
      <div class="glass-card p-5">
        <h3 class="font-semibold mb-4">Market Rate Trends</h3>
        <app-market-chart />
      </div>
    </div>
  `,
})
export class AdminAnalyticsComponent {}
