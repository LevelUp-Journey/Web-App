import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { ProfileResponse } from "@/services/internal/profiles/profiles/controller/profile.response";

interface GuideAuthorCardProps {
    author: ProfileResponse;
}

export function GuideAuthorCard({ author }: GuideAuthorCardProps) {
    return (
        <div className="flex items-start gap-4 p-6 border rounded-lg bg-muted/50">
            <Avatar className="h-16 w-16">
                <AvatarImage src={author.profileUrl} />
                <AvatarFallback className="text-lg">
                    {author.firstName[0]}
                    {author.lastName[0]}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
                <div>
                    <h3 className="font-semibold text-lg">
                        {author.firstName} {author.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        @{author.username}
                    </p>
                </div>

                <p className="text-sm text-muted-foreground">
                    Guide author and content creator
                </p>

                <Button variant="outline" size="sm" className="mt-2">
                    <User className="h-4 w-4 mr-2" />
                    View Profile
                </Button>
            </div>
        </div>
    );
}
