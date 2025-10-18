import { Star } from "lucide-react";
import { UIVersion } from "@/lib/consts";
import { CodeVersionController } from "@/services/internal/challenges/controller/code-version.controller";
import type { Challenge } from "@/services/internal/challenges/entities/challenge.entity";
import { Badge } from "../ui/badge";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import CodeVersionBadge from "./code-version-badge";

const VERSION: UIVersion = UIVersion.B;

export default async function ChallengeCard({
    challenge,
}: {
    challenge: Challenge;
}) {
    const codeVersions =
        await CodeVersionController.getCodeVersionsByChallengeId(challenge.id);

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
                    <div>
                        {codeVersions.map((version) => (
                            <CodeVersionBadge
                                key={version.id}
                                version={version}
                            />
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
            <Card
                key={challenge.id}
                className="hover:shadow-lg transition-shadow"
            >
                <CardHeader className="flex items-center justify-between flex-row">
                    <CardTitle className="flex items-center justify-between">
                        {challenge.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 ">
                        <Star className="text-yellow-400" size={18} />
                        {challenge.stars.length}
                    </div>
                </CardHeader>
                <CardContent>
                    <div>
                        {codeVersions.map((version) => (
                            <CodeVersionBadge
                                key={version.id}
                                version={version}
                            />
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
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
                </CardFooter>
            </Card>
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
