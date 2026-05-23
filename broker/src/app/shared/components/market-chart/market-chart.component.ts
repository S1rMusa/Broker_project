import { Component, OnDestroy, effect, inject, input, viewChild, ElementRef } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { MarketDataService } from '../../../core/services/market-data.service';

Chart.register(...registerables);

@Component({
  selector: 'app-market-chart',
  standalone: true,
  template: `<div class="relative h-64 w-full"><canvas #chartCanvas></canvas></div>`,
})
export class MarketChartComponent implements OnDestroy {
  readonly title = input('Interest Rate Trends');
  private readonly market = inject(MarketDataService);
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('chartCanvas');
  private chart?: Chart;

  constructor() {
    effect(() => {
      const snap = this.market.snapshot();
      this.renderChart(snap.rates.map((r) => r.label), snap.rates.map((r) => r.rate));
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private renderChart(labels: string[], data: number[]): void {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) return;

    const isDark = document.documentElement.classList.contains('dark');
    const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Avg Rate %',
          data,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#f97316',
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 600 },
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 10 } } },
          y: {
            grid: { color: gridColor },
            ticks: { color: textColor, callback: (v) => v + '%' },
          },
        },
      },
    };

    if (this.chart) {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = data;
      this.chart.update('active');
    } else {
      this.chart = new Chart(canvas, config);
    }
  }
}
