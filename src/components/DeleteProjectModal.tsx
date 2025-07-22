"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteProjectAction } from "@/app/actions/projects";

interface DeleteProjectModalProps {
  projectSlug: string;
}

/**
 * Modal component for confirming project deletion with error handling.
 * Triggers server action for project deletion and redirects on success.
 * Includes confirmation dialog to prevent accidental deletions.
 */

export default function DeleteProjectModal({ projectSlug }: DeleteProjectModalProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const onClose = () => {
    setOpenModal(false);
    setError(null);
  }
  const handleDelete = async () => {
    const result = await deleteProjectAction(projectSlug);
    if (result?.error) {
      setError(result?.error || "Failed to delete project");
    } else {
      router.push("/projects");
    }
  }

  return (
    <>
      <button className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800" onClick={() => setOpenModal(true)}>Delete Project</button>
      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Delete Project
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl"
              >
                ✕
              </button>
            </div>                <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete this project? This action cannot be undone.
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
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>

  )
}