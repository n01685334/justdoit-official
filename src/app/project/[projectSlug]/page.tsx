import Header from "@/components/Header";
import KanbanBoard from "@/components/KanbanBoard";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { getProjectBySlug, getUserById } from "@/lib/api/api-helpers";
import { getCurrentUser } from "@/lib/api/auth-helpers";
import { TEMP_DEFAULT_USER_ID } from "@/lib/vars/constants";
import { redirect } from "next/navigation";

const Page = async ({
	params,
}: {
	params: Promise<{ projectSlug: string }>;
}) => {
	const { projectSlug } = await params;
	
	const user = await getCurrentUser()
	if(user == null){
		redirect("/auth/login")
	}

	const project = await getProjectBySlug(projectSlug);

	return (
		<div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900">
			<ProjectProvider initialProject={project} user={user}>
				<Header user={user} />
				<KanbanBoard />
			</ProjectProvider>
		</div>
	);
};

export default Page;
