import mongoose from "mongoose";
import type {
  ApiResponse,
  CommentResponse,
  CreateTaskPayload,
  createProjectPayload,
  ProjectResponse,
  TaskResponse,
  UserProjectsResponse,
  UserResponse,
} from "@/types/api";

const getBaseURL = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side: use relative URLs
    return '';
  }
  // Server-side:
  // If NEXT_PUBLIC_BASE_URL is set (full URL with protocol), use it
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  // If running on Vercel, VERCEL_URL is the host (e.g., my-app.vercel.app)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Fallback to localhost
  return 'http://localhost:3000';
};
const BASE_URL = getBaseURL();


export const getUserById = async (userId: string): Promise<UserResponse> => {
  try {
    // const response = await fetch(`/api/users/${userId}`);
    // If baseURL is empty string, fetch will use relative path
    const fetchUrl = BASE_URL
      ? `${BASE_URL}/api/users/${userId}`
      : `/api/users/${userId}`;
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      console.error("Error getting user data: ", await response.json());
      throw new Error("failed to fetch user data");
    }

    const { data }: ApiResponse<UserResponse> = await response.json();

    if (!data) {
      throw new Error("No user data returned from API");
    }

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getProjectBySlug = async (
  projectSlug: string
): Promise<ProjectResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${projectSlug}`
    );

    if (!response.ok) {
      console.error("Error fetching project: ", await response.json());
      throw new Error("failed to fetch project data");
    }

    const { data }: ApiResponse<ProjectResponse> = await response.json();

    if (!data) {
      throw new Error("No user project returned from API: ");
    }

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getUserProjects = async (
  userId: string
): Promise<UserProjectsResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/user/${userId}`
    );

    if (!response.ok) {
      console.error("Error fetching projects: ", await response.json());
      throw new Error(`failed to fetch project data for user: ${userId}`);
    }

    const { data }: ApiResponse<UserProjectsResponse> = await response.json();

    if (!data) {
      throw new Error("No user projects returned from API");
    }

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const createTask = async (
  taskData: CreateTaskPayload
): Promise<{ task_id?: string; error?: string }> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { error: error.error || "Failed to create task" };
    }
    const result = await response.json();
    return { task_id: result.created_task_id };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
};

export const deleteTask = async (
  taskId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/${taskId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || "Failed to delete task" };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
};

export const updateTask = async (
  taskId: string,
  taskData: Partial<CreateTaskPayload>
): Promise<{
  success: boolean;
  error?: string;
  data?: TaskResponse;
}> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/${taskId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || "Failed to update task" };
    }

    const result = await response.json();
    return { success: true, data: result.data };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
};

// Commenting Feature CRUD
export const addComment = async (
  content: string,
  taskId: string,
  userId: string
): Promise<{
  success: boolean;
  error?: string;
  data?: string;
}> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/comments/${taskId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content,
          author: userId
        }),
      }
    );

    const result = await response.json();
    return { success: true, data: result.data };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error"
    };
  }
}

export const getCommentsById = async (
  taskId: string
): Promise<{
  success: boolean;
  error?: string;
  data?: CommentResponse[];
}> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/comments/${taskId}`)

    const result = await response.json()
    console.log("getCommentsById: " + JSON.stringify(result))
    return { success: true, data: result };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error"
    };
  }
}

export const deleteCommentById = async (
  taskId: string,
  commentId: string
): Promise<{
  success: boolean;
  error?: string;
  data?: CommentResponse[];
}> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/comments/${taskId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentId: commentId
        }),
      }
    );

    const result = await response.json()
    return { success: true, data: result };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error"
    };
  }
}

export const createProject = async (projectData: createProjectPayload) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData)
      }

    )
    if (!response.ok) {
      const error = await response.json()
      return { error: error.error || "Failed to create project" }
    }
    const result = await response.json()
    return { project_slug: result.project_slug }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }

}

export const updateProject = async (projectSlug: string, projectData: Partial<createProjectPayload>):
  Promise<{ success: boolean, error?: string, data?: ProjectResponse }> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${projectSlug}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || "Failed to update project" };
    }

    const result = await response.json();
    return { success: true, data: result.data };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export const deleteProject = async (projectSlug: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${projectSlug}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || "Failed to delete project" };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}


export const cascadeDeleteProject = async (projectId: string) => {
  try {

    const Column = mongoose.models.Column;
    const Tag = mongoose.models.Tag;
    const Task = mongoose.models.Task;
    const Comment = mongoose.models.Comment;
    // Find all columns associated with the project
    const columns = await Column.find({ project: projectId });
    const columnIds = columns.map(col => col._id);

    // Find all tasks within those columns
    const tasks = await Task.find({ column: { $in: columnIds } });
    const taskIds = tasks.map(task => task._id);

    // Delete all comments for those tasks
    if (taskIds.length > 0) {
      await Comment.deleteMany({ task: { $in: taskIds } });
      await Task.deleteMany({ _id: { $in: taskIds } });
    }

    // Delete all columns
    if (columnIds.length > 0) {
      await Column.deleteMany({ _id: { $in: columnIds } });
    }

    // Delete all tags for the project
    await Tag.deleteMany({ project: projectId });

    console.log("Cascade deletion completed for project:", projectId);
  } catch (error) {
    console.error("Error during cascade delete:", error);
    throw error;
  }
}