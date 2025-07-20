import Link from "next/link";
import { getProjectBySlug } from "@/lib/api/api-helpers";

const Page = async ({ params }: { params: Promise<{ projectSlug: string }> }) => {
    const { projectSlug } = await params;

    const project = await getProjectBySlug(projectSlug);

    const allTasks = project.columns.flatMap(column => column.tasks);
    const totalTasks = allTasks.length;
    const tasksByColumn = project.columns.map(column => ({
        name: column.name,
        count: column.tasks.length
    }));


    const totalMembers = project.members.length
    const adminCount = project.members.filter(member => member.role === 'admin').length
    const memberCount = project.members.filter(member => member.role === 'member').length;

    const tasksByTags = project.tags.map(tag => ({
        name: tag.name,
        color: tag.color,
        count: allTasks.filter(task => task.tag?._id === tag._id).length
    }));

    return (
        <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="mb-6">
                <Link
                    href={`/project/${projectSlug}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                    ← Back to Project
                </Link>
            </div>

            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                Project Summary
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                        Project Overview
                    </h2>
                    <div className="space-y-3">
                        <div>
                            <span className="inline-block bg-gray-100 dark:bg-gray-500 text-gray-700 dark:text-white text-xs font-semibold px-2 py-1 rounded-md mb-2">
                                Name
                            </span>
                            <p className="text-gray-900 dark:text-white text-sm">{project.name}</p>
                        </div>
                        <div>
                            <span className="inline-block bg-gray-100 dark:bg-gray-500 text-gray-700 dark:text-white text-xs font-semibold px-2 py-1 rounded-md mb-2">Description</span>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {project.description || "No description available"}
                            </p>
                        </div>
                        <div>
                            <span className="inline-block bg-gray-100 dark:bg-gray-500 text-gray-700 dark:text-white text-xs font-semibold px-2 py-1 rounded-md mb-2">Owner</span>
                            <p className="text-gray-900 dark:text-white text-sm">{project.owner.name}</p>
                        </div>
                        <div>
                            <span className="inline-block bg-gray-100 dark:bg-gray-500 text-gray-700 dark:text-white text-xs font-semibold px-2 py-1 rounded-md mb-2">Created</span>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {new Date(project.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <span className="inline-block bg-gray-100 dark:bg-gray-500 text-gray-700 dark:text-white text-xs font-semibold px-2 py-1 rounded-md mb-2">Tags</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {project.tags.map(tag => (
                                    <span
                                        key={tag._id}
                                        className="px-3 py-1 rounded-full text-xs"
                                        style={{ backgroundColor: tag.color, color: "#fff" }}
                                    >
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                        Task Overview
                    </h2>
                    <div className="space-y-4">
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                {totalTasks}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Total Tasks
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="inline-block bg-gray-100 dark:bg-gray-500 text-gray-700 dark:text-white text-xs font-semibold px-2 py-1 rounded-md mb-2">
                                Tasks by Status
                            </h3>
                            {tasksByColumn.map(column => (
                                <div key={column.name} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {column.name}:
                                    </span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {column.count}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <h3 className="inline-block bg-gray-100 dark:bg-gray-500 text-gray-700 dark:text-white text-xs font-semibold px-2 py-1 rounded-md mb-2">
                                Tasks by Tag
                            </h3>
                            {tasksByTags.map(tag => (
                                <div key={tag.name} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {tag.name}:
                                    </span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {tag.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                        Team Overview
                    </h2>
                    <div className="space-y-4">
                        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                                {totalMembers}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Total Members
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                                    {adminCount}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                    Admins
                                </div>
                            </div>
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                                    {memberCount}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                    Members
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="inline-block bg-gray-100 dark:bg-gray-500 text-gray-700 dark:text-white text-xs font-semibold px-2 py-1 rounded-md mb-2">
                                Project Owner
                            </h3>
                            <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                <div className="font-medium text-gray-900 dark:text-white">
                                    {project.owner.name}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {project.owner.email}
                                </div>
                            </div>
                        </div>

                        {project.members.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="inline-block bg-gray-100 dark:bg-gray-500 text-gray-700 dark:text-white text-xs font-semibold px-2 py-1 rounded-md mb-2">
                                    Team Members
                                </h3>
                                <div className="space-y-1 max-h-32 overflow-y-auto">
                                    {project.members.map(member => (
                                        <div key={member.user._id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                                            <span className="text-gray-900 dark:text-white">
                                                {member.user.name}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs ${member.role === 'admin'
                                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200'
                                                : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
                                                }`}>
                                                {member.role}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;