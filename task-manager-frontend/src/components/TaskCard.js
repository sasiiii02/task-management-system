import { useRouter } from 'next/router';
import api from '@/lib/axios';

const statusColors = {
  TODO: 'bg-gray-100 text-gray-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  DONE: 'bg-green-100 text-green-700',
};

const priorityColors = {
  LOW: 'bg-green-50 text-green-700',
  MEDIUM: 'bg-yellow-50 text-yellow-700',
  HIGH: 'bg-red-50 text-red-700',
};

export default function TaskCard({ task, onDelete, onComplete }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/api/tasks/${task.id}`);
      onDelete(task.id);
    } catch {
      alert('Failed to delete task');
    }
  };

  const handleComplete = async () => {
    try {
      const res = await api.patch(`/api/tasks/${task.id}/complete`);
      onComplete(res.data);
    } catch {
      alert('Failed to mark as complete');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[task.status]}`}>
              {task.status.replace('_', ' ')}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            {task.dueDate && (
              <span className="text-xs text-gray-400">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {task.status !== 'DONE' && (
            <button
              onClick={handleComplete}
              className="text-xs px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 font-medium"
            >
              Done
            </button>
          )}
          <button
            onClick={() => router.push(`/tasks/${task.id}`)}
            className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-medium"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-xs px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}