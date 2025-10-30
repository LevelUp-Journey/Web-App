import type { CodeVersion } from "../entities/code-version.entity";
import {
    createCodeVersionAction,
    deleteCodeVersionAction,
    getCodeVersionByIdAction,
    getCodeVersionsBatchAction,
    getCodeVersionsByChallengeIdAction,
    updateCodeVersionAction,
} from "../server/code-version.actions";
import { CodeVersionAssembler } from "./code-version.assembler";
import type {
    CodeVersionResponse,
    CreateCodeVersionRequest,
    GetCodeVersionsBatchResponse,
    UpdateCodeVersionRequest,
} from "./code-version.response";

// Custom error class for better error handling
export class CodeVersionError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public originalError?: unknown,
    ) {
        super(message);
        this.name = "CodeVersionError";
    }
}

export class CodeVersionController {
    /**
     * Get all code versions for a challenge
     * @returns Array of code versions, empty array if fetch fails
     */
    public static async getCodeVersionsByChallengeId(
        challengeId: string,
    ): Promise<CodeVersion[]> {
        try {
            const codeVersions =
                await getCodeVersionsByChallengeIdAction(challengeId);

            if (codeVersions.status === 200 && codeVersions.data) {
                return CodeVersionAssembler.toEntitiesFromResponses(
                    codeVersions.data as CodeVersionResponse[],
                );
            }

            console.error(
                `Failed to get code versions for challenge ${challengeId}:`,
                codeVersions,
            );
            return [];
        } catch (error) {
            console.error(
                `Error fetching code versions for challenge ${challengeId}:`,
                error,
            );
            return [];
        }
    }

    /**
     * Create a new code version for a challenge
     * @throws CodeVersionError if creation fails
     */
    public static async createCodeVersion(
        challengeId: string,
        request: CreateCodeVersionRequest,
    ): Promise<CodeVersion> {
        try {
            const response = await createCodeVersionAction(
                challengeId,
                request,
            );

            if (
                (response.status === 200 || response.status === 201) &&
                response.data
            ) {
                return CodeVersionAssembler.toEntityFromResponse(
                    response.data as CodeVersionResponse,
                );
            }

            throw new CodeVersionError(
                `Failed to create code version for challenge ${challengeId}`,
                response.status,
                response,
            );
        } catch (error) {
            if (error instanceof CodeVersionError) {
                throw error;
            }

            console.error(
                `Error creating code version for challenge ${challengeId}:`,
                error,
            );
            throw new CodeVersionError(
                "An unexpected error occurred while creating the code version",
                undefined,
                error,
            );
        }
    }

    /**
     * Get a specific code version by ID
     * @returns CodeVersion or null if not found
     */
    public static async getCodeVersionById(
        challengeId: string,
        codeVersionId: string,
    ): Promise<CodeVersion | null> {
        try {
            const codeVersion = await getCodeVersionByIdAction(
                challengeId,
                codeVersionId,
            );

            if (codeVersion.status === 200 && codeVersion.data) {
                return CodeVersionAssembler.toEntityFromResponse(
                    codeVersion.data as CodeVersionResponse,
                );
            }

            if (codeVersion.status === 404) {
                console.warn(
                    `Code version ${codeVersionId} not found for challenge ${challengeId}`,
                );
                return null;
            }

            console.error(
                `Failed to get code version ${codeVersionId} for challenge ${challengeId}:`,
                codeVersion,
            );
            return null;
        } catch (error) {
            console.error(
                `Error fetching code version ${codeVersionId} for challenge ${challengeId}:`,
                error,
            );
            return null;
        }
    }

    /**
     * Update a code version
     * @throws CodeVersionError if update fails
     */
    public static async updateCodeVersion(
        challengeId: string,
        codeVersionId: string,
        request: UpdateCodeVersionRequest,
    ): Promise<CodeVersion> {
        try {
            const response = await updateCodeVersionAction(
                challengeId,
                codeVersionId,
                request,
            );

            if (response.status === 200 && response.data) {
                return CodeVersionAssembler.toEntityFromResponse(
                    response.data as CodeVersionResponse,
                );
            }

            throw new CodeVersionError(
                `Failed to update code version ${codeVersionId} for challenge ${challengeId}`,
                response.status,
                response,
            );
        } catch (error) {
            if (error instanceof CodeVersionError) {
                throw error;
            }

            console.error(
                `Error updating code version ${codeVersionId} for challenge ${challengeId}:`,
                error,
            );
            throw new CodeVersionError(
                "An unexpected error occurred while updating the code version",
                undefined,
                error,
            );
        }
    }

    /**
     * Delete a code version
     * @returns true if deleted successfully, false otherwise
     */
    public static async deleteCodeVersion(
        challengeId: string,
        codeVersionId: string,
    ): Promise<boolean> {
        try {
            const response = await deleteCodeVersionAction(
                challengeId,
                codeVersionId,
            );

            if (response.status === 200 || response.status === 204) {
                return true;
            }

            console.error(
                `Failed to delete code version ${codeVersionId} for challenge ${challengeId}:`,
                response,
            );
            return false;
        } catch (error) {
            console.error(
                `Error deleting code version ${codeVersionId} for challenge ${challengeId}:`,
                error,
            );
            return false;
        }
    }

    public static async getCodeVersionsBatchByChallengesId(
        challengeIds: string[],
    ): Promise<GetCodeVersionsBatchResponse[]> {
        try {
            const response = await getCodeVersionsBatchAction(challengeIds);

            if (response.status === 200) {
                return response.data as GetCodeVersionsBatchResponse[];
            }

            console.error(
                `Failed to fetch code versions for challenges ${challengeIds}:`,
                response,
            );
            return [];
        } catch (error) {
            console.error(
                `Error fetching code versions for challenges ${challengeIds}:`,
                error,
            );
            return [];
        }
    }
}

// ==========================================
// EJEMPLO DE USO CON MANEJO DE ERRORES
// ==========================================

/*
// En un componente de página - nunca rompe la app
export default async function ChallengePage({ params }: { params: { id: string } }) {
    const codeVersions = await CodeVersionController.getCodeVersionsByChallengeId(params.id);

    return (
        <div>
            {codeVersions.length > 0 ? (
                <CodeVersionsList versions={codeVersions} />
            ) : (
                <p>No code versions available</p>
            )}
        </div>
    );
}

// En un Server Action con manejo de errores
"use server";

export async function createCodeVersionHandler(
    challengeId: string,
    data: CreateCodeVersionRequest
) {
    try {
        const codeVersion = await CodeVersionController.createCodeVersion(
            challengeId,
            data
        );
        return { success: true, codeVersion };
    } catch (error) {
        if (error instanceof CodeVersionError) {
            return {
                success: false,
                error: error.message,
                statusCode: error.statusCode
            };
        }
        return {
            success: false,
            error: "An unexpected error occurred"
        };
    }
}

// En un componente cliente con toast
"use client";

async function handleDelete(challengeId: string, versionId: string) {
    const success = await CodeVersionController.deleteCodeVersion(
        challengeId,
        versionId
    );

    if (success) {
        toast.success("Code version deleted successfully");
        router.refresh();
    } else {
        toast.error("Failed to delete code version");
    }
}

// Verificar existencia antes de mostrar
async function loadCodeVersion(challengeId: string, versionId: string) {
    const version = await CodeVersionController.getCodeVersionById(
        challengeId,
        versionId
    );

    if (!version) {
        notFound(); // Next.js 404 page
        return;
    }

    return <CodeVersionEditor version={version} />;
}
*/
