# Panel de Administración - Crianzas Conscientes

## Descripción

Este panel de administración permite gestionar los usuarios registrados (emails de descargas de guías) de forma simple y segura utilizando Supabase Authentication.

## Características

- ✅ Login seguro con Supabase Authentication
- ✅ Dashboard con estadísticas de usuarios
- ✅ Visualización de todos los emails registrados
- ✅ Edición de información de usuarios (email, fuente)
- ✅ Eliminación de usuarios
- ✅ Protección de rutas con guards
- ✅ Diseño responsive con Tailwind CSS

## Configuración Inicial

### 1. Crear Usuario Admin en Supabase

Para crear el usuario administrador, sigue estos pasos:

1. **Accede a tu proyecto en Supabase**
   - Ve a [https://supabase.com](https://supabase.com)
   - Entra a tu proyecto: `fzkwslnlvnojsjzzysav`

2. **Crea un usuario desde el panel de Authentication**
   - En el menú lateral, selecciona **Authentication** → **Users**
   - Haz clic en **Add user** → **Create new user**
   - Ingresa:
     - **Email**: El email que usarás para administrar (ej: `admin@crianzasconscientes.com`)
     - **Password**: Una contraseña segura (mínimo 6 caracteres)
   - Haz clic en **Create user**

3. **Verificación automática (opcional)**
   - Por defecto, Supabase puede requerir que verifiques el email
   - Para saltarte este paso en desarrollo:
     - Ve a **Authentication** → **Settings** → **Email Auth**
     - Desactiva "Confirm email" (solo para desarrollo)
     - O manualmente marca el usuario como verificado en la tabla de usuarios

### 2. Configuración de Políticas de Seguridad (RLS)

Para que el admin pueda ver/editar/eliminar usuarios, necesitas configurar las Row Level Security policies:

1. Ve a **Database** → **Tables** → `guide_downloads`
2. Habilita RLS si no está habilitado
3. Crea las siguientes políticas:

**Política de Lectura (SELECT):**
```sql
CREATE POLICY "Usuarios autenticados pueden leer"
ON guide_downloads
FOR SELECT
TO authenticated
USING (true);
```

**Política de Actualización (UPDATE):**
```sql
CREATE POLICY "Usuarios autenticados pueden actualizar"
ON guide_downloads
FOR UPDATE
TO authenticated
USING (true);
```

**Política de Eliminación (DELETE):**
```sql
CREATE POLICY "Usuarios autenticados pueden eliminar"
ON guide_downloads
FOR DELETE
TO authenticated
USING (true);
```

**Política de Inserción (INSERT) - Ya existente:**
```sql
-- Esta política permite que usuarios anónimos inserten (para el formulario público)
CREATE POLICY "Permitir inserción anónima"
ON guide_downloads
FOR INSERT
TO anon
WITH CHECK (true);
```

### 3. Configurar las políticas desde el SQL Editor

Alternativamente, puedes ejecutar este script en **SQL Editor**:

```sql
-- Habilitar RLS
ALTER TABLE guide_downloads ENABLE ROW LEVEL SECURITY;

-- Permitir que usuarios autenticados lean todos los registros
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer" ON guide_downloads;
CREATE POLICY "Usuarios autenticados pueden leer"
ON guide_downloads
FOR SELECT
TO authenticated
USING (true);

-- Permitir que usuarios autenticados actualicen registros
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar" ON guide_downloads;
CREATE POLICY "Usuarios autenticados pueden actualizar"
ON guide_downloads
FOR UPDATE
TO authenticated
USING (true);

-- Permitir que usuarios autenticados eliminen registros
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar" ON guide_downloads;
CREATE POLICY "Usuarios autenticados pueden eliminar"
ON guide_downloads
FOR DELETE
TO authenticated
USING (true);

-- Mantener la política de inserción anónima para el formulario público
DROP POLICY IF EXISTS "Permitir inserción anónima" ON guide_downloads;
CREATE POLICY "Permitir inserción anónima"
ON guide_downloads
FOR INSERT
TO anon
WITH CHECK (true);
```

## Acceso al Panel

### URLs de Acceso

- **Desarrollo**: `http://localhost:4200/admin`
- **Producción**: `https://tudominio.com/admin`

### Credenciales

- **Email**: El que configuraste en Supabase (ej: `admin@crianzasconscientes.com`)
- **Contraseña**: La contraseña que configuraste

## Uso del Panel

### Login

1. Navega a `/admin/login`
2. Ingresa tu email y contraseña
3. Haz clic en "Ingresar"
4. Serás redirigido al dashboard

### Dashboard

El dashboard muestra:

- **Estadísticas generales**:
  - Total de usuarios registrados
  - Usuarios por fuente (página de origen)

- **Tabla de usuarios**:
  - Email
  - Origen (página desde donde se registró)
  - Fecha de registro
  - Acciones (Editar/Eliminar)

### Editar Usuario

1. Haz clic en "Editar" junto al usuario
2. Modifica el email o la fuente
3. Haz clic en "Guardar"
4. Los cambios se reflejarán inmediatamente

### Eliminar Usuario

1. Haz clic en "Eliminar" junto al usuario
2. Confirma la eliminación
3. El usuario será eliminado permanentemente

### Cerrar Sesión

1. Haz clic en "Cerrar sesión" en el header
2. Serás redirigido al login

## Estructura de Archivos

```
src/app/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts          # Guard para proteger rutas admin
│   └── services/
│       └── supabase.service.ts    # Servicio con métodos de auth y CRUD
├── features/
│   └── admin/
│       ├── login/
│       │   └── login.ts           # Componente de login
│       └── dashboard/
│           └── dashboard.ts       # Componente del dashboard
└── app.routes.ts                  # Rutas con protección
```

## Seguridad

- ✅ Las rutas del admin están protegidas con `authGuard`
- ✅ Solo usuarios autenticados pueden acceder al dashboard
- ✅ Las sesiones se mantienen entre recargas de página
- ✅ RLS de Supabase protege la base de datos
- ✅ El token de autenticación se auto-refresca

## Troubleshooting

### No puedo iniciar sesión

- Verifica que el email y contraseña sean correctos
- Asegúrate de que el usuario esté creado en Supabase
- Verifica que el usuario esté marcado como verificado (si tienes esa opción habilitada)

### No veo los usuarios en el dashboard

- Verifica que las políticas RLS estén configuradas correctamente
- Asegúrate de estar autenticado
- Revisa la consola del navegador para errores

### Error "Servicio no disponible"

- Esto ocurre si intentas usar Supabase desde el servidor (SSR)
- El servicio solo funciona en el navegador
- Asegúrate de que `isPlatformBrowser` retorne `true`

## Próximas Mejoras

Posibles mejoras futuras:

- [ ] Exportar usuarios a CSV/Excel
- [ ] Filtros y búsqueda en la tabla
- [ ] Paginación para grandes cantidades de usuarios
- [ ] Roles de usuario (super admin, admin, viewer)
- [ ] Historial de cambios
- [ ] Envío de emails masivos desde el panel
- [ ] Gráficos y estadísticas más detalladas

## Soporte

Para cualquier problema o pregunta, revisa:
- La consola del navegador para errores
- Los logs de Supabase
- La documentación de Supabase: https://supabase.com/docs
