"use client";

import { useRef, useState } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { updateTask } from "@/lib/api/api-helpers";
import type { ProjectResponse, ProjectTask } from "@/types/api";
import { getInitials } from "./HeaderUserMenu";
import { Attachment } from "./TaskAttachments";

interface User {
  id: string;
  name: string;
  initials: string;
  colorIndex: number;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  categoryId: number;
  status: string;
  tag?: string;
  assignee?: User;
  attachments?: Attachment[];
  commentCount?: number;
  comments?: {
    id: string;
    text: string;
    user: User;
  }[];
}

export interface TaskDropZoneProps {
  onDrop: () => void;
  className?: string;
}

const TaskCardSkeleton = (
  <li className="bg-gray-800 rounded-md border border-gray-700 p-4 shadow-sm max-w-80 animate-pulse">
    <div className="flex justify-between items-start">
      {/* Title skeleton */}
      <div className="h-6 bg-gray-600 rounded w-3/4"></div>
      {/* Assignee skeleton */}
      <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
    </div>
    {/* Description skeleton */}
    <div className="mt-2 space-y-2">
      <div className="h-4 bg-gray-600 rounded w-full"></div>
      <div className="h-4 bg-gray-600 rounded w-2/3"></div>
    </div>
  </li>
);

export const DropZone = ({ onDrop, className = "" }: TaskDropZoneProps) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop();
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
    <div
      className={`h-12 border-2 border-dashed border-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded transition-all duration-200 ${className}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    />
  );
};

const getDropIndex = (
  project: ProjectResponse,
  parentColId: string,
  taskId: string,
): number | null => {
  const currentColumn = project?.columns.find((col) => col._id === parentColId);
  const dropIndex = currentColumn?.tasks.findIndex((t) => t._id === taskId);

  return dropIndex === undefined || dropIndex < 0 ? null : dropIndex;
};

export const TaskCard = ({
  parentColumnId,
  task,
  onTaskClick,
}: {
  parentColumnId: string;
  task: ProjectTask & { isLoading?: boolean };
  onTaskClick: () => void;
}) => {


  const { project, dragState, setDragState, moveTaskToColumn } = useProject();
  const [showDropZone, setShowDropZone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { draggedTaskId, isDragging, fromColumnId } = dragState;

  if (task.name === "task 2") {
    console.log(task);
  }

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>) => {
    setDragState({
      draggedTaskId: task._id,
      fromColumnId: parentColumnId,
      isDragging: true,
    });

    e.dataTransfer.setData("taskId", task._id);
    e.dataTransfer.setData("fromColumn", parentColumnId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDragState({
      draggedTaskId: null,
      fromColumnId: null,
      isDragging: false,
    });
    setShowDropZone(false);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();

    // Don't show drop zone if:
    // 1. Dragging over self
    // 2. Same column and this is the next card after dragged card
    if (draggedTaskId !== task._id && isDragging) {
      if (fromColumnId === parentColumnId) {
        // Same column - check if this is the next position
        const currentColumn = project?.columns.find(
          (col) => col._id === parentColumnId,
        );
        const draggedIndex = currentColumn?.tasks.findIndex(
          (t) => t._id === draggedTaskId,
        );
        const thisIndex = currentColumn?.tasks.findIndex(
          (t) => t._id === task._id,
        );

        // Don't show drop zone if this card is immediately after the dragged card
        if (
          draggedIndex !== undefined &&
          thisIndex !== undefined &&
          thisIndex === draggedIndex + 1
        ) {
          return;
        }
      }

      setShowDropZone(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();

    // Only hide if leaving the task card entirely
    if (
      containerRef.current &&
      !containerRef.current.contains(e.relatedTarget as Node)
    ) {
      setShowDropZone(false);
    }
  };

  const handleDropZone = async () => {
    if (!draggedTaskId || !fromColumnId || !project) return;
    const dropIndex = getDropIndex(project, parentColumnId, task._id);
    if (dropIndex === null) return;

    moveTaskToColumn(draggedTaskId, fromColumnId, parentColumnId, dropIndex);

    setDragState({
      draggedTaskId: null,
      fromColumnId: null,
      isDragging: false,
    });

    const { success } = await updateTask(draggedTaskId, {
      column: parentColumnId,
      dropIndex: dropIndex,
    });

    if (!success) {
      // Revert optimistic update
      moveTaskToColumn(draggedTaskId, parentColumnId, fromColumnId);
    }
  };

  const handleDropOnTask = (e: React.DragEvent) => {
    e.preventDefault();
    if (!fromColumnId || !draggedTaskId || draggedTaskId === task._id) return;
    setShowDropZone(false);
  };

  if (task.isLoading) return TaskCardSkeleton;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDropOnTask}
      ref={containerRef}
    >
      {dragState.isDragging &&
        showDropZone &&
        dragState.draggedTaskId !== task._id && (
          <DropZone onDrop={handleDropZone} />
        )}
      {/** biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <li
        className={`bg-gray-800 draggable rounded-md border border-gray-700 p-4 cursor-pointer shadow-sm hover:shadow-md transition-shadow max-w-80`}
        data-task-id={task._id}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={onTaskClick}
      >
        <div className="flex justify-between items-start relative">
          <h3 className="text-lg font-medium text-blue-400">{task.name}</h3>
          {task.assignee && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 border border-orange-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              {getInitials(task.assignee.name)}
            </div>
          )}
        </div>
        <p className="mt-2 text-sm text-gray-400 line-clamp-2">
          {task.description}
        </p>
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            {/* Comment count */}
            {(task?.comments?.length ?? 0) > 0 && (
              <span className="flex items-center space-x-1">
                <span>💬</span>
                <span>{task.comments.length}</span>
              </span>
            )}

            {/* Attachment count */}
            {task.attachments && task.attachments.length > 0 && (
              <span className="flex items-center space-x-1">
                <span>📎</span>
                <span>{task.attachments.length}</span>
              </span>
            )}

            {/* Tag */}
            {task.tag && (
              <span
                className="px-2 py-1 rounded text-xs"
                style={{ backgroundColor: task.tag.color + '20', color: task.tag.color }}
              >
                {task.tag.name}
              </span>
            )}
          </div>
        </div>
      </li>
    </div>
  );
};
