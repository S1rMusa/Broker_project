import { Component } from '@angular/core';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';

@Component({
  selector: 'app-lender-analytics',
  standalone: true,
  imports: [StatCardComponent],
  template: `
    <div class="space-y-6">
      <h2 class="font-display text-2xl font-bold">Lead Analytics</h2>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <app-stat-card label="Leads This Month" [value]="156" [change]="18" />
        <app-stat-card label="Referrals Sent" [value]="89" [change]="5" />
        <app-stat-card label="Closed Deals" [value]="31" [change]="-2" />
        <app-stat-card label="Avg Days to Close" [value]="4.2" />
        <app-stat-card label="Commission Earned" [value]="485000" [isCurrency]="true" />
        <app-stat-card label="Rejection Rate" [value]="22" [isPercent]="true" />
      </div>
      <div class="glass-card p-6">
        <h3 class="font-semibold mb-4">Conversion Funnel</h3>
        <div class="space-y-3">
          @for (step of funnel; track step.label) {
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span>{{ step.label }}</span>
                <span>{{ step.value }}%</span>
              </div>
              <div class="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                <div class="h-2 rounded-full bg-primary-600" [style.width.%]="step.value"></div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class LenderAnalyticsComponent {
  readonly funnel = [
    { label: 'Applications Received', value: 100 },
    { label: 'Qualified Leads', value: 68 },
    { label: 'Sent to Underwriting', value: 45 },
    { label: 'Approved Externally', value: 31 },
  ];
}
