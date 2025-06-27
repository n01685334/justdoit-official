// app/ui/task/task-detail-modal.tsx
import { Task, userColors } from "./TaskCard";
import { useState } from "react";

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
}

const statusOptions = ["To Do", "In Progress", "In Review", "Done"];
const categoryOptions = [
  "Frontend",
  "Backend",
  "Design",
  "DevOps",
  "Documentation",
  "Testing",
  "Research",
  "Bug Fix",
  "Feature",
  "Maintenance",
];

export default function TaskDetailModal({
  task,
  onClose,
}: TaskDetailModalProps) {
  const [status, setStatus] = useState(task.status);
  const [category, setCategory] = useState(categoryOptions[task.categoryId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl p-6 shadow-xl border border-gray-700">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-blue-400">{task.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-300 mb-6">{task.description}</p>

        <div className="flex justify-between mb-6">
          <button className="border border-blue-500 text-blue-400 px-4 py-2 rounded hover:bg-blue-900/30 h-9 flex items-center">
            attach file
          </button>

          <div className="space-y-2">
            <div className="h-9 flex items-center">
              <label className="text-blue-400 mr-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="bg-gray-700 border border-blue-500 text-blue-400 px-4 py-1 rounded h-9 appearance-none cursor-pointer w-36"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2360A5FA' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")",
                  backgroundPosition: "right 0.5rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "2.5rem",
                }}
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="h-9 flex items-center">
              <label className="text-blue-400 mr-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-gray-700 border border-blue-500 text-blue-400 px-4 py-1 rounded h-9 appearance-none cursor-pointer w-36"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2360A5FA' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")",
                  backgroundPosition: "right 0.5rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "2.5rem",
                }}
              >
                {categoryOptions.map((option, index) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium text-blue-400 mb-2">Comments</h3>

          {task.comments &&
            task.comments.map((comment) => (
              <div key={comment.id} className="flex items-start mb-3">
                <div
                  className={`${
                    userColors[comment.user.colorIndex]
                  } w-8 h-8 rounded-full flex items-center justify-center text-white font-medium mr-3 flex-shrink-0`}
                >
                  {comment.user.initials}
                </div>
                <div className="bg-gray-700 rounded-lg p-3 flex-grow">
                  <p className="text-gray-300">{comment.text}</p>
                </div>
              </div>
            ))}

          <div className="flex mt-4">
            <input
              type="text"
              placeholder="add comment"
              className="flex-grow bg-gray-700 border border-blue-500 rounded-lg p-3 mr-2 text-gray-300 placeholder-gray-500"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
