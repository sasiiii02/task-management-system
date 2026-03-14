import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import TaskCard from '@/components/TaskCard';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/axios';

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter + pagination state
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page,
        size: 10,
        sortBy: 'dueDate',
        sortDir: 'asc',
      });
      if (status) params.append('status', status);
      if (priority) params.append('priority', priority);

      const res = await api.get(`/api/tasks?${params}`);
      setTasks(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, [page, status, priority]);

  const handleDelete = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));
  const handleComplete = (updated) =>
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));

  const selectClass =
    'border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white';

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">My Tasks</h1>
          <button
            onClick={() => router.push('/tasks/new')}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            + New Task
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(0); }}
            className={selectClass}
          >
            <option value="">All statuses</option>
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
          <select
            value={priority}
            onChange={(e) => { setPriority(e.target.value); setPage(0); }}
            className={selectClass}
          >
            <option value="">All priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          {(status || priority) && (
            <button
              onClick={() => { setStatus(''); setPriority(''); setPage(0); }}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Task list */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading tasks...</div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">{error}</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            No tasks found.{' '}
            <button
              onClick={() => router.push('/tasks/new')}
              className="text-blue-600 hover:underline"
            >
              Create one
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={handleDelete}
                onComplete={handleComplete}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </Layout>
    </ProtectedRoute>
  );
}