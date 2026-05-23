import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DecimalPipe, CurrencyPipe } from '@angular/common';
import { PublicHeaderComponent } from '../../../layout/public-header/public-header.component';
import { LenderService } from '../../../core/services/lender.service';

@Component({
  selector: 'app-lender-detail',
  standalone: true,
  imports: [PublicHeaderComponent, RouterLink, DecimalPipe, CurrencyPipe],
  template: `
    <app-public-header />
    @if (lender) {
      <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div class="glass-card p-8">
          <div class="flex items-start gap-4">
            <span class="text-5xl">{{ lender.logo }}</span>
            <div>
              <h1 class="font-display text-3xl font-bold">{{ lender.name }}</h1>
              <p class="mt-2 text-slate-500">{{ lender.description }}</p>
            </div>
          </div>
          <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div><p class="text-xs text-slate-500">Interest Rate</p><p class="font-bold">{{ lender.minimum_interest_rate }}–{{ lender.maximum_interest_rate }}%</p></div>
            <div><p class="text-xs text-slate-500">Loan Range</p><p class="font-bold">{{ lender.minimum_loan_amount | currency:'KES ':'symbol':'1.0-0' }} – {{ lender.maximum_loan_amount | currency:'KES ':'symbol':'1.0-0' }}</p></div>
            <div><p class="text-xs text-slate-500">Processing</p><p class="font-bold">{{ lender.processing_time }}</p></div>
            <div><p class="text-xs text-slate-500">Acceptance Rate</p><p class="font-bold">{{ lender.acceptance_rate }}%</p></div>
            <div><p class="text-xs text-slate-500">Target Customer</p><p class="font-bold">{{ lender.target_customer }}</p></div>
            <div><p class="text-xs text-slate-500">Risk Level</p><p class="font-bold capitalize">{{ lender.risk_level }}</p></div>
          </div>
          <div class="mt-6 text-sm text-slate-500">
            <p>{{ lender.physical_address }}</p>
            <p>{{ lender.contact_email }} · {{ lender.phone_number }}</p>
          </div>
          <a routerLink="/auth/register" class="btn-primary mt-8 inline-flex">Apply with this lender</a>
        </div>
      </div>
    } @else {
      <p class="p-8 text-center">Lender not found.</p>
    }
  `,
})
export class LenderDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly lenderService = inject(LenderService);
  readonly lender = this.lenderService.getBySlug(this.route.snapshot.params['slug']);
}
