import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardLayoutComponent, NavItem } from '../../layout/dashboard-layout/dashboard-layout.component';

@Component({
  selector: 'app-borrower-shell',
  standalone: true,
  imports: [DashboardLayoutComponent, RouterOutlet],
  template: `
    <app-dashboard-layout [navItems]="nav" title="Borrower Portal">
      <router-outlet />
    </app-dashboard-layout>
  `,
})
export class BorrowerShellComponent {
  readonly nav: NavItem[] = [
    { label: 'Dashboard', path: '/borrower/dashboard', icon: '📊' },
    { label: 'Applications', path: '/borrower/applications', icon: '📋' },
    { label: 'Profile', path: '/borrower/profile', icon: '👤' },
    { label: 'Notifications', path: '/borrower/notifications', icon: '🔔' },
  ];
}
