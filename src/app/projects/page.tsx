import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import HeaderUserMenu from "@/components/HeaderUserMenu";
import ProjectsList from "@/components/UserProjects";
import { getUserProjects } from "@/lib/api/api-helpers";
import { getCurrentUser } from "@/lib/api/auth-helpers";
import { UserResponse } from "@/types/api";

async function refreshProjects() {
  "use server";
  revalidatePath("/projects");
}
/**
 * Projects listing page showing owned and member projects with creation functionality.
 * Features authentication check, server action for cache revalidation, and separate
 * sections for owned projects (with create capability) and member projects (read-only).
 */

const Page = async () => {
  // check if the user is logged in
  const user = await getCurrentUser();
  if (user === undefined) {
    redirect("/auth/login");
  }
  const { owner: ownedProjects, member: memberProjects } =
    await getUserProjects(user?._id);

  return (
    <div className="p-6">
      <Header user={user} />
      <h3 className="text-xl font-semibold mb-2">My Projects</h3>
      <ProjectsList
        projects={ownedProjects}
        ownerId={user?._id}
        refreshProjects={refreshProjects}
      />
      <h3 className="text-xl font-semibold mb-2 mt-6">Projects I Belong To</h3>
      <ProjectsList projects={memberProjects} />
    </div>
  );
};

export default Page;

interface HeaderProps {
  user: UserResponse;
}
const Header = ({ user }: HeaderProps) => {
  return (
    <header className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 mb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Projects</h1>
        <HeaderUserMenu user={user} />
      </div>
    </header>
  );
};
