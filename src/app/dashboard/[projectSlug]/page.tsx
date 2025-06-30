import { use } from "react";
import Header from "@/components/Header";
import KanbanBoard from "@/components/KanbanBoard";

const MOCK_PROJECT_SLUG = "test-project-1";

export default function Dashboard({
	params,
}: {
	params: Promise<{ projectSlug: string }>;
}) {
	const { projectSlug } = use(params);

	return (
		<div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900">
			<Header />
			<KanbanBoard />
		</div>
	);
}
