import CreateCodeVersionForm from "@/app/[lang]/(protected)/dashboard/challenges/[challengeId]/versions/create-form";

interface PageProps {
    params: Promise<{ challengeId: string }>;
}

export default async function CreateCodeVersionPage({ params }: PageProps) {
    const { challengeId } = await params;

    return <CreateCodeVersionForm challengeId={challengeId} />;
}
