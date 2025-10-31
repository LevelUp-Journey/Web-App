export interface CourseResponse {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    status: CourseStatus;
    likesCount: number;
    authorIds: string[];
    topics: [
        {
            id: string;
            name: string;
        },
    ];
    guides: [
        {
            id: string;
            title: string;
            description: string;
            coverImage: string;
            status: GuideStatus;
            likesCount: number;
            pagesCount: number;
            authorIds: string[];
            createdAt: Date;
        },
    ];
    createdAt: Date;
    updatedAt: Date;
}
