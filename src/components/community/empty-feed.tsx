import { MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyFeed() {
    return (
        <Card>
            <CardContent className="p-8 text-center">
                <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                <p className="text-muted-foreground mb-4">
                    Posts will appear here once members start sharing content.
                </p>
            </CardContent>
        </Card>
    );
}
