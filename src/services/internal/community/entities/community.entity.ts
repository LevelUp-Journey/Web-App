export interface Community {
    id: string;
    ownerId: string;
    ownerProfileId: string;
    name: string;
    description: string;
    bannerUrl?: string;
    iconUrl?: string;
    isPrivate: boolean;
    createdAt: Date;
    followerCount: number;
}
