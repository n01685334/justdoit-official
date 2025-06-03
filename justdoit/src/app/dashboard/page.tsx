import Header from '@/components/Header';
import KanbanBoard from '@/components/KanbanBoard';

export default function Dashboard() {
  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900">
        <Header />
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Project Tasks Kanban
      </h1>
      <KanbanBoard />
    </div>
  );
}
 