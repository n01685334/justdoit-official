import DeleteProjectModal from "@/components/DeleteProjectModal";

const Page = async ({ params }: { params: Promise<{ projectSlug: string }> }) => {
    const { projectSlug } = await params;

    return (
        <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900">
            <h1 className="text-2xl font-bold mb-4">Project Settings</h1>
            <p className="text-gray-700 dark:text-gray-300">
                This is the settings page for your project. Here you can manage project details, members, and more.
            </p>

            <div className="mt-6 flex items-center space-x-4">
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">Edit Project</button>
                <DeleteProjectModal projectSlug={projectSlug} />
            </div>
        </div>
    )
}

export default Page;

//TODO: add common layout for the project/slug pages

