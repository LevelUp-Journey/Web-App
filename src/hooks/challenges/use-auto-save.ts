import { useCallback, useEffect, useRef, useState } from "react";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface UseAutoSaveOptions {
    /**
     * Función que realiza el guardado
     */
    onSave: (content: string) => Promise<void>;

    /**
     * Contenido inicial
     */
    initialContent: string;

    /**
     * Delay en milisegundos para el auto-guardado (debounce)
     * @default 3000
     */
    delay?: number;

    /**
     * Si está habilitado el auto-guardado
     * @default true
     */
    enabled?: boolean;
}

interface UseAutoSaveReturn {
    /**
     * Estado actual del guardado
     */
    saveStatus: SaveStatus;

    /**
     * Indica si está guardando manualmente
     */
    isManualSaving: boolean;

    /**
     * Indica si hay cambios sin guardar
     */
    hasUnsavedChanges: boolean;

    /**
     * Función para guardar manualmente
     */
    saveManually: () => Promise<void>;

    /**
     * Función para actualizar el contenido
     */
    updateContent: (content: string) => void;

    /**
     * Contenido actual
     */
    content: string;
}

/**
 * Hook personalizado para gestionar el auto-guardado de contenido con debounce
 *
 * @example
 * ```tsx
 * const {
 *   content,
 *   updateContent,
 *   saveStatus,
 *   saveManually
 * } = useAutoSave({
 *   initialContent: "Initial code",
 *   onSave: async (code) => {
 *     await api.saveCode(code);
 *   },
 *   delay: 3000
 * });
 * ```
 */
export function useAutoSave({
    onSave,
    initialContent,
    delay = 3000,
    enabled = true,
}: UseAutoSaveOptions): UseAutoSaveReturn {
    // Estado del contenido
    const [content, setContent] = useState(initialContent);

    // Estado del guardado
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
    const [isManualSaving, setIsManualSaving] = useState(false);

    // Referencias
    const savedContentRef = useRef(initialContent);
    const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const isMountedRef = useRef(true);

    // Verificar si hay cambios sin guardar
    const hasUnsavedChanges = content !== savedContentRef.current;

    /**
     * Función interna para realizar el guardado
     */
    const performSave = useCallback(
        async (contentToSave: string, isManual: boolean = false) => {
            // No guardar si no hay cambios
            if (contentToSave === savedContentRef.current) {
                return;
            }

            // Cancelar request anterior si existe
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            // Crear nuevo AbortController para esta petición
            abortControllerRef.current = new AbortController();

            try {
                // Actualizar estados
                if (isManual) {
                    setIsManualSaving(true);
                } else {
                    setSaveStatus("saving");
                }

                // Ejecutar función de guardado
                await onSave(contentToSave);

                // Actualizar referencia solo si el componente sigue montado
                if (isMountedRef.current) {
                    savedContentRef.current = contentToSave;
                    setSaveStatus("saved");

                    // Resetear a idle después de 2 segundos
                    setTimeout(() => {
                        if (isMountedRef.current) {
                            setSaveStatus("idle");
                        }
                    }, 2000);
                }
            } catch (error) {
                // Ignorar errores de abort
                if (error instanceof Error && error.name === "AbortError") {
                    return;
                }

                console.error("Error saving content:", error);

                if (isMountedRef.current) {
                    setSaveStatus("error");

                    // Resetear a idle después de 3 segundos
                    setTimeout(() => {
                        if (isMountedRef.current) {
                            setSaveStatus("idle");
                        }
                    }, 3000);
                }

                // Re-lanzar error para que el llamador pueda manejarlo
                throw error;
            } finally {
                if (isMountedRef.current && isManual) {
                    setIsManualSaving(false);
                }
                abortControllerRef.current = null;
            }
        },
        [onSave],
    );

    /**
     * Función pública para guardar manualmente
     */
    const saveManually = useCallback(async () => {
        // Cancelar auto-guardado pendiente
        if (autoSaveTimerRef.current) {
            clearTimeout(autoSaveTimerRef.current);
            autoSaveTimerRef.current = null;
        }

        await performSave(content, true);
    }, [content, performSave]);

    /**
     * Función para actualizar el contenido
     */
    const updateContent = useCallback((newContent: string) => {
        setContent(newContent);
    }, []);

    /**
     * Efecto para auto-guardado con debounce
     */
    useEffect(() => {
        // No hacer nada si está deshabilitado
        if (!enabled) {
            return;
        }

        // Limpiar timer previo
        if (autoSaveTimerRef.current) {
            clearTimeout(autoSaveTimerRef.current);
        }

        // No hacer nada si no hay cambios
        if (!hasUnsavedChanges) {
            return;
        }

        // Crear nuevo timer para auto-guardado
        autoSaveTimerRef.current = setTimeout(() => {
            performSave(content, false);
        }, delay);

        // Cleanup
        return () => {
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }
        };
    }, [content, delay, enabled, hasUnsavedChanges, performSave]);

    /**
     * Efecto de cleanup al desmontar
     */
    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;

            // Cancelar requests pendientes
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            // Limpiar timers
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }
        };
    }, []);

    return {
        saveStatus,
        isManualSaving,
        hasUnsavedChanges,
        saveManually,
        updateContent,
        content,
    };
}
