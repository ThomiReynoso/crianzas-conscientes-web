import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../../core/services/analytics.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
  private analytics = inject(AnalyticsService);

  onSessionBookingClick() {
    this.analytics.trackSessionBooking('services_page');
  }

  onInstagramClick() {
    this.analytics.trackSocialClick('Instagram');
  }

  onDownloadGuideClick() {
    this.analytics.trackCtaClick('Descargar guía gratuita', 'services', '/descarga-guia');
  }
}
