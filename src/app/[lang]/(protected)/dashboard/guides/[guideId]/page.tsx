import { getDictionary } from "@/app/[lang]/dictionaries";
import { GuideViewer } from "@/components/learning/guide-viewer";
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";
import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";

interface GuidePageProps {
    params: Promise<{ guideId: string; lang: string }>;
}

export default async function GuidePage({ params }: GuidePageProps) {
    const { guideId, lang } = await params;
    const dict = await getDictionary(lang as "en" | "es");

    // Fetch guide and author in parallel
    const guide = await GuideController.getGuideById(guideId);

    if (!guide) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p>{dict.guides.notFound}</p>
            </div>
        );
    }

    const author = await ProfileController.getProfileByUserId(
        guide.authorIds[0],
    ); // Get first author

    if (!author) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p>{dict.guides.authorNotAvailable}</p>
            </div>
        );
    }

    return <GuideViewer guide={guide} author={author} />;
}
