import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AnalyticsService } from '../../core/services/analytics.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly isMenuOpen = signal(false);
  private analytics = inject(AnalyticsService);

  toggleMenu() {
    this.isMenuOpen.update(value => !value);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  onDownloadGuideClick() {
    this.analytics.trackCtaClick('Descargar guía gratuita', 'header', '/descarga-guia');
  }
}
