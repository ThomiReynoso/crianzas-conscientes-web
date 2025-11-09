import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../../core/services/analytics.service';

@Component({
  selector: 'app-what-is',
  imports: [RouterLink],
  templateUrl: './what-is.html',
  styleUrl: './what-is.scss',
})
export class WhatIs {
  private analytics = inject(AnalyticsService);

  onDownloadGuideClick() {
    this.analytics.trackCtaClick('Descargar guía gratuita', 'what-is', '/descarga-guia');
  }
}
