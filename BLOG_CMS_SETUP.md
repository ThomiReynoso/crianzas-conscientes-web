# Configuración del CMS de Blog - Crianzas Conscientes

## 📋 Tabla de Contenidos
1. [Configuración de Supabase](#configuración-de-supabase)
2. [Crear Bucket de Imágenes](#crear-bucket-de-imágenes)
3. [Acceso al Panel](#acceso-al-panel)
4. [Uso del CMS](#uso-del-cms)

## 1. Configuración de Supabase

### Paso 1: Crear la tabla de blog_posts

1. Accede a tu proyecto en Supabase: https://supabase.com
2. Ve a **SQL Editor**
3. Copia y pega el contenido del archivo `/supabase/migrations/create_blog_posts_table.sql`
4. Haz clic en **Run** para ejecutar el script
5. Verifica que la tabla `blog_posts` se haya creado correctamente en **Database** → **Tables**

El script creará:
- ✅ Tabla `blog_posts` con todos los campos necesarios
- ✅ Índices para mejorar el rendimiento
- ✅ Políticas de seguridad (RLS)
- ✅ Trigger para actualizar `updated_date` automáticamente
- ✅ 2 posts de ejemplo pre-cargados

### Paso 2: Verificar las políticas RLS

Las políticas ya deberían estar configuradas por el script, pero verifica:

1. Ve a **Database** → **Tables** → `blog_posts`
2. Haz clic en **RLS** (Row Level Security)
3. Deberías ver estas políticas:
   - ✅ "Permitir lectura pública de posts publicados" (SELECT para anon/authenticated)
   - ✅ "Usuarios autenticados pueden leer todos los posts" (SELECT para authenticated)
   - ✅ "Usuarios autenticados pueden insertar posts" (INSERT para authenticated)
   - ✅ "Usuarios autenticados pueden actualizar posts" (UPDATE para authenticated)
   - ✅ "Usuarios autenticados pueden eliminar posts" (DELETE para authenticated)

## 2. Crear Bucket de Imágenes

### Paso 1: Crear el bucket

1. Ve a **Storage** en el menú lateral
2. Haz clic en **Create a new bucket**
3. Configura:
   - **Name**: `blog-images`
   - **Public bucket**: ✅ **SÍ** (marcar como público)
   - **Allowed MIME types**: Dejar vacío (o especificar: `image/jpeg`, `image/png`, `image/webp`, `image/gif`)
   - **File size limit**: 5 MB (recomendado)
4. Haz clic en **Create bucket**

### Paso 2: Configurar políticas de Storage

El bucket debe permitir:
- **Upload**: Solo usuarios autenticados
- **Read**: Público (para que las imágenes se vean en el blog)

1. Ve a **Storage** → `blog-images` → **Policies**
2. Crea la política de lectura pública:

```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');
```

3. Crea la política de subida para usuarios autenticados:

```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');
```

4. Crea la política de actualización para usuarios autenticados:

```sql
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'blog-images');
```

5. Crea la política de eliminación para usuarios autenticados:

```sql
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'blog-images');
```

## 3. Acceso al Panel

### URLs
- **Login**: `http://localhost:4200/admin/login` (desarrollo)
- **Dashboard**: `http://localhost:4200/admin/dashboard` (después de login)
- **Admin Blog**: `http://localhost:4200/admin/blog` (gestión de posts)

### Credenciales
Usa las mismas credenciales que configuraste en `ADMIN_PANEL.md`:
- **Email**: admin@crianzasconscientes.com (o el que hayas configurado)
- **Password**: Tu contraseña de admin

## 4. Uso del CMS

### Crear un nuevo post

1. Inicia sesión en `/admin/login`
2. Ve a `/admin/blog` o haz clic en "Gestionar Blog" en el dashboard
3. Haz clic en **"Crear Nuevo Post"**
4. Completa el formulario:
   - **Título**: El título principal del post
   - **Slug**: URL amigable (auto-generado desde el título, pero editable)
   - **Extracto**: Resumen corto que aparece en las tarjetas
   - **Contenido**: Contenido completo en Markdown
   - **Categoría**: Selecciona una categoría
   - **Tags**: Palabras clave separadas por comas
   - **Tiempo de lectura**: Minutos estimados
   - **Imagen**: Sube o selecciona una imagen
   - **Autor**: Nombre del autor (por defecto "Mailen Steinbrenner")
   - **Destacado**: Marca si quieres que aparezca en el home
   - **Publicado**: Desmarca para guardar como borrador
5. Haz clic en **"Guardar Post"** o **"Publicar"**

### Editar un post existente

1. En `/admin/blog`, encuentra el post en la lista
2. Haz clic en el botón **"Editar"** (ícono de lápiz)
3. Modifica los campos que necesites
4. Haz clic en **"Actualizar Post"**

### Eliminar un post

1. En `/admin/blog`, encuentra el post en la lista
2. Haz clic en el botón **"Eliminar"** (ícono de papelera)
3. Confirma la eliminación
4. El post será eliminado permanentemente

### Subir imágenes

**Opción 1: Subir nueva imagen**
1. En el formulario del post, haz clic en **"Elegir archivo"** en el campo de imagen
2. Selecciona una imagen de tu computadora (JPG, PNG, WebP, GIF)
3. La imagen se subirá automáticamente a Supabase Storage
4. La URL se guardará en el post

**Opción 2: Usar URL existente**
1. Si ya tienes la imagen en otro lugar, puedes pegar directamente la URL

### Ver preview del post

1. Mientras editas, puedes ver cómo se ve el contenido Markdown renderizado
2. También puedes abrir el post publicado en una nueva pestaña: `/blog/[slug]`

### Gestionar borradores

- Los posts marcados como **no publicados** (`is_published = false`) solo son visibles en el panel de admin
- No aparecerán en el blog público hasta que los marques como publicados
- Útil para trabajar en posts sin publicarlos inmediatamente

## 5. Formato de Contenido (Markdown)

El contenido de los posts usa Markdown. Aquí algunos ejemplos:

```markdown
# Título H1
## Título H2
### Título H3

**Texto en negrita**
*Texto en cursiva*

- Lista item 1
- Lista item 2
- Lista item 3

1. Lista numerada 1
2. Lista numerada 2

[Enlace](https://ejemplo.com)

> Cita o blockquote

---

Línea horizontal
```

## 6. Categorías Disponibles

Las categorías están predefinidas:
- Crianza Consciente
- Disciplina Positiva
- Gestión Emocional
- Desarrollo Infantil
- Vida Familiar
- Recursos y Herramientas

## 7. Troubleshooting

### No puedo subir imágenes
- Verifica que el bucket `blog-images` esté creado y sea público
- Verifica las políticas de Storage
- Asegúrate de estar autenticado
- Verifica que la imagen no supere el límite de tamaño (5MB)

### Los posts no aparecen en el blog público
- Verifica que `is_published` esté en `true`
- Verifica las políticas RLS de la tabla `blog_posts`
- Revisa la consola del navegador para errores

### Error al guardar post
- Verifica que el slug sea único
- Verifica que todos los campos requeridos estén completos
- Verifica que estés autenticado

### Las imágenes no se ven
- Verifica que el bucket sea público
- Verifica la URL de la imagen en la base de datos
- Verifica las políticas de lectura del bucket

## 8. Migrar Posts Existentes

Los 6 posts que ya estaban hardcodeados en el código se migrarán automáticamente al cargar la aplicación por primera vez después de configurar Supabase.

Si necesitas migrarlos manualmente, puedes usar el script SQL en `/supabase/migrations/create_blog_posts_table.sql` que ya incluye 2 posts de ejemplo. Puedes agregar los otros 4 siguiendo el mismo formato.

## 9. Backup y Exportación

Para hacer backup de tus posts:

1. Ve a **SQL Editor** en Supabase
2. Ejecuta:
```sql
SELECT * FROM blog_posts;
```
3. Haz clic en **Download CSV** para exportar todos los posts

## 10. Próximas Mejoras

- [ ] Editor WYSIWYG para Markdown
- [ ] Vista previa en tiempo real
- [ ] Programar publicaciones futuras
- [ ] Sistema de comentarios
- [ ] SEO: meta tags personalizados por post
- [ ] Analytics de posts más leídos
- [ ] Búsqueda de posts en el admin
- [ ] Filtros por categoría/tags en el admin
- [ ] Paginación en la lista de posts

## Soporte

Para cualquier problema, revisa:
- La consola del navegador (F12)
- Los logs de Supabase
- La documentación de Supabase: https://supabase.com/docs
