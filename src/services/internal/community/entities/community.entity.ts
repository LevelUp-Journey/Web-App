export interface Community {
    id: string;
    ownerId: string;
    ownerProfileId?: string;
    name: string;
    description: string;
    iconUrl?: string | null;
    bannerUrl?: string | null;
    imageUrl?: string | null;
    isPrivate: boolean;
    createdAt: Date;
    updatedAt?: Date;
    followerCount: number;
}
