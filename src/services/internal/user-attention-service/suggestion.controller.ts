import { sendSuggestionAction } from "./suggestions.actions";

export class SuggestionController {
    public static async sendSuggestion(suggestion: string): Promise<void> {
        try {
            const response = await sendSuggestionAction(suggestion);
            console.log("Suggestion response", response);
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    }
}
