import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService, GuideDownload } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900">Panel de Administración</h1>
          <button
            (click)="onLogout()"
            class="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-sm font-medium text-gray-500 mb-2">Total de Usuarios</h3>
            <p class="text-3xl font-bold text-gray-900">{{ stats.total }}</p>
          </div>
          @for (source of Object.keys(stats.bySource); track source) {
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-sm font-medium text-gray-500 mb-2">{{ source }}</h3>
              <p class="text-3xl font-bold text-gray-900">{{ stats.bySource[source] }}</p>
            </div>
          }
        </div>

        <!-- Users Table -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Lista de Usuarios</h2>
          </div>

          @if (loading) {
            <div class="p-8 text-center">
              <p class="text-gray-500">Cargando usuarios...</p>
            </div>
          } @else if (users.length === 0) {
            <div class="p-8 text-center">
              <p class="text-gray-500">No hay usuarios registrados</p>
            </div>
          } @else {
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Origen
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  @for (user of users; track user.id) {
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap">
                        @if (editingUserId === user.id) {
                          <input
                            type="email"
                            [(ngModel)]="editingEmail"
                            class="px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        } @else {
                          <div class="text-sm text-gray-900">{{ user.email }}</div>
                        }
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        @if (editingUserId === user.id) {
                          <input
                            type="text"
                            [(ngModel)]="editingSourcePage"
                            class="px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        } @else {
                          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-rose-100 text-rose-800">
                            {{ user.source_page || 'N/A' }}
                          </span>
                        }
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ formatDate(user.created_at) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        @if (editingUserId === user.id) {
                          <button
                            (click)="saveEdit()"
                            class="text-green-600 hover:text-green-900 mr-3"
                          >
                            Guardar
                          </button>
                          <button
                            (click)="cancelEdit()"
                            class="text-gray-600 hover:text-gray-900"
                          >
                            Cancelar
                          </button>
                        } @else {
                          <button
                            (click)="startEdit(user)"
                            class="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Editar
                          </button>
                          <button
                            (click)="deleteUser(user)"
                            class="text-red-600 hover:text-red-900"
                          >
                            Eliminar
                          </button>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      </main>
    </div>
  `,
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
