import {
    type FeedApiItem,
    type FeedApiResponse,
    type FeedItem,
    type FeedResponse,
    type FeedItemReactions,
    getUserFeedAction,
} from "../server/feed.actions";
import { CommunityController } from "./community.controller";
import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";
import type { Community } from "../entities/community.entity";
import type { ProfileResponse } from "@/services/internal/profiles/profiles/controller/profile.response";

export class FeedController {
    static async getUserFeed(
        limit = 20,
        offset = 0,
    ): Promise<FeedResponse> {
        const response = await getUserFeedAction(limit, offset);

        if (response.status !== 200) {
            throw new Error(`Failed to fetch user feed: ${response.data}`);
        }

        const apiData = response.data as FeedApiResponse | FeedResponse;
        const baseItems = this.normalizeFeedItems(apiData);
        const enrichedItems = await this.enrichFeedItems(baseItems);

        return {
            items: enrichedItems,
            total:
                (apiData as FeedApiResponse)?.total ??
                (apiData as FeedResponse)?.total ??
                (apiData as { totalElements?: number }).totalElements ??
                enrichedItems.length,
            limit,
            offset,
        };
    }

    private static normalizeFeedItems(
        apiData: FeedApiResponse | FeedResponse,
    ): FeedItem[] {
        const rawItems =
            (apiData as FeedApiResponse)?.items ??
            (apiData as { content?: FeedApiItem[] }).content ??
            [];

        return rawItems
            .map((item) => {
                const postId = String(
                    item.postId ?? (item as { id?: string }).id ?? "",
                );
                const communityId = String(
                    item.communityId ??
                        (item as { community_id?: string }).community_id ??
                        "",
                );
                const authorId = String(item.authorId ?? "");

                const reactionCounts =
                    item.reactions?.reactionCounts ??
                    item.reactionCounts ??
                    (item.reactions as FeedItemReactions | undefined)
                        ?.reactionCounts ??
                    {};

                const userReaction =
                    item.reactions?.userReaction ??
                    item.userReaction ??
                    (item.reactions as FeedItemReactions | undefined)
                        ?.userReaction ??
                    null;

                if (!postId) return null;

                return {
                    id: postId,
                    communityId,
                    communityName: item.communityName ?? "",
                    communityImageUrl: item.communityImageUrl ?? null,
                    authorId,
                    authorProfileId: item.authorProfileId ?? "",
                    authorName: item.authorName ?? "",
                    authorProfileUrl: item.authorProfileUrl ?? null,
                    content: item.content ?? "",
                    imageUrl:
                        item.imageUrl ??
                        (Array.isArray((item as { images?: string[] }).images)
                            ? (item as { images?: string[] }).images?.[0] ??
                              null
                            : null),
                    createdAt:
                        item.createdAt ??
                        (item as { updatedAt?: string }).updatedAt ??
                        new Date().toISOString(),
                    updatedAt: item.updatedAt ?? item.createdAt,
                    reactions: {
                        reactionCounts,
                        userReaction,
                    },
                } as FeedItem;
            })
            .filter(Boolean) as FeedItem[];
    }

    private static async enrichFeedItems(items: FeedItem[]): Promise<FeedItem[]> {
        const missingCommunityIds = [
            ...new Set(
                items
                    .filter(
                        (item) =>
                            !item.communityName || !item.communityImageUrl,
                    )
                    .map((item) => item.communityId)
                    .filter(Boolean),
            ),
        ];

        const missingAuthorIds = [
            ...new Set(
                items
                    .filter(
                        (item) => !item.authorName || !item.authorProfileUrl,
                    )
                    .map((item) => item.authorId)
                    .filter(Boolean),
            ),
        ];

        const [communityResults, profileResults] = await Promise.all([
            Promise.allSettled(
                missingCommunityIds.map((id) =>
                    CommunityController.getCommunityById(id),
                ),
            ),
            Promise.allSettled(
                missingAuthorIds.map((id) =>
                    ProfileController.getProfileByUserId(id),
                ),
            ),
        ]);

        const communityMap = new Map<string, Community>();
        communityResults.forEach((result, index) => {
            if (result.status === "fulfilled") {
                communityMap.set(missingCommunityIds[index], result.value);
            }
        });

        const profileMap = new Map<string, ProfileResponse>();
        profileResults.forEach((result, index) => {
            if (result.status === "fulfilled" && result.value) {
                profileMap.set(missingAuthorIds[index], result.value);
            }
        });

        return items.map((item) => {
            const community = communityMap.get(item.communityId);
            const profile = profileMap.get(item.authorId);

            const authorName =
                item.authorName ||
                (profile
                    ? `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim() ||
                      profile.username
                    : "Unknown user");

            return {
                ...item,
                communityName:
                    item.communityName ||
                    community?.name ||
                    "Community",
                communityImageUrl:
                    item.communityImageUrl ??
                    community?.iconUrl ??
                    community?.imageUrl ??
                    community?.bannerUrl ??
                    null,
                authorName: authorName || "Unknown user",
                authorProfileUrl:
                    item.authorProfileUrl ??
                    profile?.profileUrl ??
                    null,
            };
        });
    }
}
