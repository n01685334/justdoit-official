import { redirect } from "next/navigation";
import Header from "@/components/Header";
import KanbanBoard from "@/components/KanbanBoard";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { getProjectBySlug } from "@/lib/api/api-helpers";
import { getCurrentUser } from "@/lib/api/auth-helpers";

const Page = async ({
  params,
}: {
  params: Promise<{ projectSlug: string }>;
}) => {
  const { projectSlug } = await params;

  const user = await getCurrentUser();
  if (user === undefined) {
    redirect("/auth/login");
  }

  const project = await getProjectBySlug(projectSlug);
  if (
    user._id !== project.owner._id ||
    !project.members.find((member) => user._id === member.user._id)
  ) {
    console.log("Unauthorized! Redirecting...");
    redirect("/projects");
  }

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
