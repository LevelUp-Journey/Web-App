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

export class ChallengeController {
    public static async getPublicChallenges(): Promise<Challenge[]> {
        const challenges = await getPublicChallengesAction();

        if (challenges.status === 200) {
            // Handle successful response
            return ChallengeAssembler.toEntitiesFromResponse(
                challenges.data as ChallengeResponse[],
            );
        }

        throw new Error("Failed to fetch public challenges");
    }

    public static async createChallenge(
        request: CreateChallengeRequest,
    ): Promise<Challenge> {
        const response = await createChallengeAction(request);
        if (response.status === 200 || response.status === 201) {
            return ChallengeAssembler.toEntityFromResponse(
                response.data as ChallengeResponse,
            );
        }
        throw new Error("Failed to create challenge");
    }

    public static async getChallengeById(
        challengeId: string,
    ): Promise<Challenge> {
        const response = await getChallengeByIdAction(challengeId);

        if (response.status === 200) {
            return ChallengeAssembler.toEntityFromResponse(
                response.data as ChallengeResponse,
            );
        }
        throw new Error("Failed to fetch challenge");
    }

    public static async getChallengesByTeacherId(
        teacherId: string,
    ): Promise<Challenge[]> {
        const response = await getChallengesByTeacherIdAction(teacherId);

        if (response.status === 200) {
            return ChallengeAssembler.toEntitiesFromResponse(
                response.data as ChallengeResponse[],
            );
        }
        throw new Error("Failed to fetch challenges");
    }

    public static async updateChallenge(
        challengeId: string,
        request: UpdateChallengeRequest,
    ) {
        const response = await updateChallengeAction(challengeId, request);

        if (response.status === 200) {
            return ChallengeAssembler.toEntityFromResponse(
                response.data as ChallengeResponse,
            );
        }

        throw new Error(response.data as string);
    }

    public static async publishChallenge(challengeId: string) {
        return await ChallengeController.updateChallenge(challengeId, {
            status: ChallengeStatus.PUBLISHED,
        });
    }

    public static async deleteChallenge(challengeId: string): Promise<boolean> {
        const response = await deleteChallengeAction(challengeId);

        if (response.status === 204) {
            return true;
        }

        throw new Error("Failed to delete challenge");
    }
}
