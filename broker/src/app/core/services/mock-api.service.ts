import { Injectable, signal } from '@angular/core';
import {
  ApplicationStatus,
  BorrowerApplication,
  Notification,
} from '../models';

@Injectable({ providedIn: 'root' })
export class MockApiService {
  private readonly _applications = signal<BorrowerApplication[]>([
    {
      id: 'app-001', borrower_id: 'usr-borrower-1', requested_amount: 500000,
      loan_purpose: 'Business expansion', employment_type: 'business_owner',
      monthly_income: 120000, monthly_expenses: 45000, debt_ratio: 28,
      crb_status: 'clear', business_stability_months: 18,
      affordability_score: 82, approval_probability: 71,
      status: 'matched', submitted_at: '2026-05-15T10:00:00Z',
      created_at: '2026-05-14T08:00:00Z',
    },
    {
      id: 'app-002', borrower_id: 'usr-borrower-1', requested_amount: 150000,
      loan_purpose: 'Equipment purchase', employment_type: 'employed',
      monthly_income: 85000, monthly_expenses: 35000, debt_ratio: 35,
      crb_status: 'mild', business_stability_months: 0,
      affordability_score: 68, approval_probability: 58,
      status: 'under_review', submitted_at: '2026-05-20T14:00:00Z',
      created_at: '2026-05-19T09:00:00Z',
    },
  ]);

  private readonly _notifications = signal<Notification[]>([
    {
      id: 'n-1', title: 'New lender match',
      message: 'Taifa Capital matched your application at 87% compatibility.',
      type: 'success', is_read: false, created_at: new Date().toISOString(),
    },
    {
      id: 'n-2', title: 'Document verified',
      message: 'Your bank statement has been verified successfully.',
      type: 'info', is_read: true, created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);

  readonly applications = this._applications.asReadonly();
  readonly notifications = this._notifications.asReadonly();

  getApplicationsForBorrower(borrowerId: string): BorrowerApplication[] {
    return this._applications().filter((a) => a.borrower_id === borrowerId);
  }

  getUnreadCount(): number {
    return this._notifications().filter((n) => !n.is_read).length;
  }

  markNotificationRead(id: string): void {
    this._notifications.update((list) =>
      list.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  }
}
