import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardLayoutComponent, NavItem } from '../../layout/dashboard-layout/dashboard-layout.component';

@Component({
  selector: 'app-lender-shell',
  standalone: true,
  imports: [DashboardLayoutComponent, RouterOutlet],
  template: `
    <app-dashboard-layout [navItems]="nav" title="Lender Admin">
      <router-outlet />
    </app-dashboard-layout>
  `,
})
export class LenderShellComponent {
  readonly nav: NavItem[] = [
    { label: 'Dashboard', path: '/lender/dashboard', icon: '📊' },
    { label: 'Borrowers', path: '/lender/borrowers', icon: '👥' },
    { label: 'Pipeline', path: '/lender/pipeline', icon: '🔄' },
    { label: 'Analytics', path: '/lender/analytics', icon: '📈' },
  ];
}
