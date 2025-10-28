"use server";

import { authenticatedAction } from "@/services/internal/iam/auth/auth.actions";
import {
  CreateGuideRequest,
  UpdateGuideRequest,
} from "@/services/internal/learning/guides/infrastructure/guide.request";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const createGuideAction = authenticatedAction(
  z.object({
    title: z.string(),
    description: z.string(),
    markdownContent: z.string(),
  }),
  async (data: CreateGuideRequest, { session }) => {
    // TODO: Implement create guide logic
    console.log("Creating guide with data:", data, "and session:", session);

    revalidatePath("/admin/guides");

    return {
      id: "1",
      ...data,
    };
  }
);

export const updateGuideAction = authenticatedAction(
  z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    markdownContent: z.string(),
  }),
  async (data: UpdateGuideRequest, { session }) => {
    // TODO: Implement update guide logic
    console.log("Updating guide with data:", data, "and session:", session);

    revalidatePath("/admin/guides");
    revalidatePath(`/guides/${data.id}`);

    return {
      id: data.id,
      ...data,
    };
  }
);

export const deleteGuideAction = authenticatedAction(
  z.object({
    id: z.string(),
  }),
  async ({ id }: { id: string }, { session }) => {
    // TODO: Implement delete guide logic
    console.log("Deleting guide with id:", id, "and session:", session);

    revalidatePath("/admin/guides");

    return {
      id,
    };
  }
);

export const changeGuideStatusAction = authenticatedAction(
    z.object({
        id: z.string(),
        status: z.enum(["DRAFT", "PUBLISHED", "PROTECTED"]),
    }),
    async (data: { id: string; status: "DRAFT" | "PUBLISHED" | "PROTECTED" }, { session }) => {
        // TODO: Implement change guide status logic
        console.log("Changing guide status with data:", data, "and session:", session);

        revalidatePath("/admin/guides");
        revalidatePath(`/guides/${data.id}`);

        return {
            id: data.id,
            status: data.status,
        };
    }
);