export interface Community {
    id: string;
    ownerId: string;
    ownerProfileId: string;
    name: string;
    description: string;
    imageUrl?: string;
    createdAt: Date;
    followerCount: number;
}
