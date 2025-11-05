import { Code2, Trophy } from "lucide-react";
import ChallengeCard from "@/components/cards/challenge-card";
import { ChallengeController } from "@/services/internal/challenges/challenge/controller/challenge.controller";
import { CodeVersionController } from "@/services/internal/challenges/challenge/controller/code-version.controller";

export default async function ChallengesPage() {
  // Fetch challenges
  const challenges = await ChallengeController.getPublicChallenges();

  // Get all challenge IDs
  const challengeIds = challenges.map((challenge) => challenge.id);

  // Fetch all code versions in a single batch request
  const codeVersionsBatch =
    await CodeVersionController.getCodeVersionsBatchByChallengesId(
      challengeIds,
    );

  // Create a map for easy lookup: challengeId -> codeVersions
  const codeVersionsMap = new Map(
    codeVersionsBatch.map((item) => [item.challengeId, item.codeVersions]),
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Code2 className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Coding Challenges
          </h1>{" "}
        </div>
        <p className="text-muted-foreground">
          Test your skills with {challenges.length} coding challenges across
          multiple programming languages
        </p>
      </header>

      {/* Challenges Grid */}
      {challenges.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              codeVersions={codeVersionsMap.get(challenge.id) || []}
            />
          ))}
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Trophy className="h-16 w-16 mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            No challenges available
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Check back soon for new coding challenges to test your skills
          </p>
        </div>
      )}
    </div>
  );
}
