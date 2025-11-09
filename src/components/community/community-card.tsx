import type { Community } from "@/services/internal/community/entities/community.entity";

interface CommunityCardProps {
    community: Community;
    username: string;
    adminMode: boolean;
}

export function CommunityCard({
    community,
    username,
    adminMode,
}: CommunityCardProps) {
    return (
        <div className="border rounded-lg p-4">
            <h3 className="font-semibold">{community.name}</h3>
            <p className="text-sm text-muted-foreground">
                {community.description}
            </p>
            <p className="text-xs">Owner: {username}</p>
            {adminMode && <p className="text-xs">Admin Mode</p>}
        </div>
    );
}
