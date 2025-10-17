import { UIVersion } from "@/lib/consts";
import type { Challenge } from "@/services/internal/challenges/entities/challenge.entity";
import { Badge } from "../ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";

const VERSION = UIVersion.A;

export default function ChallengeCard({ challenge }: { challenge: Challenge }) {
    if (VERSION === UIVersion.A) {
        return (
            <Card
                key={challenge.id}
                className="hover:shadow-lg transition-shadow"
            >
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        {challenge.name}
                        <Badge variant="secondary">
                            {challenge.experiencePoints} XP
                        </Badge>
                    </CardTitle>
                    <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {challenge.tags.map((tag) => (
                            <Badge
                                key={tag.id}
                                style={{
                                    backgroundColor: tag.color,
                                }}
                            >
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                        Status: {challenge.status}
                    </p>
                </CardContent>
            </Card>
        );
    } else if (VERSION === UIVersion.B) {
        return (
            <div className="card">
                <div className="card-header">
                    <h5 className="card-title">{challenge.name}</h5>
                </div>
            </div>
        );
    }
    return (
        <div className="card">
            <div className="card-header">
                <h5 className="card-title">{challenge.name}</h5>
            </div>
        </div>
    );
}
