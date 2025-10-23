"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import type { ProfileResponse } from "@/services/internal/profiles/controller/profile.response";

interface SearchProfileCardProps {
    profile: ProfileResponse;
}

export function SearchProfileCard({ profile }: SearchProfileCardProps) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/dashboard/profile/${profile.id}`);
    };

    return (
        <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={handleClick}
        >
            <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                        <AvatarImage src={profile.profileUrl} alt={profile.username} />
                        <AvatarFallback>
                            {profile.firstName?.[0]}{profile.lastName?.[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">
                            {profile.firstName} {profile.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                            @{profile.username}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}