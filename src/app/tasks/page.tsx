import TaskCard from "@/components/TaskCard";
import { mockTasks } from "@/data/mock-tasks";

export default function TasksPage() {
	return (
		<div className="p-6 min-h-screen">
			<h1 className="text-2xl font-bold mb-6">Mock Tasks</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{mockTasks.map((task) => (
					<TaskCard key={task.id} task={task} />
				))}
			</div>
		</div>
	);
}
