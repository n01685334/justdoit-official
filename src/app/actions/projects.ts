"use server";
import { revalidatePath } from "next/cache";
import { deleteProject } from "@/lib/api/api-helpers";

export async function deleteProjectAction(projectSlug: string) {
    try {
        const result = await deleteProject(projectSlug);
        if (result.success) {
            revalidatePath("/projects");
        }
    } catch (error) {
        console.error("Failed to delete project:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        }
    }
}