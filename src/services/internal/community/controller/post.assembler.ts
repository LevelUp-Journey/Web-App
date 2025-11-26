// This file is deprecated as the new API returns posts in the correct format
// Keeping it for reference but it's no longer used

// import type { Post } from "../entities/post.entity";
// import type { PostResponse } from "./post.response";

// export class PostAssembler {
//     public static toEntityFromResponse(response: PostResponse): Post {
//         return {
//             postId: response.postId, // Changed from id to postId
//             communityId: response.communityId,
//             authorId: response.authorId,
//             content: response.content,
//             images: response.images || [],
//             type: response.type || "message",
//             createdAt: response.createdAt,
//             updatedAt: response.updatedAt,
//         };
//     }

//     public static toEntitiesFromResponse(responses: PostResponse[]): Post[] {
//         return responses.map((response) =>
//             PostAssembler.toEntityFromResponse(response),
//         );
//     }
// }
