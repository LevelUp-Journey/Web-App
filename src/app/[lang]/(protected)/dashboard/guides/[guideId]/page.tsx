import { Calendar, Heart } from "lucide-react";
import Image from "next/image";
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";
import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";
import { GuideViewer } from "@/components/learning/guide-viewer";

interface GuidePageProps {
    params: Promise<{ guideId: string }>;
}

export default async function GuidePage({ params }: GuidePageProps) {
    const { guideId } = await params;

    // Fetch guide and author in parallel
    const guide = await GuideController.getGuideById(guideId);

    if (!guide) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p>Guide not found</p>
            </div>
        );
    }

    const author = await ProfileController.getProfileByUserId(guide.authorIds[0]); // Get first author

    if (!author) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p>Author profile not available</p>
            </div>
        );
    }

    return (
        <GuideViewer
            guide={guide}
            author={author}
        />
    );
}
