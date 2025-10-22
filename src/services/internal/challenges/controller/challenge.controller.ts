import { toast } from "sonner";
import type { Challenge } from "../entities/challenge.entity";
import {
    createChallengeAction,
    getChallengeByIdAction,
    getChallengesByTeacherIdAction,
    getPublicChallengesAction,
} from "../server/challenge.actions";
import { ChallengeAssembler } from "./challenge.assembler";
import type {
    ChallengeResponse,
    CreateChallengeRequest,
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
        console.log("RESPONSE DE CREATION", response);
        if (response.status === 200 || response.status === 201) {
            toast.success("Challenge created successfully");
            return ChallengeAssembler.toEntityFromResponse(
                response.data as ChallengeResponse,
            );
        }

        toast.error("Failed to create challenge");
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

        toast.error("Failed to fetch challenge");
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

        toast.error("Failed to fetch challenges");
        throw new Error("Failed to fetch challenges");
    }
}
