import { Heart, MessageSquare, Share } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Post } from "@/services/internal/community/entities/post.entity";

interface FeedPostCardProps {
    post: Post & {
        authorProfile: {
            username: string;
            profileUrl?: string;
            firstName?: string;
            lastName?: string;
        };
        authorProfileId: string;
    };
}

export function FeedPostCard({ post }: FeedPostCardProps) {
    const author = post.authorProfile;

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                        <AvatarImage
                            src={author.profileUrl}
                            alt={author.username}
                        />
                        <AvatarFallback>
                            {author.firstName?.[0]}
                            {author.lastName?.[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">
                            {author.firstName} {author.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            @{author.username}
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="mb-4">{post.content}</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm">
                            <Heart className="h-4 w-4 mr-1" />
                            Like
                        </Button>
                        <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Comment
                        </Button>
                        <Button variant="ghost" size="sm">
                            <Share className="h-4 w-4 mr-1" />
                            Share
                        </Button>
                    </div>
                    <span className="text-xs text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
