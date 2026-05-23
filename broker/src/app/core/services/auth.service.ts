import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Profile, UserRole } from '../models';
import { SupabaseService } from './supabase.service';
import { ToastService } from './toast.service';

interface MockUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  lender_id?: string;
}

const MOCK_USERS: Record<string, MockUser & { password: string }> = {
  'borrower@broker.ke': {
    id: 'usr-borrower-1', email: 'borrower@broker.ke', password: 'demo1234',
    full_name: 'Jane Wanjiku', role: 'borrower',
  },
  'lender@broker.ke': {
    id: 'usr-lender-1', email: 'lender@broker.ke', password: 'demo1234',
    full_name: 'Peter Ochieng', role: 'lender_admin', lender_id: 'lnd-001',
  },
  'admin@broker.ke': {
    id: 'usr-admin-1', email: 'admin@broker.ke', password: 'demo1234',
    full_name: 'Grace Akinyi', role: 'super_admin',
  },
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);
  private readonly supabase = inject(SupabaseService);
  private readonly toast = inject(ToastService);

  private readonly _user = signal<Profile | null>(null);
  private readonly _loading = signal(false);

  readonly user = this._user.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly role = computed(() => this._user()?.role ?? null);
  readonly isBorrower = computed(() => this.role() === 'borrower');
  readonly isLenderAdmin = computed(() => this.role() === 'lender_admin');
  readonly isSuperAdmin = computed(() => this.role() === 'super_admin');

  constructor() {
    this.restoreSession();
  }

  private restoreSession(): void {
    const stored = localStorage.getItem('broker_session');
    if (stored) {
      try {
        this._user.set(JSON.parse(stored));
      } catch {
        localStorage.removeItem('broker_session');
      }
    }
  }

  async signIn(email: string, password: string): Promise<boolean> {
    this._loading.set(true);
    try {
      if (this.supabase.isConfigured()) {
        const { data, error } = await this.supabase.supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) {
          const profile = await this.fetchProfile(data.user.id);
          this.setUser(profile);
          return true;
        }
      } else {
        const mock = MOCK_USERS[email.toLowerCase()];
        if (mock && mock.password === password) {
          const { password: _, ...mockProfile } = mock;
          const profile: Profile = {
            ...mockProfile,
            is_active: true,
            created_at: new Date().toISOString(),
          };
          this.setUser(profile);
          this.toast.success('Welcome back!', `Signed in as ${profile.full_name}`);
          return true;
        }
        this.toast.error('Invalid credentials', 'Use demo accounts from README');
      }
      return false;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Sign in failed';
      this.toast.error('Authentication failed', msg);
      return false;
    } finally {
      this._loading.set(false);
    }
  }

  async signUp(
    email: string,
    password: string,
    fullName: string,
    role: UserRole = 'borrower'
  ): Promise<boolean> {
    this._loading.set(true);
    try {
      if (this.supabase.isConfigured()) {
        const { data, error } = await this.supabase.supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName, role } },
        });
        if (error) throw error;
        if (data.user) {
          this.toast.success('Account created', 'Check your email to verify');
          return true;
        }
      } else {
        const profile: Profile = {
          id: `usr-${Date.now()}`,
          email,
          full_name: fullName,
          role,
          is_active: true,
          created_at: new Date().toISOString(),
        };
        this.setUser(profile);
        this.toast.success('Account created', 'Demo mode — no email verification');
        return true;
      }
      return false;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Registration failed';
      this.toast.error('Registration failed', msg);
      return false;
    } finally {
      this._loading.set(false);
    }
  }

  async signOut(): Promise<void> {
    if (this.supabase.isConfigured()) {
      await this.supabase.supabase.auth.signOut();
    }
    this._user.set(null);
    localStorage.removeItem('broker_session');
    this.router.navigate(['/']);
  }

  async resetPassword(email: string): Promise<void> {
    if (this.supabase.isConfigured()) {
      await this.supabase.supabase.auth.resetPasswordForEmail(email);
      this.toast.success('Email sent', 'Check your inbox for reset link');
    } else {
      this.toast.info('Demo mode', 'Password reset simulated for ' + email);
    }
  }

  private setUser(profile: Profile): void {
    this._user.set(profile);
    localStorage.setItem('broker_session', JSON.stringify(profile));
    this.redirectByRole(profile.role);
  }

  private redirectByRole(role: UserRole): void {
    const routes: Record<UserRole, string> = {
      borrower: '/borrower/dashboard',
      lender_admin: '/lender/dashboard',
      super_admin: '/admin/dashboard',
    };
    this.router.navigate([routes[role]]);
  }

  private async fetchProfile(userId: string): Promise<Profile> {
    const { data } = await this.supabase.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return data as Profile;
  }
}
