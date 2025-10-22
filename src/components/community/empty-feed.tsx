import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyFeedProps {
    onCreatePost: () => void;
}

export function EmptyFeed({ onCreatePost }: EmptyFeedProps) {
    return (
        <Card>
            <CardContent className="p-8 text-center">
                <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                <p className="text-muted-foreground mb-4">
                    Be the first to share something in the community!
                </p>
                <Button onClick={onCreatePost}>
                    Create First Post
                </Button>
            </CardContent>
        </Card>
    );
}