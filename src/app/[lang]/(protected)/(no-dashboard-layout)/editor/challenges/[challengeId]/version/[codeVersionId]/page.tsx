import { serialize } from "next-mdx-remote-client/serialize";
import StudentCodeEditor from "@/components/challenges/student-code-editor";
import { ChallengeController } from "@/services/internal/challenges/challenge/controller/challenge.controller";
import { CodeVersionController } from "@/services/internal/challenges/challenge/controller/code-version.controller";
import { VersionTestController } from "@/services/internal/challenges/challenge/controller/versions-test.controller";
import type { Challenge } from "@/services/internal/challenges/challenge/entities/challenge.entity";
import type { CodeVersion } from "@/services/internal/challenges/challenge/entities/code-version.entity";
import type { VersionTest } from "@/services/internal/challenges/challenge/entities/version-test.entity";
import type { SolutionResponse } from "@/services/internal/challenges/solutions/controller/solutions.response";
import { getSolutionByChallengeIdAndCodeVersionIdAction } from "@/services/internal/challenges/solutions/server/solutions.actions";

interface PageProps {
    params: Promise<{
        challengeId: string;
        codeVersionId: string;
        lang: string;
    }>;
}

export default async function StudentEditorPage({ params }: PageProps) {
    const { challengeId, codeVersionId } = await params;

    // Fetch all data on the server
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

    // Fetch student's solution
    let solution: SolutionResponse | null = null;
    try {
        solution = await getSolutionByChallengeIdAndCodeVersionIdAction({
            challengeId,
            codeVersionId,
        });
        console.log("STUDENT SOLUTION:", solution);

        // If solution exists but code is null, use initialCode
        if (solution && solution.code === null) {
            solution = {
                ...solution,
                code: codeVersion.initialCode,
            };
        }
    } catch {
        // No solution exists yet, will use initialCode
        console.log("No solution found, using initial code");
    }

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
                tests={tests}
                serializedDescription={serializedDescription}
                solution={solution}
            />
        </div>
    );
}
