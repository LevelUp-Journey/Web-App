import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import type { SerializeResult } from "next-mdx-remote-client/csr";
import { serialize } from "next-mdx-remote-client/serialize";
import StudentCodeEditor from "@/components/challenges/student-code-editor";
import { mdxOptions } from "@/lib/mdx-config";
import { PATHS } from "@/lib/paths";
import { ChallengeController } from "@/services/internal/challenges/challenge/controller/challenge.controller";
import { CodeVersionController } from "@/services/internal/challenges/challenge/controller/code-version.controller";
import { VersionTestController } from "@/services/internal/challenges/challenge/controller/versions-test.controller";
import type { Challenge } from "@/services/internal/challenges/challenge/entities/challenge.entity";
import type { CodeVersion } from "@/services/internal/challenges/challenge/entities/code-version.entity";
import type { VersionTest } from "@/services/internal/challenges/challenge/entities/version-test.entity";
import type { SolutionResponse } from "@/services/internal/challenges/solutions/controller/solutions.response";
import { getSolutionByChallengeIdAndCodeVersionIdAction } from "@/services/internal/challenges/solutions/server/solutions.actions";
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";
import type { GuideResponse } from "@/services/internal/learning/guides/controller/guide.response";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";

interface PageProps {
    params: Promise<{
        challengeId: string;
        codeVersionId: string;
        lang: string;
    }>;
}

/**
 * Página del editor de código para estudiantes
 *
 * Esta página renderiza en el servidor y realiza todas las llamadas
 * necesarias para obtener los datos del challenge, version, tests y solución
 * del estudiante antes de renderizar el componente cliente.
 */
export default async function StudentEditorPage({ params }: PageProps) {
    const { challengeId, codeVersionId } = await params;

    const profile = await ProfileController.getCurrentUserProfile();

    // Validación de parámetros
    if (!challengeId || !codeVersionId || !profile) {
        notFound();
    }

    try {
        // Fetch paralelo de datos para mejor performance
        const [challenge, codeVersion, tests, solution] = await Promise.all([
            fetchChallenge(challengeId),
            fetchCodeVersion(challengeId, codeVersionId),
            fetchTests(challengeId, codeVersionId),
            fetchSolution(challengeId, codeVersionId),
        ]);

        // Fetch guides after getting challenge (since we need guide IDs)
        const guides = await fetchGuides(challenge);

        // Validación de datos críticos
        if (!challenge || !codeVersion) {
            notFound();
        }

        // Serializar la descripción del challenge para MDX
        const serializedDescription = await serializeDescription(
            challenge.description,
        );

        return (
            <div className="min-h-screen bg-background">
                <StudentCodeEditor
                    challenge={challenge}
                    codeVersion={codeVersion}
                    tests={tests}
                    serializedDescription={serializedDescription}
                    solution={solution}
                    guides={guides}
                    profile={profile}
                />
            </div>
        );
    } catch (error) {
        console.error("Error loading student editor page:", error);

        // Redirigir al dashboard en caso de error
        redirect(PATHS.DASHBOARD.ROOT);
    }
}

/**
 * Obtiene los datos del challenge
 */
async function fetchChallenge(challengeId: string): Promise<Challenge | null> {
    try {
        const challenge =
            await ChallengeController.getChallengeById(challengeId);
        return challenge;
    } catch (error) {
        console.error(`Error fetching challenge ${challengeId}:`, error);
        return null;
    }
}

/**
 * Obtiene los datos de la versión del código
 */
async function fetchCodeVersion(
    challengeId: string,
    codeVersionId: string,
): Promise<CodeVersion | null> {
    try {
        const codeVersion = await CodeVersionController.getCodeVersionById(
            challengeId,
            codeVersionId,
        );
        return codeVersion;
    } catch (error) {
        console.error(
            `Error fetching code version ${codeVersionId} for challenge ${challengeId}:`,
            error,
        );
        return null;
    }
}

/**
 * Obtiene los tests de la versión
 */
async function fetchTests(
    challengeId: string,
    codeVersionId: string,
): Promise<VersionTest[]> {
    try {
        const tests =
            await VersionTestController.getVersionTestsByChallengeIdAndCodeVersionId(
                challengeId,
                codeVersionId,
            );
        return tests || [];
    } catch (error) {
        console.error(
            `Error fetching tests for challenge ${challengeId} and version ${codeVersionId}:`,
            error,
        );
        // Retornar array vacío en caso de error - no es crítico
        return [];
    }
}

/**
 * Obtiene la solución del estudiante
 */
async function fetchSolution(
    challengeId: string,
    codeVersionId: string,
): Promise<SolutionResponse | null> {
    try {
        const solution = await getSolutionByChallengeIdAndCodeVersionIdAction({
            challengeId,
            codeVersionId,
        });
        return solution;
    } catch (error) {
        console.error(
            `Error fetching solution for challenge ${challengeId} and version ${codeVersionId}:`,
            error,
        );
        // Retornar null en caso de error - no es crítico, se usará código inicial
        return null;
    }
}

/**
 * Obtiene las guías relacionadas al challenge
 */
async function fetchGuides(
    challenge: Challenge | null,
): Promise<GuideResponse[]> {
    if (!challenge || !challenge.guides || challenge.guides.length === 0) {
        return [];
    }

    try {
        // Fetch guides by their IDs
        const guidePromises = challenge.guides.map((guideId) =>
            GuideController.getGuideById(guideId),
        );

        const guides = await Promise.all(guidePromises);
        // Filter out null results (failed fetches)
        return guides.filter((guide): guide is GuideResponse => guide !== null);
    } catch (error) {
        console.error(
            `Error fetching guides for challenge ${challenge.id}:`,
            error,
        );
        return [];
    }
}

/**
 * Serializa la descripción del challenge en formato MDX
 */
async function serializeDescription(
    description: string | null | undefined,
): Promise<SerializeResult | null> {
    if (!description) {
        return null;
    }

    try {
        const serialized = await serialize({
            source: description,
            ...mdxOptions,
        });
        return serialized;
    } catch (error) {
        console.error("Error serializing challenge description:", error);
        // Retornar null si hay error en serialización
        return null;
    }
}

/**
 * Genera metadata para SEO
 */
export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { challengeId } = await params;

    try {
        const challenge =
            await ChallengeController.getChallengeById(challengeId);

        if (!challenge) {
            return {
                title: "Challenge Not Found",
            };
        }

        return {
            title: `${challenge.name} - Code Editor`,
            description: challenge.description
                ? challenge.description.substring(0, 160)
                : "Solve coding challenges and level up your skills",
        };
    } catch (error) {
        console.error("Error generating metadata:", error);
        return {
            title: "Code Editor",
        };
    }
}
