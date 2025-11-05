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
            console.log("CREATE SOLUTION", response);
            return response;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    public static async updateSolution(request: UpdateSolutionRequest) {
        try {
            console.log("UPDATE REQUEST", request);
            const response = await updateSolutionAction(request);
            console.log("UPDATE SOLUTION", response);
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
            console.log("GET SOLUTION BY CHALLENGE ID AND CODE", response);
            return response;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    public static async submitSolution(solutionId: string) {
        try {
            const response = await submitSolutionAction(solutionId);
            console.log("SUBMIT SOLUTION", response);
            return response;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}
