import { ChallengeStatus } from "@/lib/consts";
import type { Challenge } from "../entities/challenge.entity";
import {
    createChallengeAction,
    deleteChallengeAction,
    getChallengeByIdAction,
    getChallengesByTeacherIdAction,
    getPublicChallengesAction,
    updateChallengeAction,
} from "../server/challenge.actions";
import { ChallengeAssembler } from "./challenge.assembler";
import type {
    ChallengeResponse,
    CreateChallengeRequest,
    UpdateChallengeRequest,
} from "./challenge.response";

// Custom error class for better error handling
export class ChallengeError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public originalError?: unknown,
    ) {
        super(message);
        this.name = "ChallengeError";
    }
}

export class ChallengeController {
    /**
     * Get all public challenges
     * @returns Array of public challenges, empty array if fetch fails
     */
    public static async getPublicChallenges(): Promise<Challenge[]> {
        try {
            const challenges = await getPublicChallengesAction();

            if (challenges.status === 200 && challenges.data) {
                return ChallengeAssembler.toEntitiesFromResponse(
                    challenges.data as ChallengeResponse[],
                );
            }

            console.error("Failed to fetch public challenges:", challenges);
            return []; // Return empty array instead of throwing
        } catch (error) {
            console.error("Error fetching public challenges:", error);
            // Return empty array to prevent app crash
            return [];
        }
    }

    /**
     * Create a new challenge
     * @throws ChallengeError if creation fails
     */
    public static async createChallenge(
        request: CreateChallengeRequest,
    ): Promise<Challenge> {
        try {
            const response = await createChallengeAction(request);

            if (
                (response.status === 200 || response.status === 201) &&
                response.data
            ) {
                return ChallengeAssembler.toEntityFromResponse(
                    response.data as ChallengeResponse,
                );
            }

            throw new ChallengeError(
                "Failed to create challenge",
                response.status,
                response,
            );
        } catch (error) {
            if (error instanceof ChallengeError) {
                throw error;
            }

            console.error("Error creating challenge:", error);
            throw new ChallengeError(
                "An unexpected error occurred while creating the challenge",
                undefined,
                error,
            );
        }
    }

    /**
     * Get challenge by ID
     * @returns Challenge or null if not found
     */
    public static async getChallengeById(
        challengeId: string,
    ): Promise<Challenge | null> {
        try {
            const response = await getChallengeByIdAction(challengeId);

            if (response.status === 200 && response.data) {
                return ChallengeAssembler.toEntityFromResponse(
                    response.data as ChallengeResponse,
                );
            }

            if (response.status === 404) {
                console.warn(`Challenge not found: ${challengeId}`);
                return null;
            }

            console.error("Failed to fetch challenge:", response);
            return null;
        } catch (error) {
            console.error(`Error fetching challenge ${challengeId}:`, error);
            return null;
        }
    }

    /**
     * Get challenges by teacher ID
     * @returns Array of challenges, empty array if fetch fails
     */
    public static async getChallengesByTeacherId(
        teacherId: string,
    ): Promise<Challenge[]> {
        try {
            const response = await getChallengesByTeacherIdAction(teacherId);

            if (response.status === 200 && response.data) {
                return ChallengeAssembler.toEntitiesFromResponse(
                    response.data as ChallengeResponse[],
                );
            }

            console.error(
                "Failed to fetch challenges by teacher ID:",
                response,
            );
            return [];
        } catch (error) {
            console.error(
                `Error fetching challenges for teacher ${teacherId}:`,
                error,
            );
            return [];
        }
    }

    /**
     * Update a challenge
     * @throws ChallengeError if update fails
     */
    public static async updateChallenge(
        challengeId: string,
        request: UpdateChallengeRequest,
    ): Promise<Challenge> {
        try {
            const response = await updateChallengeAction(challengeId, request);

            if (response.status === 200 && response.data) {
                return ChallengeAssembler.toEntityFromResponse(
                    response.data as ChallengeResponse,
                );
            }

            // Try to get error message from response
            const errorMessage =
                typeof response.data === "string"
                    ? response.data
                    : "Failed to update challenge";

            throw new ChallengeError(errorMessage, response.status, response);
        } catch (error) {
            if (error instanceof ChallengeError) {
                throw error;
            }

            console.error(`Error updating challenge ${challengeId}:`, error);
            throw new ChallengeError(
                "An unexpected error occurred while updating the challenge",
                undefined,
                error,
            );
        }
    }

    /**
     * Publish a challenge (shorthand for updating status)
     * @throws ChallengeError if publish fails
     */
    public static async publishChallenge(
        challengeId: string,
    ): Promise<Challenge> {
        return await ChallengeController.updateChallenge(challengeId, {
            status: ChallengeStatus.PUBLISHED,
        });
    }

    /**
     * Delete a challenge
     * @returns true if deleted successfully, false otherwise
     */
    public static async deleteChallenge(challengeId: string): Promise<boolean> {
        try {
            const response = await deleteChallengeAction(challengeId);

            if (response.status === 204 || response.status === 200) {
                return true;
            }

            console.error("Failed to delete challenge:", response);
            return false;
        } catch (error) {
            console.error(`Error deleting challenge ${challengeId}:`, error);
            return false;
        }
    }
}

// ==========================================
// EJEMPLO DE USO CON MANEJO DE ERRORES
// ==========================================

/*
// En un componente de página
export default async function ChallengesPage() {
    // Este método nunca causará que la app se rompa
    const challenges = await ChallengeController.getPublicChallenges();

    return (
        <div>
            {challenges.length > 0 ? (
                challenges.map(challenge => <ChallengeCard key={challenge.id} challenge={challenge} />)
            ) : (
                <p>No challenges available</p>
            )}
        </div>
    );
}

// En un Server Action o API Route con try-catch
"use server";

export async function createChallengeHandler(data: CreateChallengeRequest) {
    try {
        const challenge = await ChallengeController.createChallenge(data);
        return { success: true, challenge };
    } catch (error) {
        if (error instanceof ChallengeError) {
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

// En un componente cliente con toast notifications
"use client";

async function handleDelete(challengeId: string) {
    const success = await ChallengeController.deleteChallenge(challengeId);

    if (success) {
        toast.success("Challenge deleted successfully");
        router.refresh();
    } else {
        toast.error("Failed to delete challenge");
    }
}
*/
