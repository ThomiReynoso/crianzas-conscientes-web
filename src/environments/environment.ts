// Archivo de environment para desarrollo
// Este archivo se puede commitear porque usa credenciales públicas de Supabase (anonKey)
export const environment = {
  production: false,
  supabase: {
    url: 'https://fzkwslnlvnojsjzzysav.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6a3dzbG5sdm5vanNqenp5c2F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1OTEyNDQsImV4cCI6MjA3NzE2NzI0NH0.RZgwIPcqmKdiWl_glRJIiJ7EMtXqgNSnxkuzEZAQbhk'
  },
  analytics: {
    enabled: false, // Deshabilitar analytics en desarrollo
    measurementId: '' // No cargar GA4 en desarrollo
  }
};
