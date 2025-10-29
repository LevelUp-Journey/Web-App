"use server";

import { authenticatedAction } from "@/services/internal/iam/auth/auth.actions";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const addGuideToCourseAction = authenticatedAction(
    z.object({
        guideId: z.string(),
        courseId: z.string(),
        orderIndex: z.number(),
    }),
    async (
        data: { guideId: string; courseId: string; orderIndex: number },
        { session },
    ) => {
        // TODO: Implement add guide to course logic
        console.log(
            "Adding guide to course with data:",
            data,
            "and session:",
            session,
        );

        revalidatePath(`/courses/${data.courseId}`);

        return {
            ...data,
        };
    },
);

export const removeGuideFromCourseAction = authenticatedAction(
    z.object({
        guideId: z.string(),
        courseId: z.string(),
    }),
    async (data: { guideId: string; courseId: string }, { session }) => {
        // TODO: Implement remove guide from course logic
        console.log(
            "Removing guide from course with data:",
            data,
            "and session:",
            session,
        );

        revalidatePath(`/courses/${data.courseId}`);

        return {
            ...data,
        };
    },
);
