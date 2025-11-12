import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styles: []
})
export class AdminLoginComponent {
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  async onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const result = await this.supabaseService.signIn(this.email, this.password);

    this.loading = false;

    if (result.success) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.errorMessage = result.error || 'Error al iniciar sesión';
    }
  }
}
