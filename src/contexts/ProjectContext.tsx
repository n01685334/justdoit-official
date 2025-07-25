"use client";

import {
  createContext, useCallback, useContext,
  useState
} from "react";
import type { ProjectResponse, ProjectTask, UserResponse } from "@/types/api";
import { DragState, ProjectContextType } from "@/types/types";

/**
 * Project context provider for managing project state, tasks, and drag-and-drop operations.
 * Handles task CRUD operations, column movements, project updates, member invitations,
 * and provides drag state management for kanban board functionality.
 * Requires user authentication and initial project data to function.
 */

export const ProjectContext = createContext<ProjectContextType | undefined>(
  undefined
);

export const ProjectProvider = ({
  initialProject,
  user,
  children,
}: {
  user: UserResponse;
  initialProject: ProjectResponse;
  children: React.ReactNode;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [project, setProject] = useState(initialProject);
  const [dragState, setDragState] = useState<DragState>({
    draggedTaskId: null,
    fromColumnId: null,
    isDragging: false,
  });

  const addTask = (columnId: string, newTask: ProjectTask) => {
    console.log("ProjectContext.AddTask");
    setProject((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        columns: prev.columns.map((col) => {
          return col._id === columnId
            ? { ...col, tasks: [...col.tasks, newTask] }
            : col;
        }),
      };
    });
  };

  const removeTask = (taskId: string) => {
    setProject((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        columns: prev.columns.map((column) => ({
          ...column,
          tasks: column.tasks.filter((task) => task._id !== taskId),
        })),
      };
    });
  };

  const setTaskLoading = (taskId: string, loading: boolean) => {
    setProject((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        columns: prev.columns.map((column) => ({
          ...column,
          tasks: column.tasks.map((task) =>
            task._id === taskId ? { ...task, isLoading: loading } : task
          ),
        })),
      };
    });
  };

  const updateTask = (taskId: string, updatedTask: ProjectTask) => {
    setProject((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        columns: prev.columns.map((column) => ({
          ...column,
          tasks: column.tasks.map((task) =>
            task._id === taskId ? updatedTask : task
          ),
        })),
      };
    });
  };

  const moveTaskToColumn = (
    taskId: string,
    fromColumnId: string,
    toColumnId: string,
    dropIndex?: number
  ) => {
    const fromColumnName = project.columns.find(
      (c) => c._id === fromColumnId
    )?.name;
    const toColumnName = project.columns.find(
      (c) => c._id === toColumnId
    )?.name;

    console.log("Moving task columns...");
    console.log(`FROM: ${fromColumnId} / ${fromColumnName}`);
    console.log(`TO: ${toColumnId} / ${toColumnName}`);
    console.log(`DROP INDEX: ${dropIndex}`);

    setProject((prev) => {
      if (!prev) return prev;

      // Find task to move
      let taskToMove: ProjectTask | null = null;
      const sourceColumn = prev.columns.find((col) => col._id === fromColumnId);
      if (sourceColumn) {
        taskToMove = sourceColumn.tasks.find((t) => t._id === taskId) || null;
      }

      if (!taskToMove) return prev;

      return {
        ...prev,
        columns: prev.columns.map((column) => {
          if (column._id === fromColumnId && column._id === toColumnId) {
            // Same column reorder - handle specially
            const newTasks = [...column.tasks];
            const currentIndex = newTasks.findIndex((t) => t._id === taskId);

            // Remove task from current position
            newTasks.splice(currentIndex, 1);

            // Adjust dropIndex if moving backwards
            const adjustedDropIndex =
              dropIndex !== undefined && dropIndex > currentIndex
                ? dropIndex - 1
                : dropIndex;

            // Insert at new position
            if (adjustedDropIndex !== undefined) {
              newTasks.splice(adjustedDropIndex, 0, taskToMove);
            } else {
              newTasks.push(taskToMove);
            }

            return { ...column, tasks: newTasks };
          } else if (column._id === fromColumnId) {
            // Remove from source column (different column move)
            return {
              ...column,
              tasks: column.tasks.filter((t) => t._id !== taskId),
            };
          } else if (column._id === toColumnId) {
            // Add to target column (different column move)
            const newTasks = [...column.tasks];
            if (dropIndex !== undefined) {
              newTasks.splice(dropIndex, 0, taskToMove);
            } else {
              newTasks.push(taskToMove);
            }
            return { ...column, tasks: newTasks };
          }
          return column;
        }),
      };
    });
  };

  const updateProject = async (payload: { name?: string }) => {
    await fetch(`/api/projects/${project.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setProject((prev) => prev && { ...prev, ...payload });
  };

  // const inviteMember = async (payload: { email: string }) => {
  //   const res = await fetch(`/api/projects/${project.slug}/members`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ ...payload, role: "member" }),
  //   });

  //   const response = await res.json();

  //   if (response.data) {
  //     console.log(response.data)
  //     // ideally re-fetch members, but here we just append
  //     setProject(
  //       (prev) =>
  //         prev && {
  //           ...prev,
  //           members: [
  //             ...prev.members,
  //             { user: { _id: "", name: payload.email }, role: "member" },
  //           ],
  //         }
  //     );
  //   }
  // };

  const inviteMember = useCallback(
    async (payload: { email: string }) => {
      const res = await fetch(`/api/projects/${project.slug}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, role: "member" }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Invite failed");
      }
      setProject((prev) => (prev ? { ...prev, members: json.data } : prev));
    },
    [project.slug]
  );

  const contextValue = {
    isLoading: loading,
    error,
    project,
    user,
    addTask,
    removeTask,
    setTaskLoading,
    updateTask,
    moveTaskToColumn,
    dragState,
    setDragState,
    updateProject,
    inviteMember,
    isOwner: project?.owner?._id === user?._id,
  };

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject musted be used inside ProjectProvider");
  }

  return context;
}
