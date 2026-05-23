import { Component, inject } from '@angular/core';
import { LenderService } from '../../../core/services/lender.service';

@Component({
  selector: 'app-admin-lenders',
  standalone: true,
  template: `
    <div class="space-y-6">
      <h2 class="font-display text-2xl font-bold">Lender Management</h2>
      <div class="glass-card overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th class="px-4 py-3 text-left">Lender</th>
              <th class="px-4 py-3 text-left">Rate Range</th>
              <th class="px-4 py-3 text-left">Acceptance</th>
              <th class="px-4 py-3 text-left">Risk</th>
              <th class="px-4 py-3 text-left">Offers</th>
            </tr>
          </thead>
          <tbody>
            @for (l of lenderService.getAll(); track l.id) {
              <tr class="border-t border-slate-100 dark:border-slate-800">
                <td class="px-4 py-3 font-medium">{{ l.logo }} {{ l.name }}</td>
                <td class="px-4 py-3">{{ l.minimum_interest_rate }}–{{ l.maximum_interest_rate }}%</td>
                <td class="px-4 py-3">{{ l.acceptance_rate }}%</td>
                <td class="px-4 py-3 capitalize">{{ l.risk_level }}</td>
                <td class="px-4 py-3">{{ l.active_offers }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class AdminLendersComponent {
  readonly lenderService = inject(LenderService);
}
