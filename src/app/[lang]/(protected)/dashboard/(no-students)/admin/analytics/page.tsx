import { AlertCircle, BarChart3 } from "lucide-react";
import { getDictionary } from "@/app/[lang]/dictionaries";
import { Card, CardContent } from "@/components/ui/card";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { AnalyticsController } from "@/services/internal/analytics/controller/analytics.controller";
import { AnalyticsOverviewCards } from "@/components/analytics/analytics-overview-cards";
import { LanguageKPIsCard } from "@/components/analytics/language-kpis-card";
import { TopFailedChallengesCard } from "@/components/analytics/top-failed-challenges-card";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang as "en" | "es");

    try {
        const analyticsData = await AnalyticsController.getAllKPIs(30, 10);

        const totalExecutions = analyticsData.dailyKPIs.reduce(
            (sum, day) => sum + (day.total_executions || 0),
            0,
        );

        const hasData =
            analyticsData.dailyKPIs.length > 0 ||
            analyticsData.languageKPIs.length > 0 ||
            analyticsData.topFailedChallenges.length > 0;

        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">
                        {dict.admin.analytics.title}
                    </h1>
                    <p className="text-muted-foreground">
                        {dict.admin.analytics.description}
                    </p>
                </div>

                <AnalyticsOverviewCards
                    totalUsers={analyticsData.totalUsers}
                    totalExecutions={totalExecutions}
                    activeLanguages={analyticsData.languageKPIs.length}
                    lang={lang}
                />

                <LanguageKPIsCard
                    languageKPIs={analyticsData.languageKPIs}
                    lang={lang}
                />

                <TopFailedChallengesCard
                    topFailedChallenges={analyticsData.topFailedChallenges}
                    lang={lang}
                />

                {!hasData && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">
                                {dict.admin.analytics.noData}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        );
    } catch (_error) {
        return (
            <Empty className="min-h-[400px]">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <AlertCircle />
                    </EmptyMedia>
                    <EmptyTitle>{dict.admin.analytics.error}</EmptyTitle>
                    <EmptyDescription>
                        {dict.admin.analytics.errorDescription}
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }
}
