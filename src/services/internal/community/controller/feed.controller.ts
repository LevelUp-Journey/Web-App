import { getUserFeedAction } from "../server/feed.actions";
import type { FeedResponse } from "../server/feed.actions";

export class FeedController {
    static async getUserFeed(
        userId: string,
        limit = 20,
        offset = 0,
    ): Promise<FeedResponse> {
        const response = await getUserFeedAction(userId, limit, offset);

        if (response.status !== 200) {
            throw new Error(`Failed to fetch user feed: ${response.data}`);
        }

        return response.data as FeedResponse;
    }
}
