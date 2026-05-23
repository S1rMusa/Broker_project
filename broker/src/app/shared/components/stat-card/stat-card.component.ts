import { Component, input } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [DecimalPipe, CurrencyPipe],
  template: `
    <div class="glass-card p-5 animate-fade-in">
      <p class="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {{ label() }}
      </p>
      <p class="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white">
        @if (isCurrency()) {
          {{ value() | currency:'KES ':'symbol':'1.0-0' }}
        } @else if (isPercent()) {
          {{ value() | number:'1.0-1' }}%
        } @else {
          {{ value() }}
        }
      </p>
      @if (change() !== undefined) {
        <p class="mt-1 text-xs" [class.text-emerald-600]="change()! >= 0" [class.text-rose-600]="change()! < 0">
          {{ change()! >= 0 ? '↑' : '↓' }} {{ change()! | number:'1.0-1' }}% vs last period
        </p>
      }
      @if (subtitle()) {
        <p class="mt-1 text-xs text-slate-500">{{ subtitle() }}</p>
      }
    </div>
  `,
})
export class StatCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly change = input<number>();
  readonly subtitle = input<string>();
  readonly isCurrency = input(false);
  readonly isPercent = input(false);
}
