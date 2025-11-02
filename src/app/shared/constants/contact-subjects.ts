// Opciones de asunto para el formulario de contacto
// Usado tanto en el frontend (contact.ts) como en el edge function (send-contact-email)
//
// IMPORTANTE: Si modificas estos valores, también debes actualizar manualmente:
// - supabase/functions/send-contact-email/index.ts (líneas 47-53)
//
// Los Edge Functions de Supabase no pueden importar archivos TypeScript del frontend,
// por lo que el subjectMap debe mantenerse sincronizado manualmente.

export interface SubjectOption {
  value: string;
  label: string;
}

export const CONTACT_SUBJECT_OPTIONS: SubjectOption[] = [
  { value: '', label: 'Selecciona un asunto' },
  { value: 'session', label: 'Quiero mi primera sesion gratuita 1:1' },
  { value: 'ebook-free', label: 'Pregunta sobre la guía gratuita' },
  { value: 'ebook-paid', label: 'Quiero comprar el ebook (5€)' },
  { value: 'collaboration', label: 'Propuesta de colaboración' },
  { value: 'other', label: 'Otro motivo / solo quiero charlar 🌿' }
];

// Mapa para convertir el valor del subject a texto legible
// Usado en el edge function para el asunto del email
export const CONTACT_SUBJECT_MAP: Record<string, string> = {
  'session': 'Consulta sobre sesiones 1:1',
  'ebook-free': 'Pregunta sobre la guía gratuita',
  'ebook-paid': 'Quiero comprar el ebook (5€)',
  'collaboration': 'Propuesta de colaboración',
  'other': 'Otro tema'
};
