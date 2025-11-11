"use client";

import { Pencil } from "lucide-react";
import CommunityCard from "@/components/community/community-card";
import { Button } from "@/components/ui/button";
import type { Community } from "@/services/internal/community/entities/community.entity";

interface CommunityCardWithActionsProps {
    community: Community;
    onEdit?: () => void;
}

export default function CommunityCardWithActions({
    community,
    onEdit,
}: CommunityCardWithActionsProps) {
    return (
        <div className="relative group">
            <CommunityCard community={community} />
            {onEdit && (
                <div className="absolute top-4 right-4">
                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 shadow-md"
                        onClick={onEdit}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
