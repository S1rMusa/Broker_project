import { Component, inject, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div class="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <aside
        class="fixed inset-y-0 left-0 z-40 w-64 -translate-x-full border-r border-slate-200 bg-white transition-transform dark:border-slate-800 dark:bg-slate-900 lg:static lg:translate-x-0"
        [class.translate-x-0]="sidebarOpen()"
      >
        <div class="flex h-16 items-center gap-2 border-b border-slate-200 px-4 dark:border-slate-800">
          <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 font-bold text-white">B</span>
          <span class="font-display font-bold">Broker</span>
        </div>
        <nav class="space-y-1 p-3">
          @for (item of navItems(); track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
              class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <span>{{ item.icon }}</span>{{ item.label }}
            </a>
          }
        </nav>
        <div class="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-3 dark:border-slate-800">
          <p class="truncate px-3 text-xs text-slate-500">{{ auth.user()?.full_name }}</p>
          <button type="button" (click)="auth.signOut()" class="mt-2 w-full rounded-xl px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">
            Sign out
          </button>
        </div>
      </aside>
      @if (sidebarOpen()) {
        <div class="fixed inset-0 z-30 bg-black/40 lg:hidden" (click)="sidebarOpen.set(false)"></div>
      }
      <div class="flex flex-1 flex-col">
        <header class="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900">
          <button type="button" class="lg:hidden" (click)="sidebarOpen.update(v => !v)">☰</button>
          <h1 class="font-display font-semibold">{{ title() }}</h1>
          <button type="button" (click)="theme.toggle()" class="btn-ghost !px-3">{{ theme.darkMode() ? '☀️' : '🌙' }}</button>
        </header>
        <main class="flex-1 overflow-auto p-4 sm:p-6">
          <ng-content />
        </main>
      </div>
    </div>
  `,
})
export class DashboardLayoutComponent {
  readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);
  readonly navItems = input.required<NavItem[]>();
  readonly title = input('Dashboard');
  readonly sidebarOpen = signal(false);
}
