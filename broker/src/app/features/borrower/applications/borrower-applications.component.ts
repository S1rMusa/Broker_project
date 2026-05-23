import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { MockApiService } from '../../../core/services/mock-api.service';
import { MatchingService } from '../../../core/services/matching.service';
import { ToastService } from '../../../core/services/toast.service';
import { EmploymentType, CrbStatus } from '../../../core/models';

@Component({
  selector: 'app-borrower-applications',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, DatePipe],
  template: `
    <div class="space-y-6">
      <h2 class="font-display text-2xl font-bold">Applications</h2>

      <div class="glass-card p-6">
        <h3 class="font-semibold mb-4">New Application</h3>
        <form class="grid gap-4 sm:grid-cols-2" (ngSubmit)="submit()">
          <div>
            <label class="text-sm">Requested Amount (KES)</label>
            <input type="number" class="input-field mt-1" [(ngModel)]="form.requested_amount" name="amount" />
          </div>
          <div>
            <label class="text-sm">Monthly Income</label>
            <input type="number" class="input-field mt-1" [(ngModel)]="form.monthly_income" name="income" />
          </div>
          <div>
            <label class="text-sm">Monthly Expenses</label>
            <input type="number" class="input-field mt-1" [(ngModel)]="form.monthly_expenses" name="expenses" />
          </div>
          <div>
            <label class="text-sm">Debt Ratio %</label>
            <input type="number" class="input-field mt-1" [(ngModel)]="form.debt_ratio" name="debt" />
          </div>
          <div class="sm:col-span-2">
            <label class="text-sm">Loan Purpose</label>
            <input type="text" class="input-field mt-1" [(ngModel)]="form.loan_purpose" name="purpose" />
          </div>
          <button type="submit" class="btn-primary sm:col-span-2">Submit & Get Matches</button>
        </form>
        @if (lastMatch()) {
          <div class="mt-4 rounded-xl bg-emerald-50 p-4 dark:bg-emerald-900/20">
            <p class="font-semibold text-emerald-800 dark:text-emerald-300">
              Match score: {{ lastMatch()!.compatibility_score }}% · Approval likelihood: {{ lastMatch()!.approval_likelihood }}%
            </p>
          </div>
        }
      </div>

      <div class="glass-card overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th class="px-4 py-3 text-left">Amount</th>
              <th class="px-4 py-3 text-left">Status</th>
              <th class="px-4 py-3 text-left">Affordability</th>
              <th class="px-4 py-3 text-left">Submitted</th>
            </tr>
          </thead>
          <tbody>
            @for (app of applications(); track app.id) {
              <tr class="border-t border-slate-100 dark:border-slate-800">
                <td class="px-4 py-3">{{ app.requested_amount | currency:'KES ':'symbol':'1.0-0' }}</td>
                <td class="px-4 py-3"><span class="rounded-full bg-primary-100 px-2 py-0.5 text-xs capitalize dark:bg-primary-900/40">{{ app.status }}</span></td>
                <td class="px-4 py-3">{{ app.affordability_score }}%</td>
                <td class="px-4 py-3">{{ app.submitted_at | date:'mediumDate' }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class BorrowerApplicationsComponent {
  private readonly auth = inject(AuthService);
  private readonly mockApi = inject(MockApiService);
  private readonly matching = inject(MatchingService);
  private readonly toast = inject(ToastService);

  readonly applications = computed(() =>
    this.mockApi.getApplicationsForBorrower(this.auth.user()?.id ?? '')
  );
  readonly lastMatch = signal<ReturnType<MatchingService['calculateMatch']> | null>(null);

  form = {
    requested_amount: 300000,
    monthly_income: 85000,
    monthly_expenses: 30000,
    debt_ratio: 30,
    loan_purpose: 'Working capital',
    employment_type: 'employed' as EmploymentType,
    crb_status: 'clear' as CrbStatus,
    business_stability_months: 12,
  };

  submit(): void {
    const result = this.matching.calculateMatch({
      ...this.form,
      employment_type: this.form.employment_type,
      crb_status: this.form.crb_status,
    });
    this.lastMatch.set(result);
    this.toast.success('Application analyzed', `Top match: ${result.top_lenders[0]?.lender.name ?? 'N/A'}`);
  }
}
