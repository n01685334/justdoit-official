import Link from "next/link";
import { getUserById, getUserProjects } from "@/lib/api/api-helpers";
import { TEMP_DEFAULT_USER_ID } from "@/lib/vars/constants";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api/auth-helpers";

const Page = async () => {
	// check if the user is logged in
	const user = await getCurrentUser()
	if(user == null){
		redirect("/auth/login")
	}
	const { owner: ownedProjects, member: memberProjects } =
		await getUserProjects(user?._id);

	return (
		<div>
			<h2>My Projects</h2>
			<ul>
				{ownedProjects?.map((p) => (
					<li key={p._id}>
						<Link href={`/project/${p.slug}`}>{p.name}</Link>
					</li>
				))}
			</ul>
			<h2>Projects I Belong To</h2>
			<ul>
				{memberProjects?.map((p) => (
					<li key={p._id}>
						<Link href={`/project/${p.slug}`}>{p.name}</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Page;
