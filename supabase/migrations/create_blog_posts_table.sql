-- =====================================================
-- CREAR TABLA DE BLOG POSTS
-- =====================================================

-- Crear la tabla blog_posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Mailen Steinbrenner',
  published_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW(),
  image_url TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  reading_time INTEGER NOT NULL DEFAULT 5,
  featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_date ON blog_posts(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_published ON blog_posts(is_published) WHERE is_published = TRUE;

-- Crear función para actualizar updated_date automáticamente
CREATE OR REPLACE FUNCTION update_blog_post_updated_date()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_date = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar updated_date
DROP TRIGGER IF EXISTS set_blog_post_updated_date ON blog_posts;
CREATE TRIGGER set_blog_post_updated_date
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_post_updated_date();

-- =====================================================
-- CONFIGURAR ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en la tabla
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede leer posts publicados (para el frontend público)
DROP POLICY IF EXISTS "Permitir lectura pública de posts publicados" ON blog_posts;
CREATE POLICY "Permitir lectura pública de posts publicados"
ON blog_posts
FOR SELECT
TO anon, authenticated
USING (is_published = TRUE);

-- Política: Usuarios autenticados pueden leer todos los posts (incluyendo drafts)
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer todos los posts" ON blog_posts;
CREATE POLICY "Usuarios autenticados pueden leer todos los posts"
ON blog_posts
FOR SELECT
TO authenticated
USING (true);

-- Política: Usuarios autenticados pueden insertar posts
DROP POLICY IF EXISTS "Usuarios autenticados pueden insertar posts" ON blog_posts;
CREATE POLICY "Usuarios autenticados pueden insertar posts"
ON blog_posts
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Política: Usuarios autenticados pueden actualizar posts
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar posts" ON blog_posts;
CREATE POLICY "Usuarios autenticados pueden actualizar posts"
ON blog_posts
FOR UPDATE
TO authenticated
USING (true);

-- Política: Usuarios autenticados pueden eliminar posts
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar posts" ON blog_posts;
CREATE POLICY "Usuarios autenticados pueden eliminar posts"
ON blog_posts
FOR DELETE
TO authenticated
USING (true);

-- =====================================================
-- CREAR BUCKET DE STORAGE PARA IMÁGENES DE BLOG
-- =====================================================

-- Nota: Esto debe hacerse desde el panel de Supabase Storage
-- Ve a Storage -> Create a new bucket -> "blog-images" (público)

-- =====================================================
-- INSERTAR DATOS DE EJEMPLO (POSTS EXISTENTES)
-- =====================================================

-- Post 1: Berrinches y Rabietas
INSERT INTO blog_posts (slug, title, excerpt, content, author, published_date, image_url, category, tags, reading_time, featured, is_published)
VALUES (
  'berrinches-y-rabietas-como-gestionarlos',
  'Berrinches y Rabietas: Cómo Gestionarlos con Amor y Firmeza',
  'Descubre estrategias efectivas para manejar los berrinches de tus hijos desde la crianza consciente, entendiendo las emociones detrás de cada rabieta.',
  '# Berrinches y Rabietas: Cómo Gestionarlos con Amor y Firmeza

Los berrinches son una parte normal del desarrollo infantil, pero eso no significa que sean fáciles de manejar. Como padres, a menudo nos sentimos frustrados, avergonzados o incluso impotentes ante una rabieta en medio del supermercado.

## ¿Por qué ocurren los berrinches?

Los berrinches son la forma en que los niños pequeños expresan sus emociones cuando aún no tienen las habilidades lingüísticas o de regulación emocional para hacerlo de otra manera. Algunas causas comunes incluyen:

- **Frustración**: No pueden hacer algo que quieren hacer
- **Cansancio o hambre**: Necesidades básicas no satisfechas
- **Necesidad de atención**: Buscan conexión con sus padres
- **Búsqueda de autonomía**: Quieren hacer las cosas a su manera
- **Sobrecarga sensorial**: Demasiados estímulos en el ambiente

## Estrategias para gestionar berrinches

### 1. Mantén la calma
Tu estado emocional influye directamente en tu hijo. Si te mantienes calmado, es más probable que tu hijo también se calme más rápido.

### 2. Valida sus emociones
En lugar de decir "No llores" o "No es para tanto", prueba con: "Veo que estás muy enojado. Es frustrante cuando no puedes tener lo que quieres."

### 3. Establece límites claros con amor
Los límites son importantes, pero la forma en que los comunicamos marca la diferencia. Combina firmeza con empatía: "Entiendo que quieres el dulce, y no vamos a comprarlo hoy. Sé que es difícil."

### 4. Ofrece opciones limitadas
Dar dos opciones ayuda al niño a sentir que tiene control: "¿Prefieres ponerte primero los zapatos o la chaqueta?"

### 5. Prevención
Muchos berrinches se pueden prevenir:
- Mantén rutinas predecibles
- Asegúrate de que estén descansados y alimentados
- Prepáralos para transiciones ("En 5 minutos nos vamos del parque")
- Evita situaciones de alto estrés cuando sea posible

## Lo que NO funciona

- **Castigar**: Los berrinches no son manipulación, son falta de habilidades
- **Ignorar completamente**: El niño necesita tu presencia y apoyo
- **Ceder siempre**: Esto enseña que los berrinches funcionan para conseguir lo que quieren
- **Gritar o amenazar**: Esto escalará la situación

## Después del berrinche

Una vez que tu hijo se haya calmado, es un buen momento para:
- Reconectar con un abrazo
- Hablar sobre lo que pasó (si el niño es lo suficientemente mayor)
- Enseñar estrategias para la próxima vez
- No guardar rencor ni castigar

## Recuerda

Los berrinches son una oportunidad para enseñar a tu hijo sobre emociones y regulación. Con paciencia, constancia y amor, esta etapa pasará y tu hijo habrá aprendido valiosas lecciones sobre cómo manejar sus sentimientos.

**La crianza consciente no significa que nunca habrá berrinches, significa que los manejaremos de una forma que construye conexión en lugar de romperla.**',
  'Mailen Steinbrenner',
  '2025-01-05',
  '/niños.jpg',
  'Gestión Emocional',
  ARRAY['berrinches', 'rabietas', 'gestión emocional', 'disciplina positiva'],
  6,
  TRUE,
  TRUE
) ON CONFLICT (slug) DO NOTHING;

-- Post 2: Límites con Amor
INSERT INTO blog_posts (slug, title, excerpt, content, author, published_date, image_url, category, tags, reading_time, featured, is_published)
VALUES (
  'limites-con-amor-y-respeto',
  'Límites con Amor y Respeto: La Base de la Disciplina Positiva',
  'Aprende a establecer límites claros y consistentes sin gritos ni castigos, creando un ambiente de respeto mutuo en tu hogar.',
  '# Límites con Amor y Respeto: La Base de la Disciplina Positiva

Uno de los mayores desafíos en la crianza consciente es encontrar el equilibrio entre ser firme y ser amoroso. Muchos padres temen que poner límites dañará la relación con sus hijos, mientras que otros piensan que sin castigos no habrá disciplina.

## ¿Por qué son importantes los límites?

Los límites no son restricciones arbitrarias, son:
- **Seguridad**: Protegen a los niños de peligros
- **Estructura**: Dan predictibilidad y seguridad emocional
- **Aprendizaje**: Enseñan sobre consecuencias y responsabilidad
- **Preparación**: Ayudan a funcionar en sociedad

## Principios para establecer límites efectivos

### 1. Sé claro y específico
En lugar de: "Pórtate bien"
Mejor: "Camina despacio dentro de casa. Puedes correr afuera."

### 2. Sé consistente
Los límites que cambian constantemente confunden a los niños y pierden efectividad.

### 3. Explica el "por qué"
Los niños cooperan más cuando entienden las razones: "No tocamos el horno porque está muy caliente y podemos lastimarnos."

### 4. Ofrece alternativas
"No puedes tirar juguetes. Puedes tirar esta pelota blanda o ayudarme a guardar los juguetes."

### 5. Mantén la calma
Un límite dicho con amor y firmeza es más efectivo que uno gritado con frustración.

## Recuerda

**Los límites sin relación generan rebelión. La relación sin límites genera caos. El equilibrio entre ambos genera niños seguros y capaces.**

La crianza consciente no es permisiva, es respetuosa. Los límites son un acto de amor, no de control.',
  'Mailen Steinbrenner',
  '2025-01-15',
  '/abrazos.jpg',
  'Disciplina Positiva',
  ARRAY['límites', 'disciplina positiva', 'consecuencias', 'respeto'],
  7,
  TRUE,
  TRUE
) ON CONFLICT (slug) DO NOTHING;

-- Más posts pueden ser insertados de la misma manera...

COMMENT ON TABLE blog_posts IS 'Tabla para almacenar los posts del blog de Crianzas Conscientes';
COMMENT ON COLUMN blog_posts.slug IS 'URL-friendly identifier único para cada post';
COMMENT ON COLUMN blog_posts.is_published IS 'Indica si el post está publicado o es un borrador';
COMMENT ON COLUMN blog_posts.featured IS 'Indica si el post debe aparecer destacado en el home';
