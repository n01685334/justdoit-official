import type {
  ApiResponse,
  CommentResponse,
  CreateTaskPayload,
  ProjectResponse,
  TaskResponse,
  UserProjectsResponse,
  UserResponse,
} from "@/types/api";


const getBaseURL = () => {
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

export const getUserById = async (userId: string): Promise<UserResponse> => {
  try {
    // const response = await fetch(`/api/users/${userId}`);
	 const baseURL = getBaseURL();
    // If baseURL is empty string, fetch will use relative path
    const fetchUrl = baseURL
      ? `${baseURL}/api/users/${userId}`
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
  try{
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
  }catch(err){
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
  try{
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/comments/${taskId}`)

    const result = await response.json()
    console.log("getCommentsById: " + JSON.stringify(result))
    return { success: true, data: result };
  }catch(err){
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error"
    };
  }
}

export const deleteCommentById = async (
  taskId : string,
  commentId : string
): Promise<{
  success: boolean;
  error?: string;
  data?: CommentResponse[];
}> => {
  try{
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
  }catch(err){
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error"
    };
  }
}