import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService, GuideDownload } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.html',
  styles: []
})
export class AdminDashboardComponent implements OnInit {
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  Object = Object; // Para usar Object.keys en el template

  users: GuideDownload[] = [];
  stats: { total: number; bySource: Record<string, number> } = { total: 0, bySource: {} };
  loading = true;

  // Edición
  editingUserId: string | null = null;
  editingEmail = '';
  editingSourcePage = '';

  async ngOnInit() {
    await this.loadUsers();
    await this.loadStats();
  }

  async loadUsers() {
    this.loading = true;
    this.users = await this.supabaseService.getAllGuideDownloads();
    this.loading = false;
  }

  async loadStats() {
    this.stats = await this.supabaseService.getDownloadStats();
  }

  startEdit(user: GuideDownload) {
    this.editingUserId = user.id || null;
    this.editingEmail = user.email;
    this.editingSourcePage = user.source_page || '';
  }

  cancelEdit() {
    this.editingUserId = null;
    this.editingEmail = '';
    this.editingSourcePage = '';
  }

  async saveEdit() {
    if (!this.editingUserId) return;

    const result = await this.supabaseService.updateGuideDownload(this.editingUserId, {
      email: this.editingEmail,
      source_page: this.editingSourcePage
    });

    if (result.success) {
      await this.loadUsers();
      await this.loadStats();
      this.cancelEdit();
    } else {
      alert('Error al actualizar: ' + result.error);
    }
  }

  async deleteUser(user: GuideDownload) {
    if (!user.id) return;

    if (!confirm(`¿Estás seguro de eliminar el usuario ${user.email}?`)) {
      return;
    }

    const result = await this.supabaseService.deleteGuideDownload(user.id);

    if (result.success) {
      await this.loadUsers();
      await this.loadStats();
    } else {
      alert('Error al eliminar: ' + result.error);
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  async onLogout() {
    await this.supabaseService.signOut();
    this.router.navigate(['/admin/login']);
  }
}
