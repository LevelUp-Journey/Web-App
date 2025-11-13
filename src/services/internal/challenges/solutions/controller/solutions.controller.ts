import {
    createSolutionAction,
    getSolutionByChallengeIdAndCodeVersionIdAction,
    submitSolutionAction,
    updateSolutionAction,
} from "../server/solutions.actions";
import type {
    CreateSolutionRequest,
    GetSolutionByChallengeIdAndCodeRequest,
    UpdateSolutionRequest,
} from "./solutions.response";

export class SolutionsController {
    public static async createSolution(request: CreateSolutionRequest) {
        try {
            const response = await createSolutionAction(request);
            return response;
        } catch (_e) {
            return false;
        }
    }

    public static async updateSolution(request: UpdateSolutionRequest) {
        try {
            const response = await updateSolutionAction(request);
            return response;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    public static async getSolutionByChallengeIdAndCodeVersionId(
        request: GetSolutionByChallengeIdAndCodeRequest,
    ) {
        try {
            const response =
                await getSolutionByChallengeIdAndCodeVersionIdAction(request);
            return response;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    public static async submitSolution(solutionId: string) {
        try {
            const response = await submitSolutionAction(solutionId);
            console.log("Solution submitted successfully");
            console.log("Response:", response);
            return response;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}
