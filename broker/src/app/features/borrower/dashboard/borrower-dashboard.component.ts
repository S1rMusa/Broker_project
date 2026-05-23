import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { MockApiService } from '../../../core/services/mock-api.service';
import { MatchingService } from '../../../core/services/matching.service';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { LenderCardComponent } from '../../../shared/components/lender-card/lender-card.component';

@Component({
  selector: 'app-borrower-dashboard',
  standalone: true,
  imports: [StatCardComponent, LenderCardComponent, RouterLink, CurrencyPipe, DecimalPipe],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="font-display text-2xl font-bold">Welcome, {{ auth.user()?.full_name }}</h2>
        <p class="text-slate-500">Your borrower dashboard</p>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <app-stat-card label="Affordability Score" [value]="match().affordability_score" [isPercent]="true" />
        <app-stat-card label="Approval Probability" [value]="match().approval_likelihood" [isPercent]="true" />
        <app-stat-card label="Compatibility" [value]="match().compatibility_score" [isPercent]="true" />
        <app-stat-card label="Active Applications" [value]="applications().length" />
      </div>
      <div>
        <h3 class="font-semibold mb-4">Recommended Lenders</h3>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          @for (m of match().top_lenders; track m.lender.id) {
            <div class="relative">
              <app-lender-card [lender]="m.lender" />
              <span class="absolute top-3 right-3 rounded-full bg-primary-600 px-2 py-0.5 text-xs font-bold text-white">
                {{ m.compatibility_score }}% match
              </span>
            </div>
          }
        </div>
      </div>
      <a routerLink="/borrower/applications" class="btn-primary inline-flex">New Application</a>
    </div>
  `,
})
export class BorrowerDashboardComponent {
  readonly auth = inject(AuthService);
  private readonly mockApi = inject(MockApiService);
  private readonly matching = inject(MatchingService);

  readonly applications = computed(() => {
    const id = this.auth.user()?.id ?? '';
    return this.mockApi.getApplicationsForBorrower(id);
  });

  readonly match = computed(() =>
    this.matching.calculateMatch({
      monthly_income: 120000,
      monthly_expenses: 45000,
      employment_type: 'business_owner',
      requested_amount: 500000,
      debt_ratio: 28,
      crb_status: 'clear',
      business_stability_months: 18,
    })
  );
}
