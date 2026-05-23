import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models';
import { PublicHeaderComponent } from '../../../layout/public-header/public-header.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, PublicHeaderComponent],
  template: `
    <app-public-header />
    <div class="mx-auto max-w-md px-4 py-12">
      <div class="glass-card p-8">
        <h1 class="font-display text-2xl font-bold">Create account</h1>
        <form class="mt-6 space-y-4" (ngSubmit)="onSubmit()">
          <div>
            <label class="text-sm font-medium">Full name</label>
            <input type="text" class="input-field mt-1" [(ngModel)]="fullName" name="fullName" required />
          </div>
          <div>
            <label class="text-sm font-medium">Email</label>
            <input type="email" class="input-field mt-1" [(ngModel)]="email" name="email" required />
          </div>
          <div>
            <label class="text-sm font-medium">Password</label>
            <input type="password" class="input-field mt-1" [(ngModel)]="password" name="password" required minlength="6" />
          </div>
          <div>
            <label class="text-sm font-medium">I am a</label>
            <select class="input-field mt-1" [(ngModel)]="role" name="role">
              <option value="borrower">Borrower</option>
              <option value="lender_admin">Lender Admin</option>
            </select>
          </div>
          <button type="submit" class="btn-primary w-full" [disabled]="auth.loading()">Register</button>
        </form>
        <p class="mt-4 text-center text-sm">
          <a routerLink="/auth/login" class="text-primary-600 hover:underline">Already have an account?</a>
        </p>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  readonly auth = inject(AuthService);
  fullName = '';
  email = '';
  password = '';
  role: UserRole = 'borrower';

  async onSubmit(): Promise<void> {
    await this.auth.signUp(this.email, this.password, this.fullName, this.role);
  }
}
