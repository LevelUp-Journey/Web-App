import { ChallengesSection } from "@/components/dashboard/challenges-section";
import UpNextSection from "@/components/dashboard/up-next-section";
import UniversityAnnouncements from "@/components/dashboard/university-announcements";
import { Flame } from "lucide-react";
import { getDictionary } from "@/lib/i18n";

export default async function DashboardPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang as "en" | "es");

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Announcements */}
            <UniversityAnnouncements />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                {/* Left Column - Up Next and Featured Challenges */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Up Next Card */}
                    <UpNextSection dict={dict} />

                    {/* Featured Challenges Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">
                            {dict.dashboardPage.featuredChallenges}
                        </h2>
                        <ChallengesSection
                            translations={{
                                loading: dict.challenges.loading,
                                error: dict.challenges.errorFetching,
                                errorDescription:
                                    dict.challenges.errorDescription,
                                retry: dict.challenges.retry,
                            }}
                        />
                    </div>
                </div>

                {/* Right Column - Streak and Progress */}
                <div className="space-y-6">
                    {/* Streak Card */}
                    <div>
                        <h3 className="text-xl font-semibold mb-3 flex items-center">
                            <Flame className="w-5 h-5 mr-2 text-orange-500" />
                            {dict.dashboardPage.streak.title}
                        </h3>
                        <div className="bg-card border rounded-lg p-6 shadow-sm">
                            <div className="text-center text-muted-foreground/75">
                                <p className="text-lg font-medium">
                                    {dict.dashboardPage.streak.comingSoon}
                                </p>
                                <p className="text-sm mt-2">
                                    {dict.dashboardPage.streak.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Card */}
                    <div className="bg-card border rounded-lg p-6 shadow-sm">
                        <div className="text-left">
                            <h3 className="text-xl font-semibold mb-4 text-foreground">
                                {dict.dashboardPage.progress.title}
                            </h3>

                            <div className="text-center text-muted-foreground/75">
                                <p className="text-lg font-medium">
                                    {dict.dashboardPage.progress.comingSoon}
                                </p>
                                <p className="text-sm mt-2">
                                    {dict.dashboardPage.progress.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Achievements Card */}
                    <div className="bg-card border rounded-lg p-6 shadow-sm">
                        <div className="text-left">
                            <h3 className="text-xl font-semibold mb-4 text-foreground">
                                {dict.dashboardPage.achievements.title}
                            </h3>

                            <div className="text-center text-muted-foreground/75">
                                <p className="text-lg font-medium">
                                    {dict.dashboardPage.achievements.comingSoon}
                                </p>
                                <p className="text-sm mt-2">
                                    {
                                        dict.dashboardPage.achievements
                                            .description
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
