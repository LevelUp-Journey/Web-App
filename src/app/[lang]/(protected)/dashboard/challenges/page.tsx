import { Code2 } from "lucide-react";
import { ChallengesPageSection } from "@/components/challenges/challenges-page-section";

export default function ChallengesPage() {
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
          </h1>
        </div>
        <p className="text-muted-foreground">
          Test your skills with coding challenges across multiple programming
          languages
        </p>
      </header>

      {/* Challenges Grid */}
      <ChallengesPageSection />
    </div>
  );
}
