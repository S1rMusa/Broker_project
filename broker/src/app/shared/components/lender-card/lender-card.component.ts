import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Lender } from '../../../core/models';

@Component({
  selector: 'app-lender-card',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  template: `
    <a
      [routerLink]="['/lenders', lender().slug]"
      class="glass-card group block p-5 transition-all hover:-translate-y-1 hover:shadow-2xl"
    >
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-3">
          <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-2xl dark:bg-primary-900/40">
            {{ lender().logo }}
          </span>
          <div>
            <h3 class="font-semibold text-slate-900 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
              {{ lender().name }}
            </h3>
            <p class="text-xs text-slate-500 line-clamp-1">{{ lender().target_customer }}</p>
          </div>
        </div>
        @if (lender().trend_direction === 'down') {
          <span class="badge-down">↓ {{ lender().trend_percentage }}%</span>
        } @else if (lender().trend_direction === 'up') {
          <span class="badge-down">↑ {{ lender().trend_percentage }}%</span>
        } @else {
          <span class="text-xs text-slate-400">Stable</span>
        }
      </div>
      <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p class="text-xs text-slate-500">Interest</p>
          <p class="font-semibold">{{ lender().minimum_interest_rate }}–{{ lender().maximum_interest_rate }}%</p>
        </div>
        <div>
          <p class="text-xs text-slate-500">Acceptance</p>
          <p class="font-semibold">{{ lender().acceptance_rate | number:'1.0-0' }}%</p>
        </div>
      </div>
      <p class="mt-3 text-xs text-slate-500">{{ lender().processing_time }} · {{ lender().active_offers }} offers</p>
    </a>
  `,
})
export class LenderCardComponent {
  readonly lender = input.required<Lender>();
}
