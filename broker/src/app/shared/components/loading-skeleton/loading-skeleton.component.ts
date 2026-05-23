import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  template: `
    <div class="space-y-3" [class]="className()">
      @for (row of rowIndices(); track row) {
        <div class="skeleton h-4" [style.width.%]="widths[row % widths.length]"></div>
      }
    </div>
  `,
})
export class LoadingSkeletonComponent {
  readonly rows = input(3);
  readonly className = input('');
  readonly widths = [100, 85, 70, 90, 60];
  readonly rowIndices = computed(() =>
    Array.from({ length: this.rows() }, (_, i) => i)
  );
}
