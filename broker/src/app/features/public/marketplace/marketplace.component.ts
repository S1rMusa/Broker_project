import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PublicHeaderComponent } from '../../../layout/public-header/public-header.component';
import { LenderCardComponent } from '../../../shared/components/lender-card/lender-card.component';
import { LenderService } from '../../../core/services/lender.service';
import { RiskLevel } from '../../../core/models';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [PublicHeaderComponent, LenderCardComponent, FormsModule],
  template: `
    <app-public-header />
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 class="font-display text-3xl font-bold">Lender Marketplace</h1>
      <p class="mt-2 text-slate-500">Compare {{ filtered().length }} licensed lenders in Kenya</p>

      <div class="mt-6 flex flex-wrap gap-3">
        <input
          type="search"
          class="input-field max-w-xs"
          placeholder="Search lenders..."
          [ngModel]="search()"
          (ngModelChange)="search.set($event); page.set(1)"
        />
        <select
          class="input-field max-w-[160px]"
          [ngModel]="riskFilter()"
          (ngModelChange)="riskFilter.set($event); page.set(1)"
        >
          <option value="">All risk levels</option>
          <option value="low">Low risk</option>
          <option value="medium">Medium risk</option>
          <option value="high">High risk</option>
        </select>
      </div>

      <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        @for (lender of paginated().items; track lender.id) {
          <app-lender-card [lender]="lender" />
        }
      </div>

      @if (paginated().pages > 1) {
        <div class="mt-8 flex justify-center gap-2">
          <button type="button" class="btn-ghost" [disabled]="page() <= 1" (click)="page.update(p => p - 1)">Previous</button>
          <span class="flex items-center px-4 text-sm">Page {{ page() }} of {{ paginated().pages }}</span>
          <button type="button" class="btn-ghost" [disabled]="page() >= paginated().pages" (click)="page.update(p => p + 1)">Next</button>
        </div>
      }
    </div>
  `,
})
export class MarketplaceComponent {
  private readonly lenderService = inject(LenderService);
  readonly search = signal('');
  readonly riskFilter = signal('');
  readonly page = signal(1);
  readonly pageSize = 9;

  readonly filtered = computed(() =>
    this.lenderService.filter({
      search: this.search() || undefined,
      riskLevel: (this.riskFilter() as RiskLevel) || undefined,
    })
  );

  readonly paginated = computed(() =>
    this.lenderService.paginate(this.filtered(), this.page(), this.pageSize)
  );
}
