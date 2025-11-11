import { Injectable, signal } from '@angular/core';
import { BlogPost, BlogCategory } from '../models/blog-post.interface';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private posts = signal<BlogPost[]>(this.getInitialPosts());

  private getInitialPosts(): BlogPost[] {
    return [
      {
        id: '1',
        slug: 'berrinches-y-rabietas-como-gestionarlos',
        title: 'Berrinches y Rabietas: Cómo Gestionarlos con Amor y Firmeza',
        excerpt: 'Descubre estrategias efectivas para manejar los berrinches de tus hijos desde la crianza consciente, entendiendo las emociones detrás de cada rabieta.',
        content: `
# Berrinches y Rabietas: Cómo Gestionarlos con Amor y Firmeza

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

**La crianza consciente no significa que nunca habrá berrinches, significa que los manejaremos de una forma que construye conexión en lugar de romperla.**
        `,
        author: 'Mailen Steinbrenner',
        publishedDate: new Date('2025-01-05'),
        imageUrl: '/niños.jpg',
        category: BlogCategory.EMOCIONES,
        tags: ['berrinches', 'rabietas', 'gestión emocional', 'disciplina positiva'],
        readingTime: 6,
        featured: true
      },
      {
        id: '2',
        slug: 'limites-con-amor-y-respeto',
        title: 'Límites con Amor y Respeto: La Base de la Disciplina Positiva',
        excerpt: 'Aprende a establecer límites claros y consistentes sin gritos ni castigos, creando un ambiente de respeto mutuo en tu hogar.',
        content: `
# Límites con Amor y Respeto: La Base de la Disciplina Positiva

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

## Diferencia entre límites y castigos

| Límites | Castigos |
|---------|----------|
| Enseñan | Controlan |
| Se aplican con calma | Se dan con enojo |
| Son consecuencias lógicas | Son consecuencias arbitrarias |
| Mantienen la dignidad | Pueden humillar |
| Enseñan responsabilidad | Enseñan a evitar ser atrapado |

## Consecuencias naturales vs lógicas

**Consecuencias naturales**: Lo que ocurre naturalmente sin intervención
- Si no comes, tendrás hambre
- Si no te abrigas, sentirás frío

**Consecuencias lógicas**: Relacionadas directamente con la conducta
- Si tiras la comida, se acaba la comida (no un castigo no relacionado)
- Si no guardas los juguetes, no podrás usarlos mañana

## Cuando los niños desafían los límites

Es normal y saludable que los niños prueben los límites. Esto no significa que estés fallando como padre:

1. **Mantén el límite**: "Ya sé que no te gusta, y la respuesta sigue siendo no"
2. **Valida la emoción**: "Entiendo que estés enojado"
3. **No entres en debates**: Un "no" no necesita justificación infinita
4. **Ofrece conexión**: A veces los niños necesitan reconexión más que límites

## Límites apropiados según la edad

**1-3 años**: Pocos límites, claros y simples. Mucha redirección.
**3-6 años**: Más explicaciones. Involucrarlos en crear rutinas.
**6-12 años**: Pueden entender razones complejas. Involucrarlos en soluciones.
**Adolescentes**: Negociar límites. Dar más autonomía gradualmente.

## Recuerda

**Los límites sin relación generan rebelión. La relación sin límites genera caos. El equilibrio entre ambos genera niños seguros y capaces.**

La crianza consciente no es permisiva, es respetuosa. Los límites son un acto de amor, no de control.
        `,
        author: 'Mailen Steinbrenner',
        publishedDate: new Date('2025-01-15'),
        imageUrl: '/abrazos.jpg',
        category: BlogCategory.DISCIPLINA,
        tags: ['límites', 'disciplina positiva', 'consecuencias', 'respeto'],
        readingTime: 7,
        featured: true
      },
      {
        id: '3',
        slug: 'conectar-antes-de-corregir',
        title: 'Conectar Antes de Corregir: El Secreto de la Disciplina Efectiva',
        excerpt: 'La conexión emocional es la clave para que los niños escuchen y cooperen. Descubre cómo aplicar este principio fundamental.',
        content: `
# Conectar Antes de Corregir: El Secreto de la Disciplina Efectiva

"Conectar antes de corregir" es uno de los principios más poderosos de la crianza consciente. Cuando los niños se sienten conectados con nosotros, están mucho más dispuestos a cooperar y aprender.

## ¿Qué significa conectar antes de corregir?

Significa que antes de dar una lección, establecer un límite o corregir una conducta, primero nos aseguramos de que el niño se sienta visto, escuchado y comprendido.

## ¿Por qué funciona?

El cerebro de los niños funciona de manera diferente cuando se sienten seguros y conectados versus cuando se sienten amenazados o desconectados:

- **Cerebro conectado**: Puede razonar, aprender, cooperar
- **Cerebro desconectado**: Entra en modo supervivencia (lucha, huida o congelamiento)

## Cómo conectar antes de corregir

### 1. Bájate a su altura física
Arrodíllate o siéntate para estar al nivel de sus ojos. Esto reduce la sensación de amenaza y aumenta la conexión.

### 2. Haz contacto visual (si es cómodo para el niño)
El contacto visual libera oxitocina, la hormona de la conexión.

### 3. Usa un tono de voz calmado y firme
Tu tono comunica tanto o más que tus palabras.

### 4. Valida sus emociones primero
"Veo que estás muy frustrado" antes de "Pero no puedes golpear a tu hermano."

### 5. Escucha activamente
A veces los niños solo necesitan ser escuchados antes de poder escucharnos.

## Ejemplos prácticos

### Situación: Tu hijo de 4 años golpeó a su hermano

**Sin conexión**:
"¡No se pega! ¡Ve a tu cuarto ahora mismo!"

**Con conexión**:
[Te arrodillas a su altura]
"Veo que estás muy enojado con tu hermano. Golpear duele, y no está permitido. Cuando estés enojado, puedes usar palabras o venir a buscarme. ¿Qué pasó?"

### Situación: Tu hija de 6 años no quiere hacer la tarea

**Sin conexión**:
"¡Deja de quejarte y haz la tarea ya!"

**Con conexión**:
"Parece que no tienes ganas de hacer la tarea ahora. ¿Qué parte te resulta difícil? ¿Necesitas un descanso primero o prefieres que te ayude?"

### Situación: Tu hijo adolescente llegó tarde sin avisar

**Sin conexión**:
"¡Estás castigado! No sales el próximo fin de semana."

**Con conexión**:
"Estaba preocupado cuando no llegaste a la hora acordada. Necesito entender qué pasó antes de decidir qué hacer al respecto."

## Cuando la conexión es difícil

Habrá momentos en que tú también estés desregulado emocionalmente. Está bien:

1. **Reconócelo**: "Estoy muy enojado ahora y necesito calmarme"
2. **Toma un respiro**: "Voy a respirar un momento"
3. **Vuelve cuando estés más calmado**: "Hablemos de esto en 5 minutos"

## La conexión no es permisividad

Conectar NO significa:
- ✗ Ceder ante todas las demandas
- ✗ No tener límites
- ✗ Justificar conductas inapropiadas
- ✗ Evitar consecuencias

Conectar SÍ significa:
- ✓ Validar emociones mientras mantienes límites
- ✓ Ser firme y amable al mismo tiempo
- ✓ Ver la conducta como comunicación
- ✓ Enseñar en lugar de castigar

## Beneficios a largo plazo

Los niños que crecen con padres que conectan antes de corregir:
- Tienen mejor regulación emocional
- Desarrollan mayor empatía
- Tienen relaciones más saludables
- Son más resilientes
- Cooperan más naturalmente

## Recuerda

**"Los niños se portan mejor cuando se sienten mejor. Y se sienten mejor cuando se sienten conectados."**

La conexión es la base sobre la cual se construye toda disciplina efectiva y duradera.
        `,
        author: 'Mailen Steinbrenner',
        publishedDate: new Date('2025-01-25'),
        imageUrl: '/profesional.jpg',
        category: BlogCategory.CRIANZA,
        tags: ['conexión', 'disciplina positiva', 'comunicación', 'empatía'],
        readingTime: 6,
        featured: true
      },
      {
        id: '4',
        slug: 'rabietas-nocturnas-y-sueno',
        title: 'Rabietas Nocturnas y Problemas de Sueño: Guía para Padres Exhaustos',
        excerpt: 'Las noches difíciles pueden afectar a toda la familia. Aprende estrategias para manejar las rabietas nocturnas y mejorar el sueño de todos.',
        content: `
# Rabietas Nocturnas y Problemas de Sueño: Guía para Padres Exhaustos

Las rabietas nocturnas y los problemas de sueño son uno de los desafíos más agotadores de la crianza. Cuando estás exhausto y tu hijo se niega a dormir o se despierta con rabietas, mantener la calma puede parecer imposible.

## ¿Por qué ocurren las rabietas nocturnas?

Las rabietas a la hora de dormir o durante la noche pueden tener múltiples causas:

- **Sobrestimulación**: Demasiadas actividades durante el día
- **Falta de rutina**: Horarios inconsistentes
- **Ansiedad por separación**: Miedo a estar solo
- **Necesidades no satisfechas**: Hambre, sed, necesidad de conexión
- **Demasiado cansancio**: Paradójicamente, estar demasiado cansado dificulta dormir

## Prevención: La rutina de sueño

Una rutina predecible es tu mejor aliada:

### Ejemplo de rutina (ajustar según edad):

**19:00** - Cena tranquila
**19:30** - Baño relajante
**20:00** - Pijama y cepillado de dientes
**20:15** - Cuento y tiempo de conexión
**20:30** - Apagar luces, canción de cuna o música suave
**20:45** - Dormir

### Claves para una rutina exitosa:

1. **Consistencia**: Misma secuencia, misma hora (tanto como sea posible)
2. **Tiempo de conexión**: 10-15 minutos de atención plena antes de dormir
3. **Ambiente adecuado**: Cuarto oscuro, temperatura fresca, sin pantallas
4. **Señales de sueño**: Aprende a reconocer cuando tu hijo está cansado
5. **Tiempo de "bajada"**: Al menos 1 hora de actividades tranquilas antes de dormir

## Cuando ocurre la rabieta nocturna

### 1. Mantén la calma (lo más difícil)
Tu estado emocional afecta directamente al niño. Respira profundo.

### 2. Mantén las luces bajas
La luz brillante estimula el cerebro y dificulta volver a dormir.

### 3. Usa voz suave y movimientos lentos
Habla en susurros, muévete despacio, mantén todo tranquilo.

### 4. Valida sin estimular
"Veo que estás molesto. Es hora de dormir. Estoy aquí contigo."

### 5. Mantén el límite con amor
"Entiendo que no quieres dormir, y tu cuerpo necesita descansar. Puedes estar enojado, y vamos a quedarnos en la cama."

### 6. Ofrece presencia
A veces solo necesitan saber que estás ahí. Puedes quedarte sentado cerca hasta que se calmen.

## Estrategias según la edad

### Bebés (0-12 meses)
- Responde rápido a sus necesidades
- Crea asociaciones positivas con dormir
- No esperes que "se acostumbren" a llorar solos

### Niños pequeños (1-3 años)
- Rutina muy consistente
- Objeto de transición (peluche, mantita)
- Validación de emociones: "Sé que quieres quedarte despierto"

### Preescolares (3-5 años)
- Explicar por qué dormimos
- Rutina visual (imágenes de cada paso)
- Técnicas de relajación simples (respiración)

### Escolares (6+ años)
- Involucrarlos en crear la rutina
- Enseñar técnicas de relajación
- Hablar sobre preocupaciones antes de dormir

## Errores comunes a evitar

1. **Ceder inconsistentemente**: "Solo por hoy" se convierte en todas las noches
2. **Usar pantallas para calmar**: La luz azul interfiere con la melatonina
3. **Actividades estimulantes cerca de dormir**: Juegos activos, discusiones
4. **Castigar por no dormir**: El sueño no es voluntario
5. **Comparar con otros niños**: Cada niño tiene necesidades diferentes

## Cuando las rabietas nocturnas son persistentes

Si las rabietas nocturnas continúan a pesar de tus esfuerzos, considera:

- **Revisar la salud**: Apnea del sueño, reflujo, alergias
- **Revisar el ambiente**: Ruido, temperatura, comodidad del colchón
- **Evaluar el horario**: ¿Duerme suficientes siestas? ¿Demasiado tarde?
- **Revisar la dieta**: Cafeína, azúcar, alergias alimentarias
- **Considerar factores emocionales**: Cambios en la familia, estrés
- **Buscar apoyo profesional**: Consultor de sueño, pediatra, terapeuta

## Cuidado propio para padres

No puedes verter de una taza vacía. Si estás exhausto:

- **Túrnate con tu pareja** si es posible
- **Pide ayuda** a familia o amigos
- **Duerme cuando puedas**, incluso siestas cortas
- **Sé compasivo contigo mismo**: Hacer tu mejor esfuerzo es suficiente
- **Busca apoyo**: Grupos de padres, terapia, coaching

## Recuerda

**Esto es temporal. Tu hijo aprenderá a dormir. Mientras tanto, responde con amor y paciencia, estableciendo límites firmes pero amables.**

Las noches difíciles no durarán para siempre. Cada niño aprende a regular su sueño a su propio ritmo.
        `,
        author: 'Mailen Steinbrenner',
        publishedDate: new Date('2025-02-01'),
        imageUrl: '/Fondo.jpeg',
        category: BlogCategory.FAMILIA,
        tags: ['sueño', 'rabietas nocturnas', 'rutinas', 'descanso'],
        readingTime: 7
      },
      {
        id: '5',
        slug: 'crianza-consciente-que-es',
        title: '¿Qué es la Crianza Consciente? Guía para Empezar',
        excerpt: 'Descubre los fundamentos de la crianza consciente y cómo empezar a aplicarla en tu día a día con tus hijos.',
        content: `
# ¿Qué es la Crianza Consciente? Guía para Empezar

Si estás leyendo esto, probablemente has escuchado el término "crianza consciente" y te preguntas qué significa realmente y cómo puede ayudarte en tu relación con tus hijos.

## ¿Qué es la Crianza Consciente?

La crianza consciente (también conocida como crianza respetuosa o mindful parenting) es un enfoque que se centra en:

- **Estar presente**: Prestar atención plena a tus hijos y a ti mismo
- **Ser intencional**: Actuar según tus valores, no por reacción
- **Cultivar la conexión**: Priorizar la relación sobre la obediencia
- **Respetar las emociones**: Validar los sentimientos propios y de los niños
- **Enseñar, no castigar**: Ver las conductas como oportunidades de aprendizaje

## Lo que NO es la Crianza Consciente

Es importante aclarar algunos mitos:

- ❌ **No es permisividad**: Los límites son fundamentales
- ❌ **No es perfección**: Todos cometemos errores
- ❌ **No es sacrificio total**: El autocuidado es esencial
- ❌ **No es una receta única**: Cada familia es diferente
- ❌ **No es solo para cierto tipo de familias**: Es para todos

## Principios Fundamentales

### 1. Conexión antes que corrección
Los niños cooperan mejor cuando se sienten conectados. La relación es lo primero.

### 2. Regulación emocional
No puedes enseñar calma desde el descontrol. Primero cuida tu propio estado emocional.

### 3. Límites con amor
Firme y amable al mismo tiempo. Los límites son un acto de amor, no de control.

### 4. Ver la conducta como comunicación
Detrás de cada conducta hay una necesidad. Descubre qué está tratando de comunicar tu hijo.

### 5. Enfoque en soluciones a largo plazo
Enseñar habilidades de vida, no solo lograr obediencia inmediata.

## Diferencias con la Crianza Tradicional

| Crianza Tradicional | Crianza Consciente |
|---------------------|-------------------|
| Obediencia ciega | Colaboración |
| Castigos | Consecuencias lógicas |
| "Porque lo digo yo" | Explicaciones razonables |
| Control | Guía |
| Niño como problema | Niño como persona en desarrollo |
| Enfoque en conducta | Enfoque en conexión |

## Cómo Empezar (Pasos Prácticos)

### Paso 1: Autoconsciencia
Antes de cambiar cómo crías, necesitas entender:
- ¿Cómo te criaron a ti?
- ¿Qué patrones estás repitiendo?
- ¿Cuáles son tus disparadores emocionales?
- ¿Qué valores quieres transmitir?

### Paso 2: Pausa antes de reaccionar
Cuando sientas que vas a reaccionar:
1. Respira profundo
2. Identifica tu emoción
3. Pregúntate: "¿Qué necesita mi hijo ahora?"
4. Responde desde la calma

### Paso 3: Cambia el diálogo interno
En lugar de: "¿Por qué siempre hace esto?"
Prueba: "¿Qué está tratando de comunicarme?"

### Paso 4: Pequeños cambios consistentes
No intentes cambiarlo todo a la vez. Elige un área para trabajar:
- Las mañanas
- La hora de dormir
- Las comidas
- Los berrinches

### Paso 5: Busca apoyo
- Lee libros sobre crianza consciente
- Únete a grupos de padres con mentalidad similar
- Considera coaching o terapia
- Sé compasivo contigo mismo en el proceso

## Herramientas Básicas

### 1. El "Time-In" (en lugar del "Time-Out")
En lugar de aislar al niño, ofrece conexión y ayuda para regular emociones.

### 2. Validación emocional
"Veo que estás frustrado" antes de corregir conducta.

### 3. Opciones limitadas
Dar autonomía dentro de límites: "¿Prefieres bañarte ahora o en 5 minutos?"

### 4. Consecuencias lógicas
Relacionadas con la conducta, no castigos arbitrarios.

### 5. Reparación
Cuando te equivoques (y lo harás), discúlpate y repara la relación.

## Desafíos Comunes

### "Pero mi familia no entiende"
- Explica tus valores claramente
- Establece límites sobre cómo otros interactúan con tus hijos
- Busca apoyo en comunidades afines

### "Me siento culpable por cómo he criado hasta ahora"
- La culpa no sirve, la autocompasión sí
- Cada día es una oportunidad nueva
- Los niños son resilientes

### "A veces pierdo la paciencia"
- Eres humano
- Repara cuando te equivoques
- Busca las razones de tu desregulación (estrés, cansancio, etc.)

### "Toma mucho tiempo"
- Al principio sí, eventualmente se vuelve natural
- La inversión en la relación ahorra tiempo a largo plazo
- Los atajos del castigo no son realmente más rápidos

## Beneficios de la Crianza Consciente

### Para los niños:
- Mejor regulación emocional
- Mayor autoestima
- Habilidades de resolución de problemas
- Relaciones más saludables
- Menos ansiedad y depresión

### Para los padres:
- Menos estrés y culpa
- Más disfrute de la crianza
- Mejor relación con tus hijos
- Crecimiento personal
- Hogar más pacífico

## Recursos para Continuar

**Libros recomendados:**
- "El cerebro del niño" - Daniel Siegel
- "Cómo hablar para que los niños escuchen" - Adele Faber
- "Disciplina sin lágrimas" - Daniel Siegel

**Siguiente paso:**
Descarga mi guía gratuita con estrategias prácticas para empezar hoy mismo con la crianza consciente.

## Recuerda

**La crianza consciente no se trata de ser perfectos, se trata de estar presentes. No se trata de nunca cometer errores, sino de repararlos cuando ocurren.**

Cada pequeño cambio que hagas hacia una crianza más consciente es un regalo para tus hijos y para ti mismo.

¿Lista para empezar este viaje? Estoy aquí para acompañarte.
        `,
        author: 'Mailen Steinbrenner',
        publishedDate: new Date('2025-02-10'),
        imageUrl: '/yo.jpeg',
        category: BlogCategory.CRIANZA,
        tags: ['crianza consciente', 'introducción', 'fundamentos', 'guía'],
        readingTime: 8,
        featured: false
      },
      {
        id: '6',
        slug: 'como-manejar-tu-estres-parental',
        title: 'Cómo Manejar Tu Propio Estrés: El Autocuidado No es Egoísmo',
        excerpt: 'No puedes verter de una taza vacía. Aprende estrategias prácticas de autocuidado para ser el padre o madre que quieres ser.',
        content: `
# Cómo Manejar Tu Propio Estrés: El Autocuidado No es Egoísmo

Uno de los secretos mejor guardados de la crianza consciente es este: **No puedes regular a tu hijo si no estás regulado tú mismo.**

## El mito del padre/madre perfecto

Vivimos en una cultura que glorifica el sacrificio parental total. Se espera que los padres (especialmente las madres) se entreguen completamente a sus hijos, dejando de lado sus propias necesidades.

Pero la verdad es: **Un padre agotado, estresado y resentido no puede criar con consciencia.**

## Señales de agotamiento parental

¿Te identificas con alguna de estas?

- ✓ Gritas más de lo que quisieras
- ✓ Te sientes irritable constantemente
- ✓ Fantaseas con escaparte
- ✓ Sientes culpa o vergüenza por cómo estás criando
- ✓ No recuerdas la última vez que hiciste algo para ti
- ✓ Te sientes resentido con tus hijos o pareja
- ✓ Estás físicamente exhausto todo el tiempo
- ✓ Has perdido la paciencia con cosas pequeñas

Si marcaste varias, probablemente necesitas priorizar tu autocuidado.

## Por qué el autocuidado NO es egoísmo

Cuando cuidas de ti mismo:
- Tienes más paciencia con tus hijos
- Puedes manejar mejor el estrés
- Modelas el autocuidado para tus hijos
- Tienes más energía para disfrutar la crianza
- Eres más creativo en la resolución de problemas

**El autocuidado no te aleja de ser buen padre, te permite serlo.**

## Estrategias de regulación en el momento

Cuando sientes que estás a punto de explotar:

### 1. La pausa sagrada
"Necesito un minuto para calmarme. Vuelvo enseguida."

### 2. Respiración 4-7-8
- Inhala por 4 segundos
- Sostén por 7 segundos
- Exhala por 8 segundos
- Repite 3-4 veces

### 3. Cambio físico
- Lávate la cara con agua fría
- Sal afuera 2 minutos
- Estira el cuerpo
- Toma agua

### 4. Autocompasión
En lugar de: "Soy terrible como padre"
Prueba: "Esto es difícil. Estoy haciendo lo mejor que puedo."

### 5. Pedir ayuda
"¿Puedes ocuparte de los niños 10 minutos?"

## Autocuidado diario (no negociable)

### Necesidades básicas
Parece obvio, pero muchos padres descuidan:
- **Dormir** suficiente (o tanto como sea posible)
- **Comer** comidas nutritivas regularmente
- **Agua**: La deshidratación aumenta la irritabilidad
- **Movimiento**: Aunque sean 10 minutos

### Micro-momentos de autocuidado

No necesitas horas libres. Puedes cuidarte en pequeños momentos:

- **5 minutos**: Taza de té en silencio
- **10 minutos**: Ducha sin interrupciones
- **15 minutos**: Lectura, meditación, música
- **20 minutos**: Caminata, estiramiento, llamada a un amigo

### Actividades semanales

Intenta incluir al menos una vez por semana:
- Actividad que disfrutes (hobby, ejercicio, creatividad)
- Conexión social con adultos
- Algo solo para ti, sin niños

## Reducir el estrés en la fuente

### 1. Simplifica
- Menos actividades extracurriculares
- Rutinas más simples
- Bajar expectativas de perfección

### 2. Delega
- No tienes que hacerlo todo
- Pide ayuda específica
- Comparte la carga mental con tu pareja

### 3. Di "no" más seguido
- A compromisos que no sirven a tu familia
- A expectativas externas
- A la culpa

### 4. Ajusta expectativas
- Las casas con niños están desordenadas
- No todas las comidas serán gourmet
- Está bien el tiempo de pantalla ocasional

## Cuando el estrés es abrumador

Si el estrés parental está interfiriendo significativamente con tu vida, considera:

### Señales de que necesitas ayuda profesional:
- Pensamientos de hacerte daño o dañar a otros
- Depresión o ansiedad persistente
- Incapacidad de disfrutar nada
- Problemas para funcionar diariamente
- Uso de sustancias para afrontar

### Recursos:
- **Terapia individual**: Para trabajar tus propios temas
- **Terapia de pareja**: Si la crianza está afectando la relación
- **Grupos de apoyo**: Compartir con otros padres
- **Coaching de crianza**: Estrategias específicas para desafíos parentales
- **Evaluación médica**: Depresión postparto, ansiedad, etc.

## Trabaja en tu propia sanación

Muchas veces reaccionamos con nuestros hijos basándonos en nuestras propias heridas:

- **Reflexiona**: ¿Qué de tu propia crianza te dispara?
- **Sana**: Trabaja en tus propios traumas
- **Rompe ciclos**: Decide conscientemente qué no repetir
- **Ten compasión**: Por el niño que fuiste y el padre que eres

## Involucra a tu pareja

Si tienes pareja:
- **Comunica tus necesidades** claramente
- **Turnen el autocuidado**: "Sábado yo, domingo tú"
- **Comparten la carga mental**: No solo las tareas
- **Apoyen mutuamente**: Permitan descansos sin culpa

## El oxígeno primero

Recuerda las instrucciones de seguridad en los aviones: **Ponte tu máscara de oxígeno primero.**

No porque tus hijos no importen, sino porque si te desmayas, no podrás ayudarlos.

## Permiso para cuidarte

Si necesitas escucharlo de alguien, aquí está:

**Tienes permiso para:**
- Tomar un descanso
- Pedir ayuda
- No ser perfecto
- Priorizar tu bienestar
- Disfrutar tiempo sin tus hijos
- Cuidar de ti mismo

## Práctica para esta semana

Elige UNA cosa que harás para cuidarte esta semana:
- [ ] Dormir 30 minutos más
- [ ] Salir a caminar solo/a
- [ ] Llamar a un amigo
- [ ] Tomar 10 minutos de silencio diario
- [ ] Pedir ayuda con una tarea específica

## Recuerda

**Criar con consciencia requiere que estés presente. Y no puedes estar presente si estás agotado, resentido o desregulado.**

El autocuidado no es un lujo, es una necesidad. No es egoísmo, es responsabilidad.

Cuídate para poder cuidar. Es así de simple, y así de importante.
        `,
        author: 'Mailen Steinbrenner',
        publishedDate: new Date('2025-02-20'),
        imageUrl: '/mini_mai.png',
        category: BlogCategory.FAMILIA,
        tags: ['autocuidado', 'estrés parental', 'regulación emocional', 'bienestar'],
        readingTime: 8,
        featured: false
      }
    ];
  }

  // Get all posts
  getAllPosts(): BlogPost[] {
    return this.posts();
  }

  // Get featured posts
  getFeaturedPosts(): BlogPost[] {
    return this.posts().filter(post => post.featured);
  }

  // Get post by slug
  getPostBySlug(slug: string): BlogPost | undefined {
    return this.posts().find(post => post.slug === slug);
  }

  // Get posts by category
  getPostsByCategory(category: BlogCategory): BlogPost[] {
    return this.posts().filter(post => post.category === category);
  }

  // Get posts by tag
  getPostsByTag(tag: string): BlogPost[] {
    return this.posts().filter(post =>
      post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }

  // Get recent posts
  getRecentPosts(limit: number = 3): BlogPost[] {
    return this.posts()
      .sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime())
      .slice(0, limit);
  }

  // Get all categories
  getAllCategories(): BlogCategory[] {
    return Object.values(BlogCategory);
  }

  // Get all unique tags
  getAllTags(): string[] {
    const tags = new Set<string>();
    this.posts().forEach(post => {
      post.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }
}
