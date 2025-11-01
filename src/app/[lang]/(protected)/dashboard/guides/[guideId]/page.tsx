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
    const author = await ProfileController.getProfileByUserId(guide.authorIds[0]); // Get first author

    return (
        <GuideViewer
            guide={guide}
            author={author}
        />
    );
}
