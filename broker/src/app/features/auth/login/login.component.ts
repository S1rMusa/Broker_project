import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { PublicHeaderComponent } from '../../../layout/public-header/public-header.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, PublicHeaderComponent],
  template: `
    <app-public-header />
    <div class="mx-auto max-w-md px-4 py-12">
      <div class="glass-card p-8">
        <h1 class="font-display text-2xl font-bold">Sign in</h1>
        <p class="mt-1 text-sm text-slate-500">Demo: borrower@broker.ke / lender@broker.ke / admin@broker.ke (demo1234)</p>
        <form class="mt-6 space-y-4" (ngSubmit)="onSubmit()">
          <div>
            <label class="text-sm font-medium">Email</label>
            <input type="email" class="input-field mt-1" [(ngModel)]="email" name="email" required />
          </div>
          <div>
            <label class="text-sm font-medium">Password</label>
            <input type="password" class="input-field mt-1" [(ngModel)]="password" name="password" required />
          </div>
          <button type="submit" class="btn-primary w-full" [disabled]="auth.loading()">
            {{ auth.loading() ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>
        <p class="mt-4 text-center text-sm">
          <a routerLink="/auth/register" class="text-primary-600 hover:underline">Create account</a>
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {
  readonly auth = inject(AuthService);
  email = 'borrower@broker.ke';
  password = 'demo1234';

  async onSubmit(): Promise<void> {
    await this.auth.signIn(this.email, this.password);
  }
}
