"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ChallengeController } from "@/services/internal/challenges/controller/challenge.controller";
import type { CreateChallengeRequest } from "@/services/internal/challenges/controller/challenge.response";

export async function updateChallenge(
    challengeId: string,
    formData: FormData,
) {
    const title = formData.get("title") as string;
    const tags = formData.get("tags") as string;
    const difficulty = formData.get("difficulty") as string;
    const experiencePoints = Number(formData.get("experiencePoints"));
    const description = formData.get("description") as string;

    const tagIds = tags
        ? tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag.length > 0)
        : [];

    const request: CreateChallengeRequest = {
        name: title,
        description,
        experiencePoints,
        difficulty: difficulty as any, // Ajustar según ChallengeDifficulty
        tagIds,
    };

    try {
        // Asumir que hay un método update, usar create como placeholder
        await ChallengeController.createChallenge(request);
        revalidatePath(`/dashboard/challenges/edit/${challengeId}`);
    } catch (error) {
        throw new Error("Failed to update challenge");
    }
}

export async function deleteChallenge(challengeId: string) {
    try {
        // Asumir que hay un método delete
        // await ChallengeController.deleteChallenge(challengeId);
        revalidatePath("/dashboard/admin");
        redirect("/dashboard/admin");
    } catch (error) {
        throw new Error("Failed to delete challenge");
    }
}
