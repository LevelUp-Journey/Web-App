# Custom Hooks para Challenges

Hooks personalizados para gestionar la lógica de guardado automático y envío de soluciones en el editor de código.

## 📋 Tabla de Contenidos

- [useAutoSave](#useautosave)
- [useSubmitSolution](#usesubmitsolution)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Buenas Prácticas](#buenas-prácticas)

## useAutoSave

Hook para gestionar el auto-guardado de contenido con debounce, prevención de fugas de memoria y manejo robusto de errores.

### API

```tsx
function useAutoSave(options: UseAutoSaveOptions): UseAutoSaveReturn
```

### Parámetros

```tsx
interface UseAutoSaveOptions {
  /** Función que realiza el guardado */
  onSave: (content: string) => Promise<void>;
  
  /** Contenido inicial */
  initialContent: string;
  
  /** Delay en milisegundos para el auto-guardado (default: 3000) */
  delay?: number;
  
  /** Si está habilitado el auto-guardado (default: true) */
  enabled?: boolean;
}
```

### Retorno

```tsx
interface UseAutoSaveReturn {
  /** Estado actual del guardado: 'idle' | 'saving' | 'saved' | 'error' */
  saveStatus: SaveStatus;
  
  /** Indica si está guardando manualmente */
  isManualSaving: boolean;
  
  /** Indica si hay cambios sin guardar */
  hasUnsavedChanges: boolean;
  
  /** Función para guardar manualmente */
  saveManually: () => Promise<void>;
  
  /** Función para actualizar el contenido */
  updateContent: (content: string) => void;
  
  /** Contenido actual */
  content: string;
}
```

### Ejemplo Básico

```tsx
import { useAutoSave } from '@/hooks/challenges/use-auto-save';
import { toast } from 'sonner';

function CodeEditor() {
  const {
    content,
    updateContent,
    saveStatus,
    isManualSaving,
    hasUnsavedChanges,
    saveManually
  } = useAutoSave({
    initialContent: "console.log('Hello World');",
    onSave: async (code) => {
      await fetch('/api/save', {
        method: 'POST',
        body: JSON.stringify({ code })
      });
    },
    delay: 3000
  });

  const handleManualSave = async () => {
    try {
      await saveManually();
      toast.success('Guardado exitoso!');
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  return (
    <div>
      <textarea 
        value={content}
        onChange={(e) => updateContent(e.target.value)}
      />
      
      {saveStatus === 'saving' && (
        <span>Guardando...</span>
      )}
      
      <button 
        onClick={handleManualSave}
        disabled={!hasUnsavedChanges || isManualSaving}
      >
        {isManualSaving ? 'Guardando...' : 'Guardar'}
      </button>
    </div>
  );
}
```

### Características

- ✅ **Debounce automático**: Evita múltiples guardados innecesarios
- ✅ **Cancelación de requests**: Usa AbortController para cancelar requests pendientes
- ✅ **Detección de cambios**: Solo guarda si hay cambios reales
- ✅ **Guardado manual**: Opción para guardar inmediatamente
- ✅ **Estados tipados**: TypeScript completo
- ✅ **Cleanup automático**: Previene fugas de memoria
- ✅ **Habilitación condicional**: Puede deshabilitarse dinámicamente

---

## useSubmitSolution

Hook para manejar el envío de soluciones y la ejecución de tests con estados claros y callbacks.

### API

```tsx
function useSubmitSolution(options: UseSubmitSolutionOptions): UseSubmitSolutionReturn
```

### Parámetros

```tsx
interface UseSubmitSolutionOptions {
  /** Función que realiza el envío de la solución */
  onSubmit: () => Promise<SubmitSolutionResponse>;
  
  /** Callback cuando el envío es exitoso */
  onSuccess?: (result: SubmitSolutionResponse) => void;
  
  /** Callback cuando hay un error */
  onError?: (error: Error) => void;
}
```

### Retorno

```tsx
interface UseSubmitSolutionReturn {
  /** Estado actual del envío: 'idle' | 'submitting' | 'success' | 'error' */
  submitStatus: SubmitStatus;
  
  /** Resultado del último envío */
  submitResult: SubmitSolutionResponse | null;
  
  /** Indica si está enviando */
  isSubmitting: boolean;
  
  /** Función para enviar la solución */
  submit: () => Promise<void>;
  
  /** Función para resetear el estado */
  reset: () => void;
}
```

### Ejemplo Básico

```tsx
import { useSubmitSolution } from '@/hooks/challenges/use-submit-solution';
import { toast } from 'sonner';

function SolutionSubmitter({ solutionId }) {
  const {
    submit,
    isSubmitting,
    submitResult,
    submitStatus,
    reset
  } = useSubmitSolution({
    onSubmit: async () => {
      const response = await fetch(`/api/solutions/${solutionId}/submit`, {
        method: 'POST'
      });
      return response.json();
    },
    onSuccess: (result) => {
      toast.success(`${result.passedTests}/${result.totalTests} tests pasados!`);
    },
    onError: (error) => {
      toast.error('Error al enviar la solución');
      console.error(error);
    }
  });

  return (
    <div>
      <button 
        onClick={submit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Ejecutando...' : 'Ejecutar Tests'}
      </button>

      {submitResult && (
        <div>
          <h3>Resultados:</h3>
          <p>Tests pasados: {submitResult.passedTests}/{submitResult.totalTests}</p>
          <p>Tiempo: {submitResult.timeTaken}ms</p>
          
          {submitResult.passedTests === submitResult.totalTests ? (
            <p className="text-green-600">¡Todos los tests pasaron!</p>
          ) : (
            <p className="text-red-600">Algunos tests fallaron</p>
          )}
        </div>
      )}

      {submitStatus === 'error' && (
        <button onClick={reset}>Reintentar</button>
      )}
    </div>
  );
}
```

### Características

- ✅ **Estados claros**: Estados bien definidos para cada fase
- ✅ **Prevención de múltiples envíos**: No permite envíos simultáneos
- ✅ **Callbacks flexibles**: Maneja éxito y error por separado
- ✅ **Reseteo de estado**: Función para limpiar resultados
- ✅ **TypeScript completo**: Tipado fuerte en toda la API
- ✅ **Auto-reseteo**: Vuelve a idle después de 2 segundos

---

## Ejemplos de Uso

### Ejemplo 1: Editor de Markdown con Auto-guardado

```tsx
import { useAutoSave } from '@/hooks/challenges/use-auto-save';
import { useState } from 'react';

function MarkdownEditor({ documentId, initialContent }) {
  const [previewMode, setPreviewMode] = useState(false);
  
  const {
    content,
    updateContent,
    saveStatus,
    hasUnsavedChanges
  } = useAutoSave({
    initialContent,
    onSave: async (markdown) => {
      await fetch(`/api/documents/${documentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: markdown })
      });
    },
    delay: 2000 // 2 segundos
  });

  return (
    <div>
      <header>
        <button onClick={() => setPreviewMode(!previewMode)}>
          {previewMode ? 'Editar' : 'Vista Previa'}
        </button>
        
        {hasUnsavedChanges && (
          <span className="text-yellow-600">● Cambios sin guardar</span>
        )}
        
        {saveStatus === 'saved' && (
          <span className="text-green-600">✓ Guardado</span>
        )}
      </header>

      {previewMode ? (
        <MarkdownPreview content={content} />
      ) : (
        <textarea
          value={content}
          onChange={(e) => updateContent(e.target.value)}
          placeholder="Escribe tu markdown aquí..."
        />
      )}
    </div>
  );
}
```

### Ejemplo 2: Combinar Ambos Hooks

```tsx
import { useAutoSave } from '@/hooks/challenges/use-auto-save';
import { useSubmitSolution } from '@/hooks/challenges/use-submit-solution';

function CompleteCodeEditor({ solutionId, initialCode }) {
  // Auto-guardado del código
  const {
    content: code,
    updateContent: setCode,
    saveStatus,
    saveManually
  } = useAutoSave({
    initialContent: initialCode,
    onSave: async (code) => {
      await updateSolution(solutionId, code);
    },
    delay: 3000
  });

  // Envío de solución
  const {
    submit,
    isSubmitting,
    submitResult
  } = useSubmitSolution({
    onSubmit: async () => {
      // Asegurar que esté guardado antes de enviar
      await saveManually();
      return await submitSolution(solutionId);
    },
    onSuccess: (result) => {
      if (result.passedTests === result.totalTests) {
        confetti(); // ¡Celebrar!
      }
    }
  });

  const canSubmit = !isSubmitting && saveStatus !== 'saving';

  return (
    <div>
      <CodeEditor value={code} onChange={setCode} />
      
      <div className="actions">
        <span>
          {saveStatus === 'saving' && '💾 Guardando...'}
          {saveStatus === 'saved' && '✓ Guardado'}
        </span>

        <button onClick={submit} disabled={!canSubmit}>
          {isSubmitting ? '⚡ Ejecutando...' : '▶ Ejecutar'}
        </button>
      </div>

      {submitResult && (
        <TestResults results={submitResult} />
      )}
    </div>
  );
}
```

### Ejemplo 3: Hook Personalizado Combinado

```tsx
// Crear un hook personalizado que combine ambos
import { useAutoSave } from '@/hooks/challenges/use-auto-save';
import { useSubmitSolution } from '@/hooks/challenges/use-submit-solution';

export function useCodeChallenge({ solutionId, initialCode }) {
  const autoSave = useAutoSave({
    initialContent: initialCode,
    onSave: async (code) => {
      await api.updateSolution(solutionId, code);
    }
  });

  const submission = useSubmitSolution({
    onSubmit: async () => {
      await autoSave.saveManually();
      return await api.submitSolution(solutionId);
    }
  });

  return {
    // Código
    code: autoSave.content,
    setCode: autoSave.updateContent,
    
    // Guardado
    saveStatus: autoSave.saveStatus,
    hasUnsavedChanges: autoSave.hasUnsavedChanges,
    
    // Envío
    submit: submission.submit,
    isSubmitting: submission.isSubmitting,
    results: submission.submitResult,
    
    // Estado general
    isBusy: autoSave.isManualSaving || submission.isSubmitting
  };
}

// Uso
function Challenge() {
  const {
    code,
    setCode,
    submit,
    results,
    isBusy
  } = useCodeChallenge({
    solutionId: '123',
    initialCode: 'function solution() {}'
  });

  return (
    <div>
      <Editor value={code} onChange={setCode} />
      <button onClick={submit} disabled={isBusy}>Run</button>
      {results && <Results data={results} />}
    </div>
  );
}
```

---

## Buenas Prácticas

### 1. Siempre Manejar Errores

```tsx
const { saveManually } = useAutoSave({
  onSave: async (content) => {
    // Siempre lanzar errores para que el hook los maneje
    const response = await fetch('/api/save', {
      method: 'POST',
      body: JSON.stringify({ content })
    });
    
    if (!response.ok) {
      throw new Error('Failed to save');
    }
  }
});

// En el componente
const handleSave = async () => {
  try {
    await saveManually();
    toast.success('Guardado!');
  } catch (error) {
    toast.error('Error al guardar');
    // Logging adicional si es necesario
    console.error(error);
  }
};
```

### 2. Validar Antes de Guardar

```tsx
const {
  updateContent,
  saveManually
} = useAutoSave({
  onSave: async (content) => {
    // Validar antes de enviar
    if (!content.trim()) {
      throw new Error('Content cannot be empty');
    }
    
    await api.save(content);
  }
});
```

### 3. Usar Estados Derivados

```tsx
const { saveStatus, isManualSaving, submitStatus } = useHooks();

// Derivar estados compuestos
const isBusy = isManualSaving || submitStatus === 'submitting';
const hasError = saveStatus === 'error' || submitStatus === 'error';
const isSuccess = saveStatus === 'saved' && submitStatus === 'success';
```

### 4. Limpiar Estado Cuando Sea Necesario

```tsx
const { reset } = useSubmitSolution({...});

// Limpiar al cambiar de challenge
useEffect(() => {
  return () => {
    reset();
  };
}, [challengeId, reset]);
```

### 5. Deshabilitar Auto-guardado Condicionalmente

```tsx
const [isReadOnly, setIsReadOnly] = useState(false);

const { ... } = useAutoSave({
  enabled: !isReadOnly, // No auto-guardar en modo lectura
  onSave: async (content) => {
    await api.save(content);
  }
});
```

---

## Testing

### Testear useAutoSave

```tsx
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAutoSave } from './use-auto-save';

describe('useAutoSave', () => {
  it('should auto-save after delay', async () => {
    const onSave = jest.fn().mockResolvedValue(undefined);
    
    const { result } = renderHook(() =>
      useAutoSave({
        initialContent: 'initial',
        onSave,
        delay: 100
      })
    );

    act(() => {
      result.current.updateContent('updated');
    });

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith('updated');
    }, { timeout: 200 });
  });

  it('should detect unsaved changes', () => {
    const { result } = renderHook(() =>
      useAutoSave({
        initialContent: 'initial',
        onSave: jest.fn()
      })
    );

    expect(result.current.hasUnsavedChanges).toBe(false);

    act(() => {
      result.current.updateContent('changed');
    });

    expect(result.current.hasUnsavedChanges).toBe(true);
  });
});
```

### Testear useSubmitSolution

```tsx
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSubmitSolution } from './use-submit-solution';

describe('useSubmitSolution', () => {
  it('should submit and handle success', async () => {
    const mockResult = { passedTests: 5, totalTests: 5 };
    const onSubmit = jest.fn().mockResolvedValue(mockResult);
    const onSuccess = jest.fn();

    const { result } = renderHook(() =>
      useSubmitSolution({ onSubmit, onSuccess })
    );

    await act(async () => {
      await result.current.submit();
    });

    expect(onSubmit).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalledWith(mockResult);
    expect(result.current.submitResult).toEqual(mockResult);
  });

  it('should prevent multiple submissions', async () => {
    const onSubmit = jest.fn().mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    const { result } = renderHook(() =>
      useSubmitSolution({ onSubmit })
    );

    act(() => {
      result.current.submit();
      result.current.submit(); // Segundo intento
    });

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1); // Solo llamado una vez
    });
  });
});
```

---

## Troubleshooting

### Problema: Auto-guardado no funciona

**Solución**: Verificar que `enabled` esté en `true` y que haya cambios reales.

```tsx
const { hasUnsavedChanges } = useAutoSave({
  enabled: true, // ✓
  // ...
});

console.log('Has changes?', hasUnsavedChanges);
```

### Problema: Fugas de memoria

**Solución**: Los hooks ya manejan cleanup automáticamente. Asegurar que no se estén creando referencias circulares.

### Problema: Delay no funciona como esperado

**Solución**: El delay se reinicia con cada cambio. Usar `saveManually()` para guardado inmediato.

---

## Changelog

### v1.0.0 (2024)
- ✨ Implementación inicial de `useAutoSave`
- ✨ Implementación inicial de `useSubmitSolution`
- 📝 Documentación completa
- ✅ Tests unitarios

---

**Mantenido por**: Equipo de Desarrollo
**Última actualización**: 2024