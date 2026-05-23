import { Component } from '@angular/core';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [StatCardComponent],
  template: `
    <div class="space-y-6">
      <h2 class="font-display text-2xl font-bold">Platform Overview</h2>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <app-stat-card label="Total Borrowers" [value]="2847" [change]="8.2" />
        <app-stat-card label="Active Lenders" [value]="16" />
        <app-stat-card label="Applications (30d)" [value]="1243" [change]="15" />
        <app-stat-card label="Commission (MTD)" [value]="2400000" [isCurrency]="true" [change]="12" />
      </div>
      <div class="grid gap-4 lg:grid-cols-2">
        <div class="glass-card p-6">
          <h3 class="font-semibold mb-4">Fraud Alerts</h3>
          @for (alert of fraudAlerts; track alert.id) {
            <div class="flex justify-between border-b border-slate-100 py-3 last:border-0 dark:border-slate-800">
              <span>{{ alert.reason }}</span>
              <span class="text-xs rounded-full px-2 py-0.5"
                [class.bg-rose-100]="alert.severity === 'high'"
                [class.bg-amber-100]="alert.severity === 'medium'">{{ alert.severity }}</span>
            </div>
          }
        </div>
        <div class="glass-card p-6">
          <h3 class="font-semibold mb-4">Recent Activity</h3>
          @for (act of activity; track act) {
            <p class="text-sm py-2 border-b border-slate-100 dark:border-slate-800">{{ act }}</p>
          }
        </div>
      </div>
    </div>
  `,
})
export class AdminDashboardComponent {
  readonly fraudAlerts = [
    { id: 1, reason: 'Duplicate ID submission', severity: 'high' },
    { id: 2, reason: 'Income mismatch vs CRB', severity: 'medium' },
    { id: 3, reason: 'Velocity check — 3 apps/24h', severity: 'medium' },
  ];
  readonly activity = [
    'New lender registered: Heritage Trust Finance',
    'Commission confirmed: KES 45,000 — Taifa Capital',
    'Borrower application #app-002 under review',
    'Market rate updated for 8 lenders',
  ];
}
