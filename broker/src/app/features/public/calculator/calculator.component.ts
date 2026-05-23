import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { PublicHeaderComponent } from '../../../layout/public-header/public-header.component';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [PublicHeaderComponent, FormsModule, CurrencyPipe, DecimalPipe],
  template: `
    <app-public-header />
    <div class="mx-auto max-w-lg px-4 py-8 sm:px-6">
      <h1 class="font-display text-3xl font-bold">Loan Calculator</h1>
      <p class="mt-2 text-slate-500">Estimate monthly payments (indicative only)</p>
      <div class="glass-card mt-8 space-y-4 p-6">
        <div>
          <label class="text-sm font-medium">Loan Amount (KES)</label>
          <input type="number" class="input-field mt-1" [ngModel]="amount()" (ngModelChange)="amount.set(+$event)" min="1000" />
        </div>
        <div>
          <label class="text-sm font-medium">Interest Rate (% p.a.)</label>
          <input type="number" class="input-field mt-1" [ngModel]="rate()" (ngModelChange)="rate.set(+$event)" min="1" max="50" step="0.1" />
        </div>
        <div>
          <label class="text-sm font-medium">Term (months)</label>
          <input type="number" class="input-field mt-1" [ngModel]="term()" (ngModelChange)="term.set(+$event)" min="1" max="360" />
        </div>
        <div class="rounded-xl bg-primary-50 p-4 dark:bg-primary-900/30">
          <p class="text-sm text-slate-500">Estimated Monthly Payment</p>
          <p class="text-3xl font-bold text-primary-700 dark:text-primary-300">
            {{ monthlyPayment() | currency:'KES ':'symbol':'1.0-0' }}
          </p>
          <p class="text-xs text-slate-500 mt-2">Total repayable: {{ totalRepayable() | currency:'KES ':'symbol':'1.0-0' }}</p>
        </div>
      </div>
    </div>
  `,
})
export class CalculatorComponent {
  readonly amount = signal(500000);
  readonly rate = signal(15);
  readonly term = signal(24);

  readonly monthlyPayment = computed(() => {
    const p = this.amount();
    const r = this.rate() / 100 / 12;
    const n = this.term();
    if (r === 0) return p / n;
    return (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  });

  readonly totalRepayable = computed(() => this.monthlyPayment() * this.term());
}
