import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { PublicHeaderComponent } from '../../../layout/public-header/public-header.component';
import { MarketChartComponent } from '../../../shared/components/market-chart/market-chart.component';
import { LenderCardComponent } from '../../../shared/components/lender-card/lender-card.component';
import { MarketDataService } from '../../../core/services/market-data.service';
import { LenderService } from '../../../core/services/lender.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [PublicHeaderComponent, MarketChartComponent, LenderCardComponent, RouterLink, DecimalPipe],
  templateUrl: './landing.component.html',
})
export class LandingComponent {
  readonly market = inject(MarketDataService);
  readonly lenders = inject(LenderService);
  readonly snapshot = this.market.snapshot;
  readonly featuredLenders = this.lenders.getAll().slice(0, 4);
}
