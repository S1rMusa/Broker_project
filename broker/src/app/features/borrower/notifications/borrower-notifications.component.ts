import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MockApiService } from '../../../core/services/mock-api.service';

@Component({
  selector: 'app-borrower-notifications',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="space-y-4">
      <h2 class="font-display text-2xl font-bold">Notifications</h2>
      @for (n of mockApi.notifications(); track n.id) {
        <div
          class="glass-card p-4 cursor-pointer"
          [class.opacity-60]="n.is_read"
          (click)="markRead(n.id)"
        >
          <div class="flex justify-between">
            <p class="font-semibold">{{ n.title }}</p>
            <span class="text-xs text-slate-500">{{ n.created_at | date:'short' }}</span>
          </div>
          <p class="text-sm text-slate-500 mt-1">{{ n.message }}</p>
        </div>
      }
    </div>
  `,
})
export class BorrowerNotificationsComponent {
  readonly mockApi = inject(MockApiService);

  markRead(id: string): void {
    this.mockApi.markNotificationRead(id);
  }
}
