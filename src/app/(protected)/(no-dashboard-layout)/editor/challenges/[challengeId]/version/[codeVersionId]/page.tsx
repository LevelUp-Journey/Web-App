import { serialize } from "next-mdx-remote-client/serialize";
import StudentCodeEditor from "@/components/challenges/student-code-editor";
import { ChallengeController } from "@/services/internal/challenges/controller/challenge.controller";
import { CodeVersionController } from "@/services/internal/challenges/controller/code-version.controller";
import { VersionTestController } from "@/services/internal/challenges/controller/versions-test.controller";
import type { Challenge } from "@/services/internal/challenges/entities/challenge.entity";
import type { CodeVersion } from "@/services/internal/challenges/entities/code-version.entity";
import type { VersionTest } from "@/services/internal/challenges/entities/version-test.entity";

interface PageProps {
    params: Promise<{ challengeId: string; codeVersionId: string }>;
}

export default async function StudentEditorPage({ params }: PageProps) {
    const { challengeId, codeVersionId } = await params;

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

    // Filter out secret tests for students
    const publicTests = tests.filter((test) => !test.isSecret);

    // Serialize the description for client-side rendering
    const serializedDescription = challenge.description
        ? await serialize({ source: challenge.description })
        : null;

    return (
        <StudentCodeEditor
            challenge={challenge}
            codeVersion={codeVersion}
            tests={publicTests}
            serializedDescription={serializedDescription}
        />
    );
}
