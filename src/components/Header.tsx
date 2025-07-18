"use client";

import { useProject } from "@/contexts/ProjectContext";
import type { UserResponse } from "@/types/api";
import HeaderUserMenu from "./HeaderUserMenu";
import { useRouter } from "next/navigation";

interface HeaderProps {
	user: UserResponse;
}

const Header = ({ user }: HeaderProps) => {
	const { project, isOwner } = useProject();
	const router = useRouter();

	const navigateToProjectSettings = () => {
		router.push(`/project/${project?.slug}/settings`);
	}

	const navigateToProjectSummary = () => {
		router.push(`/project/${project?.slug}/summary`);
	}

	return (
		<header
			className="border-b border-gray-800 px-6 py-4"
			style={{ backgroundColor: "var(--background)" }}
		>
			<div className="flex items-center justify-between">
				{/* Left section - Project title and filter */}
				<div className="flex items-center gap-4">
					<h1
						className="text-xl font-semibold"
						style={{ color: "var(--foreground)" }}
					>
						{project?.name || "Unknown Project"}
					</h1>
				</div>

				{/* Center section - Navigation */}
				<nav className="flex items-center bg-gray-800/50 rounded-lg p-1">
					<button
						type="button"
						onClick={navigateToProjectSummary}
						className="px-4 py-2 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200 rounded-md transition-all"
					>
						Project Summary
					</button>
					{isOwner && (
						<button
							type="button"
							onClick={navigateToProjectSettings}
							className="px-4 py-2 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200 rounded-md transition-all"
						>
							Project Settings
						</button>
					)}
					<button
						type="button"
						className="px-4 py-2 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200 rounded-md transition-all"
					>
						Team
					</button>
				</nav>

				{/* Right section - User avatar */}
				<div className="flex items-center">
					<HeaderUserMenu user={user} />
				</div>
			</div>
		</header>
	);
};

export default Header;
