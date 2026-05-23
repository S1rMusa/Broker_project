import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-public-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/80">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a routerLink="/" class="flex items-center gap-2">
          <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-lg font-bold text-white">B</span>
          <span class="font-display text-xl font-bold">Broker</span>
        </a>
        <nav class="hidden items-center gap-6 md:flex">
          <a routerLink="/lenders" routerLinkActive="text-primary-600" class="text-sm font-medium hover:text-primary-600">Lenders</a>
          <a routerLink="/calculator" routerLinkActive="text-primary-600" class="text-sm font-medium hover:text-primary-600">Calculator</a>
          <a routerLink="/market" routerLinkActive="text-primary-600" class="text-sm font-medium hover:text-primary-600">Market</a>
        </nav>
        <div class="flex items-center gap-2">
          <button type="button" (click)="theme.toggle()" class="btn-ghost !px-3" aria-label="Toggle theme">
            {{ theme.darkMode() ? '☀️' : '🌙' }}
          </button>
          @if (auth.isAuthenticated()) {
            <a [routerLink]="dashboardLink()" class="btn-primary text-sm">Dashboard</a>
          } @else {
            <a routerLink="/auth/login" class="btn-ghost text-sm hidden sm:inline-flex">Login</a>
            <a routerLink="/auth/register" class="btn-primary text-sm">Get Started</a>
          }
        </div>
      </div>
    </header>
  `,
})
export class PublicHeaderComponent {
  readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);

  dashboardLink(): string {
    const role = this.auth.role();
    if (role === 'lender_admin') return '/lender/dashboard';
    if (role === 'super_admin') return '/admin/dashboard';
    return '/borrower/dashboard';
  }
}
