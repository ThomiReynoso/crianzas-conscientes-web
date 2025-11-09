import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../../core/services/analytics.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private analytics = inject(AnalyticsService);

  onSessionBookingClick() {
    this.analytics.trackSessionBooking('home_page');
  }

  onDownloadGuideClick() {
    this.analytics.trackCtaClick('Descargar guía gratuita', 'home', '/descarga-guia');
  }
}
