import { Component } from '@angular/core';

@Component({
  selector: 'app-lender-pipeline',
  standalone: true,
  template: `
    <div class="space-y-6">
      <h2 class="font-display text-2xl font-bold">Pipeline</h2>
      <div class="grid gap-4 md:grid-cols-4">
        @for (col of columns; track col.stage) {
          <div class="glass-card p-4">
            <h3 class="font-semibold text-sm uppercase text-slate-500">{{ col.stage }}</h3>
            <p class="text-2xl font-bold mt-2">{{ col.count }}</p>
            <ul class="mt-4 space-y-2">
              @for (item of col.items; track item) {
                <li class="rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800">{{ item }}</li>
              }
            </ul>
          </div>
        }
      </div>
    </div>
  `,
})
export class LenderPipelineComponent {
  readonly columns = [
    { stage: 'New', count: 8, items: ['Jane W.', 'David K.'] },
    { stage: 'Review', count: 5, items: ['James O.'] },
    { stage: 'Qualified', count: 3, items: ['Mary A.'] },
    { stage: 'Referred', count: 2, items: ['Peter M.'] },
  ];
}
