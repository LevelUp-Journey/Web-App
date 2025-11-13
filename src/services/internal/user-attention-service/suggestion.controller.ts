import {
    getAllSuggestionsAction,
    sendSuggestionAction,
} from "./suggestions.actions";

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

    public static async getAllSuggestions() {
        try {
            const response = await getAllSuggestionsAction();
            console.log("Suggestions response", response);
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
