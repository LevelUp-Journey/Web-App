"use server";

import { authenticatedAction } from "@/services/internal/iam/auth/auth.actions";
import {
    CreateCourseRequest,
    UpdateCourseRequest,
} from "@/services/internal/learning/courses/infrastructure/course.request";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const createCourseAction = authenticatedAction(
    z.object({
        title: z.string(),
        description: z.string(),
        difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
        completionScore: z.number(),
    }),
    async (data: CreateCourseRequest, { session }) => {
        // TODO: Implement create course logic
        console.log(
            "Creating course with data:",
            data,
            "and session:",
            session,
        );

        revalidatePath("/admin/courses");

        return {
            id: "1",
            ...data,
        };
    },
);

export const updateCourseAction = authenticatedAction(
    z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
        completionScore: z.number(),
    }),
    async (data: UpdateCourseRequest, { session }) => {
        // TODO: Implement update course logic
        console.log(
            "Updating course with data:",
            data,
            "and session:",
            session,
        );

        revalidatePath("/admin/courses");
        revalidatePath(`/courses/${data.id}`);

        return {
            id: data.id,
            ...data,
        };
    },
);

export const publishCourseAction = authenticatedAction(
    z.object({
        id: z.string(),
    }),
    async ({ id }: { id: string }, { session }) => {
        // TODO: Implement publish course logic
        console.log("Publishing course with id:", id, "and session:", session);

        revalidatePath("/admin/courses");
        revalidatePath(`/courses/${id}`);

        return {
            id,
            status: "PUBLISHED",
        };
    },
);

export const unpublishCourseAction = authenticatedAction(
    z.object({
        id: z.string(),
    }),
    async ({ id }: { id: string }, { session }) => {
        // TODO: Implement unpublish course logic
        console.log(
            "Unpublishing course with id:",
            id,
            "and session:",
            session,
        );

        revalidatePath("/admin/courses");
        revalidatePath(`/courses/${id}`);

        return {
            id,
            status: "DRAFT",
        };
    },
);

export const deleteCourseAction = authenticatedAction(
    z.object({
        id: z.string(),
    }),
    async ({ id }: { id: string }, { session }) => {
        // TODO: Implement delete course logic
        console.log("Deleting course with id:", id, "and session:", session);

        revalidatePath("/admin/courses");

        return {
            id,
        };
    },
);
