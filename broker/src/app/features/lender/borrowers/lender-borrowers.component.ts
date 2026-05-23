import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-lender-borrowers',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  template: `
    <div class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <h2 class="font-display text-2xl font-bold">Borrowers</h2>
        <input type="search" class="input-field max-w-xs" placeholder="Filter borrowers..."
          [ngModel]="search()" (ngModelChange)="search.set($event)" />
      </div>
      <div class="grid gap-4">
        @for (b of filtered(); track b.id) {
          <div class="glass-card flex flex-wrap items-center justify-between gap-4 p-4">
            <div>
              <p class="font-semibold">{{ b.name }}</p>
              <p class="text-sm text-slate-500">{{ b.employment }} · CRB: {{ b.crb }}</p>
            </div>
            <div class="text-right">
              <p class="font-bold">{{ b.amount | currency:'KES ':'symbol':'1.0-0' }}</p>
              <p class="text-sm text-primary-600">{{ b.score }}% match</p>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class LenderBorrowersComponent {
  readonly search = signal('');
  private readonly borrowers = [
    { id: 1, name: 'Jane Wanjiku', employment: 'Business owner', crb: 'Clear', amount: 500000, score: 87 },
    { id: 2, name: 'James Otieno', employment: 'Employed', crb: 'Mild', amount: 250000, score: 72 },
    { id: 3, name: 'Mary Akinyi', employment: 'SME', crb: 'Clear', amount: 1200000, score: 91 },
  ];

  filtered() {
    const q = this.search().toLowerCase();
    if (!q) return this.borrowers;
    return this.borrowers.filter((b) => b.name.toLowerCase().includes(q));
  }
}
