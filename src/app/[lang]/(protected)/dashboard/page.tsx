import { ChallengesSection } from "@/components/dashboard/challenges-section";
import UniversityAnnouncements from "@/components/dashboard/university-announcements";

export default function DashboardPage() {
    return (
        <div className="space-y-4 w-full container mx-auto pt-4">
            {/* Carousel - Full Width */}
            <UniversityAnnouncements />

            <div className="container mx-auto p-4 space-y-4">
                <h2 className="text-2xl font-semibold">Challenges</h2>
                <ChallengesSection />
            </div>
        </div>
    );
}
