import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../../core/services/analytics.service';

@Component({
  selector: 'app-recursos-digitales',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './recursos-digitales.html',
  styleUrl: './recursos-digitales.scss'
})
export class RecursosDigitalesComponent implements OnInit {
  private analytics = inject(AnalyticsService);

  ngOnInit() {
    // Track resource page view
    this.analytics.trackResourceView('Recursos Digitales');
  }

  onEbookPurchaseClick() {
    this.analytics.trackEbookPurchase('Guía práctica crianza consciente');
  }
}
