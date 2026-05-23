import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-borrower-profile',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="max-w-lg space-y-6">
      <h2 class="font-display text-2xl font-bold">Profile</h2>
      <div class="glass-card p-6 space-y-4">
        <div>
          <label class="text-sm font-medium">Full name</label>
          <input class="input-field mt-1" [(ngModel)]="fullName" />
        </div>
        <div>
          <label class="text-sm font-medium">Email</label>
          <input class="input-field mt-1" [value]="auth.user()?.email" disabled />
        </div>
        <div>
          <label class="text-sm font-medium">Phone</label>
          <input class="input-field mt-1" [(ngModel)]="phone" placeholder="+254 7XX XXX XXX" />
        </div>
        <button type="button" class="btn-primary" (click)="save()">Save changes</button>
      </div>
    </div>
  `,
})
export class BorrowerProfileComponent {
  readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  fullName = this.auth.user()?.full_name ?? '';
  phone = '';

  save(): void {
    this.toast.success('Profile updated', 'Changes saved locally in demo mode');
  }
}
