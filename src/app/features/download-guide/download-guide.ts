import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';
import { AnalyticsService } from '../../core/services/analytics.service';

@Component({
  selector: 'app-download-guide',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './download-guide.html',
  styleUrls: ['./download-guide.scss']
})
export class DownloadGuideComponent {
  private supabaseService = inject(SupabaseService);
  private analytics = inject(AnalyticsService);

  email = signal('');
  isSubmitting = signal(false);
  isSuccess = signal(false);
  errorMessage = signal('');

  async onSubmit() {
    if (!this.email() || !this.isValidEmail(this.email())) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    try {
      // Track guide download attempt (incluso si Supabase falla)
      this.analytics.trackGuideDownload('Límites con amor');

      // Guardar email en Supabase
      const result = await this.supabaseService.saveGuideDownload(this.email(), 'descarga-guia');

      if (result.success) {
        this.isSuccess.set(true);
      } else {
        this.errorMessage.set(result.error || 'Hubo un error al procesar tu solicitud. Por favor, intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error al guardar email:', error);
      this.errorMessage.set('Hubo un error al procesar tu solicitud. Por favor, intenta nuevamente.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
