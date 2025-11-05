# Stores - Zustand State Management

Este directorio contiene las stores de Zustand para el manejo de estado global de la aplicación.

## 📚 Guide Store

La store `guide-store.ts` maneja el estado de los guides (guías) y sus autores para evitar múltiples requests innecesarios.

### Características

- **Caché de datos**: Los datos de los guides se almacenan una sola vez y se reutilizan
- **Paginación sincronizada**: Mantiene el estado de la página actual para cada guide
- **Sin re-renders innecesarios**: Solo se actualiza cuando cambia el estado
- **Múltiples guides**: Puede almacenar múltiples guides simultáneamente usando un Map

### Uso

```typescript
import { useGuideStore } from '@/stores/guide-store';

// En un componente
function MyComponent() {
  const setGuideData = useGuideStore((state) => state.setGuideData);
  const getGuideData = useGuideStore((state) => state.getGuideData);
  
  // Guardar datos del guide
  setGuideData(guideId, guide, author);
  
  // Obtener datos del guide
  const data = getGuideData(guideId);
}
```

### Hook Personalizado

Para facilitar el uso, existe el hook `useGuide` en `@/hooks/use-guide.ts`:

```typescript
import { useGuide } from '@/hooks/use-guide';

function GuideComponent({ guide, author }) {
  const { guide: storedGuide, author: storedAuthor } = useGuide({
    guideId: guide.id,
    guide,
    author,
  });
  
  // Los datos se almacenan automáticamente en la store
  // y se reutilizan en renders posteriores
}
```

## 🔄 Flujo de Paginación

### 1. Carga Inicial
- El servidor hace 1 solo request para obtener el guide y el autor
- Los datos se pasan al componente `GuideViewer`
- El hook `useGuide` guarda los datos en Zustand automáticamente

### 2. Navegación entre páginas
- Los cambios de página se reflejan en la URL: `?page=1`, `?page=2`, etc.
- No se hacen nuevos requests, se usan los datos de la store
- El componente lee el parámetro `page` de la URL y muestra la página correspondiente

### 3. Validación
- Si la página no existe (ej: `?page=999`), se muestra un mensaje de error
- Si no hay parámetro `?page`, se muestra la vista de presentación (overview)
- La paginación es exacta según el número de páginas del guide

## 🎯 Beneficios

1. **Performance**: Un solo request por guide, sin importar cuántas veces se navegue
2. **UX mejorada**: Navegación instantánea entre páginas
3. **URLs compartibles**: Los usuarios pueden compartir enlaces a páginas específicas
4. **Historial del navegador**: Los botones atrás/adelante funcionan correctamente
5. **Sin estado duplicado**: Una única fuente de verdad para los datos del guide

## 📝 API de la Store

### `setGuideData(guideId, guide, author)`
Guarda los datos de un guide en la store.

### `getGuideData(guideId)`
Obtiene los datos de un guide de la store (retorna `undefined` si no existe).

### `setCurrentPage(guideId, page)`
Actualiza la página actual de un guide específico.

### `getCurrentPage(guideId)`
Obtiene la página actual de un guide (retorna `1` por defecto).

### `clearGuide(guideId)`
Elimina un guide específico de la store.

### `clearAllGuides()`
Limpia todos los guides de la store.

## 🚀 Ejemplo Completo

```typescript
// page.tsx (Server Component)
export default async function GuidePage({ params }) {
  const { guideId } = await params;
  const guide = await GuideController.getGuideById(guideId);
  const author = await ProfileController.getProfileByUserId(guide.authorIds[0]);
  
  // Solo 1 request aquí ✅
  return <GuideViewer guide={guide} author={author} />;
}

// GuideViewer.tsx (Client Component)
"use client";

import { useGuide } from '@/hooks/use-guide';

export function GuideViewer({ guide, author }) {
  // Los datos se guardan automáticamente en Zustand
  const { guide: storedGuide, author: storedAuthor } = useGuide({
    guideId: guide.id,
    guide,
    author,
  });
  
  // Navegación sin nuevos requests ✅
  const handleNextPage = () => {
    router.push(`?page=${currentPage + 1}`);
  };
  
  return (
    // Renderizar guide...
  );
}
```

## 📦 Estructura de Datos

```typescript
interface GuideData {
  guide: GuideResponse;        // Datos completos del guide
  author: ProfileResponse;     // Datos del autor
  currentPage: number;         // Página actual (1-based)
}

interface GuideStore {
  guides: Map<string, GuideData>;  // Map de guideId -> GuideData
  // ... métodos
}
```
