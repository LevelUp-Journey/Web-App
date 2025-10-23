import Image from "next/image";
import Link from "next/link";
import { serialize } from "next-mdx-remote-client/serialize";
import StudentCodeEditor from "@/components/challenges/student-code-editor";
import { getLocalizedPaths } from "@/lib/paths";
import { ChallengeController } from "@/services/internal/challenges/challenge/controller/challenge.controller";
import { CodeVersionController } from "@/services/internal/challenges/challenge/controller/code-version.controller";
import { VersionTestController } from "@/services/internal/challenges/challenge/controller/versions-test.controller";
import type { Challenge } from "@/services/internal/challenges/challenge/entities/challenge.entity";
import type { CodeVersion } from "@/services/internal/challenges/challenge/entities/code-version.entity";
import type { VersionTest } from "@/services/internal/challenges/challenge/entities/version-test.entity";

interface PageProps {
    params: Promise<{
        challengeId: string;
        codeVersionId: string;
        lang: string;
    }>;
}

export default async function StudentEditorPage({ params }: PageProps) {
    const { challengeId, codeVersionId, lang } = await params;
    const PATHS = getLocalizedPaths(lang);

    // Fetch data on the server
    const challenge: Challenge =
        await ChallengeController.getChallengeById(challengeId);
    const codeVersion: CodeVersion =
        await CodeVersionController.getCodeVersionById(
            challengeId,
            codeVersionId,
        );
    const tests: VersionTest[] =
        await VersionTestController.getVersionTestsByChallengeIdAndCodeVersionId(
            challengeId,
            codeVersionId,
        );

    // Show all tests, including secret ones
    const allTests = tests;

    // Serialize the description for client-side rendering
    const serializedDescription = challenge.description
        ? await serialize({ source: challenge.description })
        : null;

    return (
        <div className="min-h-screen bg-background">
            {/* Editor */}
            <StudentCodeEditor
                challenge={challenge}
                codeVersion={codeVersion}
                tests={allTests}
                serializedDescription={serializedDescription}
            />
        </div>
    );
}
