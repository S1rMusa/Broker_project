import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  template: `
    <div class="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="glass-card animate-slide-up px-4 py-3 shadow-2xl border-l-4"
          [class.border-l-emerald-500]="toast.type === 'success'"
          [class.border-l-rose-500]="toast.type === 'error'"
          [class.border-l-blue-500]="toast.type === 'info'"
          [class.border-l-amber-500]="toast.type === 'warning'"
        >
          <p class="font-semibold text-sm">{{ toast.title }}</p>
          @if (toast.message) {
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ toast.message }}</p>
          }
        </div>
      }
    </div>
  `,
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);
}
