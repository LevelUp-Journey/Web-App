import { useCallback, useState } from "react";
import type { SubmitSolutionResponse } from "@/services/internal/challenges/solutions/controller/solutions.response";

export type SubmitStatus = "idle" | "submitting" | "success" | "error";

interface UseSubmitSolutionOptions {
    /**
     * Función que realiza el envío de la solución
     */
    onSubmit: () => Promise<SubmitSolutionResponse>;

    /**
     * Callback cuando el envío es exitoso
     */
    onSuccess?: (result: SubmitSolutionResponse) => void;

    /**
     * Callback cuando hay un error
     */
    onError?: (error: Error) => void;
}

interface UseSubmitSolutionReturn {
    /**
     * Estado actual del envío
     */
    submitStatus: SubmitStatus;

    /**
     * Resultado del último envío
     */
    submitResult: SubmitSolutionResponse | null;

    /**
     * Indica si está enviando
     */
    isSubmitting: boolean;

    /**
     * Función para enviar la solución
     */
    submit: () => Promise<void>;

    /**
     * Función para resetear el estado
     */
    reset: () => void;
}

/**
 * Hook personalizado para gestionar el envío de soluciones de código
 *
 * @example
 * ```tsx
 * const {
 *   submit,
 *   isSubmitting,
 *   submitResult,
 *   submitStatus
 * } = useSubmitSolution({
 *   onSubmit: async () => {
 *     return await api.submitSolution(solutionId);
 *   },
 *   onSuccess: (result) => {
 *     console.log('Tests passed:', result.passedTests);
 *   }
 * });
 * ```
 */
export function useSubmitSolution({
    onSubmit,
    onSuccess,
    onError,
}: UseSubmitSolutionOptions): UseSubmitSolutionReturn {
    // Estado del envío
    const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
    const [submitResult, setSubmitResult] =
        useState<SubmitSolutionResponse | null>(null);

    // Derivar isSubmitting del estado
    const isSubmitting = submitStatus === "submitting";

    /**
     * Función para enviar la solución
     */
    const submit = useCallback(async () => {
        // Prevenir envíos múltiples
        if (isSubmitting) {
            return;
        }

        setSubmitStatus("submitting");
        setSubmitResult(null);

        try {
            const result = await onSubmit();

            setSubmitResult(result);
            setSubmitStatus("success");

            // Ejecutar callback de éxito
            if (onSuccess) {
                onSuccess(result);
            }
        } catch (error) {
            console.error("Error submitting solution:", error);
            setSubmitStatus("error");

            // Ejecutar callback de error
            if (onError) {
                onError(error as Error);
            }

            // Re-lanzar error para que el componente pueda manejarlo
            throw error;
        } finally {
            // Resetear estado después de 2 segundos
            setTimeout(() => {
                setSubmitStatus("idle");
            }, 2000);
        }
    }, [isSubmitting, onSubmit, onSuccess, onError]);

    /**
     * Función para resetear el estado
     */
    const reset = useCallback(() => {
        setSubmitStatus("idle");
        setSubmitResult(null);
    }, []);

    return {
        submitStatus,
        submitResult,
        isSubmitting,
        submit,
        reset,
    };
}
