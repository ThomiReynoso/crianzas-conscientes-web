import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GaLoaderService {
  private platformId = inject(PLATFORM_ID);
  private loaded = false;

  /**
   * Verifica si el dominio actual es un dominio de producción
   */
  private isProductionDomain(): boolean {
    const currentHostname = window.location.hostname;
    const productionDomains = environment.analytics.productionDomains || [];

    // Si no hay dominios definidos, considerar que está en producción
    if (productionDomains.length === 0) {
      return true;
    }

    // Verificar si el dominio actual está en la lista
    return productionDomains.some(domain => currentHostname === domain || currentHostname.endsWith(`.${domain}`));
  }

  /**
   * Carga Google Analytics 4 solo en producción y solo en el navegador
   */
  loadGoogleAnalytics(): void {
    // Solo cargar en el navegador (no en SSR)
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Solo cargar si analytics está habilitado (producción)
    if (!environment.analytics.enabled || !environment.analytics.measurementId) {
      console.log('🔧 [DEV MODE] Google Analytics NOT loaded (development environment)');
      return;
    }

    // Verificar si estamos en un dominio de producción real
    if (!this.isProductionDomain()) {
      console.log('🎭 [STAGING/PREVIEW] Google Analytics NOT loaded - Not a production domain');
      console.log(`   Current: ${window.location.hostname}`);
      console.log(`   Production domains: ${environment.analytics.productionDomains.join(', ')}`);
      return;
    }

    // Evitar cargar múltiples veces
    if (this.loaded) {
      return;
    }

    this.loaded = true;

    // Crear el script de gtag.js
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${environment.analytics.measurementId}`;
    document.head.appendChild(script);

    // Inicializar gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(arguments);
    }
    (window as any).gtag = gtag;

    gtag('js', new Date());
    gtag('config', environment.analytics.measurementId, {
      'send_page_view': true,
      'cookie_flags': 'SameSite=None;Secure'
    });

    console.log('📊 Google Analytics loaded successfully:', environment.analytics.measurementId);
  }
}
