# 🏗️ Arquitectura del Editor de Código

## 📐 Vista General del Sistema

```
┌─────────────────────────────────────────────────────────────────────┐
│                          BROWSER / CLIENTE                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                 StudentCodeEditor Component                    │  │
│  │                     (Client Component)                         │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │                                                                │  │
│  │  ┌──────────────┐        ┌──────────────────────────────┐   │  │
│  │  │  useAutoSave │◄───────┤  Monaco Editor               │   │  │
│  │  │              │        │  (Code Input)                │   │  │
│  │  │  - content   │        └──────────────────────────────┘   │  │
│  │  │  - saveStatus│                                            │  │
│  │  │  - save()    │        ┌──────────────────────────────┐   │  │
│  │  └──────┬───────┘        │  UI Controls                 │   │  │
│  │         │                │  - Save Button               │   │  │
│  │         │                │  - Run Button                │   │  │
│  │         │                │  - Status Indicators         │   │  │
│  │  ┌──────▼──────────┐    └──────────────────────────────┘   │  │
│  │  │ SolutionsAPI    │                                         │  │
│  │  │ Controller      │    ┌──────────────────────────────┐   │  │
│  │  │                 │    │  Test Results Panel          │   │  │
│  │  │ - updateCode()  │    │  - Test Cases List           │   │  │
│  │  │ - submit()      │    │  - Pass/Fail Status          │   │  │
│  │  └──────┬──────────┘    │  - Execution Time            │   │  │
│  │         │                └──────────────────────────────┘   │  │
│  │         │                                                    │  │
│  │  ┌──────▼─────────────┐                                     │  │
│  │  │ useSubmitSolution  │                                     │  │
│  │  │                    │                                     │  │
│  │  │ - submit()         │                                     │  │
│  │  │ - submitStatus     │                                     │  │
│  │  │ - submitResult     │                                     │  │
│  │  └────────────────────┘                                     │  │
│  │                                                                │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
└───────────────────────────────┬───────────────────────────────────────┘
                                │
                                │ HTTP Requests
                                │
┌───────────────────────────────▼───────────────────────────────────────┐
│                          SERVER / BACKEND                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                     page.tsx (Server Component)                │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │                                                                │  │
│  │  ┌──────────────────────┐  ┌──────────────────────────────┐  │  │
│  │  │  fetchChallenge()    │  │  fetchCodeVersion()          │  │  │
│  │  └──────────┬───────────┘  └───────────┬──────────────────┘  │  │
│  │             │                           │                     │  │
│  │  ┌──────────▼───────────┐  ┌───────────▼──────────────────┐  │  │
│  │  │  fetchTests()        │  │  fetchSolution()             │  │  │
│  │  └──────────┬───────────┘  └───────────┬──────────────────┘  │  │
│  │             │                           │                     │  │
│  │             └───────────┬───────────────┘                     │  │
│  │                         │                                     │  │
│  │                  Promise.all()                                │  │
│  │                         │                                     │  │
│  │             ┌───────────▼────────────┐                        │  │
│  │             │  Parallel Data Fetch   │                        │  │
│  │             └───────────┬────────────┘                        │  │
│  │                         │                                     │  │
│  │             ┌───────────▼────────────┐                        │  │
│  │             │  serializeDescription  │                        │  │
│  │             │  (MDX Processing)      │                        │  │
│  │             └───────────┬────────────┘                        │  │
│  │                         │                                     │  │
│  │                         ▼                                     │  │
│  │             Pass props to Client Component                    │  │
│  │                                                                │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                      API Controllers                           │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │                                                                │  │
│  │  • ChallengeController.getChallengeById()                     │  │
│  │  • CodeVersionController.getCodeVersionById()                 │  │
│  │  • VersionTestController.getVersionTests()                    │  │
│  │  • SolutionsController.updateSolution()                       │  │
│  │  • SolutionsController.submitSolution()                       │  │
│  │                                                                │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
└───────────────────────────────┬───────────────────────────────────────┘
                                │
                                │ Database Queries
                                │
                    ┌───────────▼───────────┐
                    │      DATABASE         │
                    ├───────────────────────┤
                    │  • Challenges         │
                    │  • CodeVersions       │
                    │  • Tests              │
                    │  • Solutions          │
                    │  • SolutionReports    │
                    └───────────────────────┘
```

---

## 🔄 Flujo de Datos - Auto-guardado

```
┌──────────────┐
│   Usuario    │
│  Escribe     │
│  Código      │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│  Monaco Editor       │
│  onChange()          │
└──────┬───────────────┘
       │
       │ updateContent()
       ▼
┌──────────────────────────────────────┐
│  useAutoSave Hook                    │
├──────────────────────────────────────┤
│  1. Actualiza content                │
│  2. Detecta cambios                  │
│  3. Inicia timer (3s)                │
└──────┬───────────────────────────────┘
       │
       │ (después de 3s)
       ▼
┌──────────────────────────────────────┐
│  performSave()                       │
├──────────────────────────────────────┤
│  1. Cancela request anterior         │
│  2. setSaveStatus('saving')          │
│  3. Muestra "Auto-saving..."         │
└──────┬───────────────────────────────┘
       │
       │ onSave(content)
       ▼
┌──────────────────────────────────────┐
│  SolutionsController.updateSolution()│
└──────┬───────────────────────────────┘
       │
       │ HTTP PUT /api/solutions/{id}
       ▼
┌──────────────────────────────────────┐
│  Backend API                         │
│  Guarda en Database                  │
└──────┬───────────────────────────────┘
       │
       │ Success Response
       ▼
┌──────────────────────────────────────┐
│  useAutoSave Hook                    │
├──────────────────────────────────────┤
│  1. setSaveStatus('saved')           │
│  2. Actualiza savedContentRef        │
│  3. Muestra "Saved" (2s)             │
│  4. Auto-reset a 'idle'              │
└──────────────────────────────────────┘
```

---

## ⚡ Flujo de Datos - Envío de Solución

```
┌──────────────┐
│   Usuario    │
│  Click       │
│  "Run Code"  │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────┐
│  handleSubmit()                      │
└──────┬───────────────────────────────┘
       │
       │ submit()
       ▼
┌──────────────────────────────────────┐
│  useSubmitSolution Hook              │
├──────────────────────────────────────┤
│  1. Verifica !isSubmitting           │
│  2. setSubmitStatus('submitting')    │
│  3. Muestra "Executing..."           │
└──────┬───────────────────────────────┘
       │
       │ onSubmit()
       ▼
┌──────────────────────────────────────┐
│  SolutionsController.submitSolution()│
└──────┬───────────────────────────────┘
       │
       │ HTTP PUT /api/solutions/{id}/submissions
       ▼
┌──────────────────────────────────────┐
│  Backend API                         │
├──────────────────────────────────────┤
│  1. Ejecuta código contra tests      │
│  2. Genera report                    │
│  3. Calcula passedTests/totalTests   │
│  4. Mide tiempo de ejecución         │
└──────┬───────────────────────────────┘
       │
       │ SubmitSolutionResponse
       ▼
┌──────────────────────────────────────┐
│  useSubmitSolution Hook              │
├──────────────────────────────────────┤
│  1. setSubmitResult(response)        │
│  2. setSubmitStatus('success')       │
│  3. onSuccess(result)                │
└──────┬───────────────────────────────┘
       │
       │ onSuccess callback
       ▼
┌──────────────────────────────────────┐
│  StudentCodeEditor                   │
├──────────────────────────────────────┤
│  1. setActiveTab('tests')            │
│  2. toast.success()                  │
│  3. Renderiza resultados             │
└──────────────────────────────────────┘
```

---

## 🧩 Estructura de Custom Hooks

### useAutoSave

```
useAutoSave
├── Estado
│   ├── content (string)
│   ├── saveStatus ('idle' | 'saving' | 'saved' | 'error')
│   └── isManualSaving (boolean)
│
├── Referencias
│   ├── savedContentRef (última versión guardada)
│   ├── autoSaveTimerRef (NodeJS.Timeout)
│   ├── abortControllerRef (AbortController)
│   └── isMountedRef (boolean)
│
├── Funciones
│   ├── performSave(content, isManual)
│   │   ├── Validar cambios
│   │   ├── Cancelar request anterior
│   │   ├── Ejecutar onSave()
│   │   ├── Actualizar estados
│   │   └── Manejo de errores
│   │
│   ├── saveManually()
│   │   └── Llama performSave(content, true)
│   │
│   └── updateContent(newContent)
│       └── Actualiza content state
│
├── Efectos
│   ├── Auto-save con debounce
│   │   ├── Clear timer anterior
│   │   ├── Verificar cambios
│   │   ├── setTimeout(performSave, delay)
│   │   └── Cleanup en unmount
│   │
│   └── Cleanup general
│       ├── Abortar requests
│       └── Limpiar timers
│
└── Retorno
    ├── content
    ├── updateContent
    ├── saveStatus
    ├── isManualSaving
    ├── hasUnsavedChanges
    └── saveManually
```

### useSubmitSolution

```
useSubmitSolution
├── Estado
│   ├── submitStatus ('idle' | 'submitting' | 'success' | 'error')
│   └── submitResult (SubmitSolutionResponse | null)
│
├── Funciones
│   ├── submit()
│   │   ├── Validar !isSubmitting
│   │   ├── setSubmitStatus('submitting')
│   │   ├── Ejecutar onSubmit()
│   │   ├── Actualizar resultado
│   │   ├── Ejecutar callbacks
│   │   └── Auto-reset después de 2s
│   │
│   └── reset()
│       ├── setSubmitStatus('idle')
│       └── setSubmitResult(null)
│
└── Retorno
    ├── submitStatus
    ├── submitResult
    ├── isSubmitting
    ├── submit
    └── reset
```

---

## 🔐 Seguridad y Prevención de Errores

```
┌─────────────────────────────────────────────┐
│         Prevención de Memory Leaks          │
├─────────────────────────────────────────────┤
│                                             │
│  useEffect(() => {                          │
│    isMountedRef.current = true;            │
│                                             │
│    return () => {                           │
│      isMountedRef.current = false;         │
│      abortController?.abort();             │
│      clearTimeout(timer);                  │
│    };                                       │
│  }, []);                                    │
│                                             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│         Cancelación de Requests             │
├─────────────────────────────────────────────┤
│                                             │
│  if (abortControllerRef.current) {         │
│    abortControllerRef.current.abort();     │
│  }                                          │
│  abortControllerRef.current =              │
│    new AbortController();                  │
│                                             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│         Validación de Datos                 │
├─────────────────────────────────────────────┤
│                                             │
│  // Críticos (deben existir)               │
│  if (!challenge || !codeVersion) {         │
│    notFound();                             │
│  }                                          │
│                                             │
│  // Opcionales (valores por defecto)       │
│  const tests = await fetchTests() || [];   │
│  const solution = await fetch() || null;   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 📊 Estados y Transiciones

### Estados de Guardado

```
       ┌──────┐
   ┌───┤ idle ├───┐
   │   └──────┘   │
   │              │
   │              │ Auto-save trigger
   │              │ o saveManually()
   │              │
   │   ┌────────┐ │
   └──►│ saving │◄┘
       └────┬───┘
            │
            ├─────► Success ──► ┌───────┐
            │                   │ saved │
            │                   └───┬───┘
            │                       │
            │                       │ (2s timeout)
            │                       │
            │                       ▼
            │                   ┌──────┐
            │                   │ idle │
            │                   └──────┘
            │
            └─────► Error ────► ┌───────┐
                                │ error │
                                └───┬───┘
                                    │
                                    │ (3s timeout)
                                    │
                                    ▼
                                ┌──────┐
                                │ idle │
                                └──────┘
```

### Estados de Envío

```
       ┌──────┐
   ┌───┤ idle ├───┐
   │   └──────┘   │
   │              │
   │              │ submit()
   │              │
   │   ┌───────────┐ │
   └──►│submitting │◄┘
       └─────┬─────┘
             │
             ├─────► Success ──► ┌─────────┐
             │                   │ success │
             │                   └────┬────┘
             │                        │
             │                        │ (2s timeout)
             │                        │
             │                        ▼
             │                    ┌──────┐
             │                    │ idle │
             │                    └──────┘
             │
             └─────► Error ────► ┌───────┐
                                 │ error │
                                 └───┬───┘
                                     │
                                     │ (2s timeout)
                                     │
                                     ▼
                                 ┌──────┐
                                 │ idle │
                                 └──────┘
```

---

## 🎯 Flujo de Renderizado

```
Server (RSC)
│
├─ page.tsx (Server Component)
│  │
│  ├─ Promise.all([
│  │    fetchChallenge(),      ◄── Paralelo
│  │    fetchCodeVersion(),    ◄── Paralelo
│  │    fetchTests(),          ◄── Paralelo
│  │    fetchSolution()        ◄── Paralelo
│  │  ])
│  │
│  ├─ serializeDescription()
│  │
│  └─ Render <StudentCodeEditor />
│
└─────────────────────────────────────
Client
│
└─ StudentCodeEditor (Client Component)
   │
   ├─ useAutoSave() ◄──────── Hook personalizado
   │  └─ Gestiona auto-guardado
   │
   ├─ useSubmitSolution() ◄─── Hook personalizado
   │  └─ Gestiona envío
   │
   └─ Render
      │
      ├─ Header
      │  ├─ Challenge name
      │  ├─ Save button (con estado)
      │  └─ Run button (con estado)
      │
      ├─ ResizablePanelGroup
      │  │
      │  ├─ Left Panel
      │  │  └─ MonacoEditor
      │  │     └─ onChange → updateContent()
      │  │
      │  └─ Right Panel
      │     └─ Tabs
      │        │
      │        ├─ Description Tab
      │        │  ├─ MDX Renderer
      │        │  └─ Challenge Details
      │        │
      │        └─ Tests Tab
      │           ├─ Submit Results (si existe)
      │           └─ Test Cases List
      │              ├─ Public tests (con input/output)
      │              └─ Secret tests (hidden)
      │
      └─ Effects
         ├─ Auto-save con debounce
         └─ Cleanup al desmontar
```

---

## 🔌 Integraciones

### APIs Externas
```
Client ──────► SolutionsController
                      │
                      ├─ updateSolution(id, code)
                      │  └─ PUT /api/solutions/{id}
                      │
                      └─ submitSolution(id)
                         └─ PUT /api/solutions/{id}/submissions
```

### Servicios Internos
```
page.tsx ────► ChallengeController
               CodeVersionController
               VersionTestController
               SolutionsController
                      │
                      └─ Internal API Calls
                         └─ Database Queries
```

---

## 📦 Dependencias

### Hooks Personalizados
- `useAutoSave` → No depende de otros hooks
- `useSubmitSolution` → No depende de otros hooks
- Ambos son **independientes** y **reutilizables**

### Componente Principal
```
StudentCodeEditor
├── Depende de:
│   ├── useAutoSave (hook)
│   ├── useSubmitSolution (hook)
│   ├── MonacoEditor (componente)
│   ├── MdxRenderer (componente)
│   ├── UI Components (Button, Tabs, etc)
│   └── SolutionsController (API)
│
└── Recibe como props:
    ├── challenge (Challenge)
    ├── codeVersion (CodeVersion)
    ├── tests (VersionTest[])
    ├── serializedDescription (SerializeResult)
    └── solution (SolutionResponse | null)
```

---

## 🎨 Patrón de Composición

```
useCodeChallenge (ejemplo custom hook combinado)
│
├── useAutoSave()
│   └── Lógica de guardado
│
├── useSubmitSolution()
│   └── Lógica de envío
│
└── Combina ambos hooks
    └── Expone API unificada
```

---

## 🏗️ Principios de Arquitectura

### 1. **Separation of Concerns**
- Hooks → Lógica de negocio
- Componentes → Presentación
- Controllers → Comunicación API

### 2. **Single Responsibility**
- `useAutoSave` → Solo guardado
- `useSubmitSolution` → Solo envío
- `StudentCodeEditor` → Solo UI

### 3. **Composición sobre Herencia**
- Combinar hooks pequeños
- Componentes modulares
- Reutilización máxima

### 4. **Error Handling en Capas**
- Hook → Captura y expone estado
- Componente → Muestra UI de error
- Server → Redirección fallback

### 5. **Optimistic UI**
- Feedback inmediato
- Estados intermedios claros
- Rollback en caso de error

---

**Última actualización:** 2024  
**Versión:** 2.0.0  
**Estado:** ✅ En Producción