import { SearchIcon } from "lucide-react";
import ChallengeCard from "@/components/cards/challenge-card";
import { Button } from "@/components/ui/button";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import { UserRole } from "@/lib/consts";
import { ChallengeController } from "@/services/internal/challenges/controller/challenge.controller";
import { CodeVersionController } from "@/services/internal/challenges/controller/code-version.controller";
import type { CodeVersion } from "@/services/internal/challenges/entities/code-version.entity";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";

export default async function ChallengesPage() {
    // Fetch challenges
    const challenges = await ChallengeController.getPublicChallenges();

    // Fetch code versions for each challenge
    const codeVersionsMap = new Map<string, CodeVersion[]>();
    await Promise.all(
        challenges.map(async (challenge) => {
            const versions =
                await CodeVersionController.getCodeVersionsByChallengeId(
                    challenge.id,
                );
            codeVersionsMap.set(challenge.id, versions);
        }),
    );

    return (
        <div className="space-y-4 w-full">
            {/* Search Bar - Centered */}
            <div className="flex justify-center pt-4">
                <div className="relative max-w-md w-full">
                    <InputGroup>
                        <InputGroupInput placeholder="Search..." />
                        <InputGroupAddon>
                            <SearchIcon />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">
                            <InputGroupButton>Search</InputGroupButton>
                        </InputGroupAddon>
                    </InputGroup>
                </div>
            </div>

            {/* Challenges List */}
            <div className="container mx-auto p-4 space-y-4">
                <h2 className="text-2xl font-semibold">Challenges</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {challenges.map((challenge) => (
                        <ChallengeCard
                            key={challenge.id}
                            challenge={challenge}
                            codeVersions={
                                codeVersionsMap.get(challenge.id) || []
                            }
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
