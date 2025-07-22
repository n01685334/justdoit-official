"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createProject } from "@/lib/api/api-helpers";

/**
 * Modal component for creating new projects with form validation and error handling.
 * Handles project creation, navigation to new project, and parent component refresh.
 */
interface CreateProjectModalProps {
  onClose: () => void;
  ownerId: string;
  refreshProjects: () => void;
}
const CreateProjectModal = ({ onClose, ownerId, refreshProjects }: CreateProjectModalProps) => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {

      const formData = new FormData(event.currentTarget)
      const name = formData.get("name") as string
      const description = formData.get("description") as string;
      const project = await createProject({ name, description, owner_id: ownerId });

      if (project.error) {
        setError(project.error);
        return;
      }
      if (project.project_slug) {
        refreshProjects();
        // onClose();
        router.push(`/project/${project.project_slug}`);
      }
    } catch (error) {
      console.error("Error creating project:", error);
      return;
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
        {/* Header */}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create New Project
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl"
          >
            ✕
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Please fill in the details below to create a new project.
        </p>
        {/* error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                {error}
              </p>
            </div>
          </div>
        )}
        {/* Form */}
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Project Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder="Enter project name"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder="Enter project description"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
          >
            Create Project
          </button>
        </form>
      </div>
    </div>
  )
}
export default CreateProjectModal;