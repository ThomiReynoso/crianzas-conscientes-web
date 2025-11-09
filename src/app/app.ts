import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { GaLoaderService } from './core/services/ga-loader.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('crianzas-conscientes-web');
  private gaLoader = inject(GaLoaderService);

  ngOnInit() {
    // Cargar Google Analytics (solo en producción)
    this.gaLoader.loadGoogleAnalytics();
  }
}
