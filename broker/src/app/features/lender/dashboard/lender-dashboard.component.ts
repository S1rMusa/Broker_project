import { Component } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';

@Component({
  selector: 'app-lender-dashboard',
  standalone: true,
  imports: [StatCardComponent, DecimalPipe, CurrencyPipe],
  template: `
    <div class="space-y-6">
      <h2 class="font-display text-2xl font-bold">Incoming Applications</h2>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <app-stat-card label="New Leads" [value]="24" [change]="12" />
        <app-stat-card label="Pipeline Value" [value]="12500000" [isCurrency]="true" />
        <app-stat-card label="Conversion Rate" [value]="34.5" [isPercent]="true" [change]="2.1" />
        <app-stat-card label="Avg Compatibility" [value]="78" [isPercent]="true" />
      </div>
      <div class="glass-card overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th class="px-4 py-3 text-left">Borrower</th>
              <th class="px-4 py-3 text-left">Amount</th>
              <th class="px-4 py-3 text-left">Score</th>
              <th class="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            @for (row of leads; track row.id) {
              <tr class="border-t border-slate-100 dark:border-slate-800">
                <td class="px-4 py-3">{{ row.name }}</td>
                <td class="px-4 py-3">{{ row.amount | currency:'KES ':'symbol':'1.0-0' }}</td>
                <td class="px-4 py-3">
                  <span class="font-semibold text-primary-600">{{ row.score }}%</span>
                </td>
                <td class="px-4 py-3"><span class="rounded-full bg-amber-100 px-2 py-0.5 text-xs dark:bg-amber-900/40">{{ row.status }}</span></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class LenderDashboardComponent {
  readonly leads = [
    { id: 1, name: 'Jane Wanjiku', amount: 500000, score: 87, status: 'New' },
    { id: 2, name: 'James Otieno', amount: 250000, score: 72, status: 'Review' },
    { id: 3, name: 'Mary Akinyi', amount: 1200000, score: 91, status: 'Qualified' },
    { id: 4, name: 'David Kamau', amount: 80000, score: 65, status: 'New' },
  ];
}
