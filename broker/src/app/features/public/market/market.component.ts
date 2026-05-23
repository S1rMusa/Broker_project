import { Component, inject } from '@angular/core';
import { PublicHeaderComponent } from '../../../layout/public-header/public-header.component';
import { MarketChartComponent } from '../../../shared/components/market-chart/market-chart.component';
import { MarketDataService } from '../../../core/services/market-data.service';

@Component({
  selector: 'app-market',
  standalone: true,
  imports: [PublicHeaderComponent, MarketChartComponent],
  template: `
    <app-public-header />
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 class="font-display text-3xl font-bold">Market Trends</h1>
      <p class="mt-2 text-slate-500">Live rate movements across Kenyan lenders</p>
      <div class="glass-card mt-8 p-6">
        <app-market-chart />
      </div>
      <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        @for (r of market.snapshot().rates; track r.label) {
          <div class="glass-card p-4 flex justify-between items-center">
            <span class="font-medium">{{ r.label }}</span>
            <div class="text-right">
              <p class="text-xl font-bold">{{ r.rate }}%</p>
              @if (r.trend === 'down') {
                <span class="badge-up">↓ from {{ r.previous_rate }}%</span>
              } @else if (r.trend === 'up') {
                <span class="badge-down">↑ from {{ r.previous_rate }}%</span>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class MarketComponent {
  readonly market = inject(MarketDataService);
}
