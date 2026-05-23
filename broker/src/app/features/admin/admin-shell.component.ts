import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardLayoutComponent, NavItem } from '../../layout/dashboard-layout/dashboard-layout.component';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [DashboardLayoutComponent, RouterOutlet],
  template: `
    <app-dashboard-layout [navItems]="nav" title="Super Admin">
      <router-outlet />
    </app-dashboard-layout>
  `,
})
export class AdminShellComponent {
  readonly nav: NavItem[] = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { label: 'Analytics', path: '/admin/analytics', icon: '📈' },
    { label: 'Users', path: '/admin/users', icon: '👥' },
    { label: 'Lenders', path: '/admin/lenders', icon: '🏦' },
    { label: 'Audit Logs', path: '/admin/audit', icon: '📜' },
  ];
}
