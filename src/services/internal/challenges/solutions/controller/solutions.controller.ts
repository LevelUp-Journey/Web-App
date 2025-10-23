import { createSolutionAction } from "../server/solutions.actions";
import type { CreateSolutionRequest } from "./solutions.response";

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
}
