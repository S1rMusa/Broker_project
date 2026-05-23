import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/public/landing/landing.component').then(m => m.LandingComponent) },
  { path: 'lenders', loadComponent: () => import('./features/public/marketplace/marketplace.component').then(m => m.MarketplaceComponent) },
  { path: 'lenders/:slug', loadComponent: () => import('./features/public/lender-detail/lender-detail.component').then(m => m.LenderDetailComponent) },
  { path: 'calculator', loadComponent: () => import('./features/public/calculator/calculator.component').then(m => m.CalculatorComponent) },
  { path: 'market', loadComponent: () => import('./features/public/market/market.component').then(m => m.MarketComponent) },
  {
    path: 'auth',
    children: [
      { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
    ],
  },
  {
    path: 'borrower',
    canActivate: [authGuard, roleGuard(['borrower'])],
    loadComponent: () => import('./features/borrower/borrower-shell.component').then(m => m.BorrowerShellComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/borrower/dashboard/borrower-dashboard.component').then(m => m.BorrowerDashboardComponent) },
      { path: 'applications', loadComponent: () => import('./features/borrower/applications/borrower-applications.component').then(m => m.BorrowerApplicationsComponent) },
      { path: 'profile', loadComponent: () => import('./features/borrower/profile/borrower-profile.component').then(m => m.BorrowerProfileComponent) },
      { path: 'notifications', loadComponent: () => import('./features/borrower/notifications/borrower-notifications.component').then(m => m.BorrowerNotificationsComponent) },
    ],
  },
  {
    path: 'lender',
    canActivate: [authGuard, roleGuard(['lender_admin'])],
    loadComponent: () => import('./features/lender/lender-shell.component').then(m => m.LenderShellComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/lender/dashboard/lender-dashboard.component').then(m => m.LenderDashboardComponent) },
      { path: 'borrowers', loadComponent: () => import('./features/lender/borrowers/lender-borrowers.component').then(m => m.LenderBorrowersComponent) },
      { path: 'pipeline', loadComponent: () => import('./features/lender/pipeline/lender-pipeline.component').then(m => m.LenderPipelineComponent) },
      { path: 'analytics', loadComponent: () => import('./features/lender/analytics/lender-analytics.component').then(m => m.LenderAnalyticsComponent) },
    ],
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard(['super_admin'])],
    loadComponent: () => import('./features/admin/admin-shell.component').then(m => m.AdminShellComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'analytics', loadComponent: () => import('./features/admin/analytics/admin-analytics.component').then(m => m.AdminAnalyticsComponent) },
      { path: 'users', loadComponent: () => import('./features/admin/users/admin-users.component').then(m => m.AdminUsersComponent) },
      { path: 'lenders', loadComponent: () => import('./features/admin/lenders/admin-lenders.component').then(m => m.AdminLendersComponent) },
      { path: 'audit', loadComponent: () => import('./features/admin/audit/admin-audit.component').then(m => m.AdminAuditComponent) },
    ],
  },
  { path: '**', redirectTo: '' },
];
