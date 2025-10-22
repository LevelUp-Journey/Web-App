export interface Community {
    id: string;
    ownerId: string;
    name: string;
    description: string;
    imageUrl?: string;
    createdAt: Date;
}