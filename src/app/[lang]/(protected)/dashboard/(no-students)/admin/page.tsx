import { AlertCircle } from "lucide-react";
import { getDictionary } from "@/app/[lang]/dictionaries";
import ChallengeCard from "@/components/cards/challenge-card";
import GuideCard from "@/components/cards/guide-card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ChallengeController } from "@/services/internal/challenges/challenge/controller/challenge.controller";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "es");

  try {
    const userId = await AuthController.getUserId();

    const [challengesData, guidesData] = await Promise.all([
      ChallengeController.getChallengesByTeacherId(userId),
      GuideController.getAllGuides("dashboard"),
    ]);

    // Ordenar cada tipo por fecha de actualización (más reciente primero)
    const sortByUpdated = (arr: any[]) =>
      arr.sort(
        (a, b) =>
          new Date(b.updatedAt ?? 0).getTime() -
          new Date(a.updatedAt ?? 0).getTime(),
      );

    const sortedChallenges = sortByUpdated([...challengesData]);
    const sortedGuides = sortByUpdated([...guidesData]);

    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold tracking-tight">
          {dict?.admin.dashboard.title}
        </h2>

        {/* Challenges Row */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">
            {dict?.admin.dashboard.challenges}
          </h3>
          {sortedChallenges.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {dict?.admin.dashboard.noChallenges}
            </p>
          ) : (
            <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400">
              {sortedChallenges.map((challenge) => (
                <div key={challenge.id} className="min-w-[340px] shrink-0">
                  <ChallengeCard
                    challenge={challenge}
                    codeVersions={challenge.codeVersions ?? []}
                    adminMode={true}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Guides Row */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">
            {dict?.admin.dashboard.guides}
          </h3>
          {sortedGuides.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {dict?.admin.dashboard.noGuides}
            </p>
          ) : (
            <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400">
              {sortedGuides.map((guide) => (
                <div key={guide.id} className="min-w-[340px] shrink-0">
                  <GuideCard guide={guide} adminMode={true} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    );
  } catch (_error) {
    return (
      <Empty className="min-h-[400px]">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertCircle />
          </EmptyMedia>
          <EmptyTitle>{dict?.admin.dashboard.error}</EmptyTitle>
          <EmptyDescription>
            {dict?.admin.dashboard.errorDescription}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }
}
