import type { PageResponse } from "../controller/guide.response";

export interface Guide {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    status: string;
    likesCount: number;
    likedByRequester: boolean;
    pagesCount: number;
    authorIds: string[];
    topics: {
        id: string;
        name: string;
    }[];
    pages: PageResponse[];
    createdAt: string;
    updatedAt: string;
}
