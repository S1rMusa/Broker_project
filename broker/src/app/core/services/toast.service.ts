import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  show(type: Toast['type'], title: string, message?: string): void {
    const toast: Toast = { id: crypto.randomUUID(), type, title, message };
    this._toasts.update((t) => [...t, toast]);
    setTimeout(() => this.dismiss(toast.id), 5000);
  }

  success(title: string, message?: string): void {
    this.show('success', title, message);
  }

  error(title: string, message?: string): void {
    this.show('error', title, message);
  }

  info(title: string, message?: string): void {
    this.show('info', title, message);
  }

  warning(title: string, message?: string): void {
    this.show('warning', title, message);
  }

  dismiss(id: string): void {
    this._toasts.update((t) => t.filter((x) => x.id !== id));
  }
}
