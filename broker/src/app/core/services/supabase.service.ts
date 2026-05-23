import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private client: SupabaseClient | null = null;

  get supabase(): SupabaseClient {
    if (!this.client) {
      const url = environment.supabaseUrl;
      const key = environment.supabaseAnonKey;
      if (url.includes('your-project') || key.includes('your-anon')) {
        throw new Error('Configure Supabase credentials in environment.ts');
      }
      this.client = createClient(url, key);
    }
    return this.client;
  }

  isConfigured(): boolean {
    return (
      !environment.supabaseUrl.includes('your-project') &&
      !environment.supabaseAnonKey.includes('your-anon')
    );
  }
}
