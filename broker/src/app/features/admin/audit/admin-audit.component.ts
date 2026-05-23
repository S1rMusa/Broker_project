import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-audit',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="space-y-6">
      <h2 class="font-display text-2xl font-bold">Audit Logs</h2>
      <div class="glass-card divide-y divide-slate-100 dark:divide-slate-800">
        @for (log of logs; track log.id) {
          <div class="flex flex-wrap gap-4 px-4 py-3 text-sm">
            <span class="text-slate-500 w-40">{{ log.created_at | date:'medium' }}</span>
            <span class="font-medium w-32">{{ log.action }}</span>
            <span class="text-slate-600 dark:text-slate-400 flex-1">{{ log.detail }}</span>
            <span class="text-xs text-slate-400">{{ log.user }}</span>
          </div>
        }
      </div>
    </div>
  `,
})
export class AdminAuditComponent {
  readonly logs = [
    { id: 1, action: 'USER_LOGIN', detail: 'borrower@broker.ke signed in', user: 'system', created_at: new Date().toISOString() },
    { id: 2, action: 'APPLICATION_SUBMIT', detail: 'Application app-002 submitted', user: 'Jane Wanjiku', created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 3, action: 'LENDER_MATCH', detail: 'Matched app-001 to Taifa Capital (87%)', user: 'matching-engine', created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: 4, action: 'COMMISSION_RECORD', detail: 'KES 45,000 commission pending', user: 'Grace Akinyi', created_at: new Date(Date.now() - 86400000).toISOString() },
  ];
}
