import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
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

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('tasks');

  // Tasks state
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Users state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState('');

  // Redirect non-admins away
  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      router.push('/tasks');
    }
  }, [user]);

  const fetchTasks = async () => {
    setTasksLoading(true);
    setTasksError('');
    try {
      const params = new URLSearchParams({
        page,
        size: 10,
        sortBy: 'dueDate',
        sortDir: 'asc',
      });
      if (status) params.append('status', status);
      if (priority) params.append('priority', priority);

      const res = await api.get(`/api/admin/tasks?${params}`);
      setTasks(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch {
      setTasksError('Failed to load tasks');
    } finally {
      setTasksLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    setUsersError('');
    try {
      const res = await api.get('/api/admin/users');
      setUsers(res.data);
    } catch {
      setUsersError('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'tasks') fetchTasks();
  }, [activeTab, page, status, priority]);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
  }, [activeTab]);

  const handleDeleteTask = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/api/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      alert('Failed to delete task');
    }
  };

  const selectClass =
    'border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900';

  return (
    <ProtectedRoute>
      <Layout>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all users and tasks in the system</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'tasks'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            All Tasks
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            All Users
          </button>
        </div>

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div>
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-5">
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

            {/* Task table */}
            {tasksLoading ? (
              <div className="text-center py-16 text-gray-400">Loading tasks...</div>
            ) : tasksError ? (
              <div className="text-center py-16 text-red-500">{tasksError}</div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-16 text-gray-400">No tasks found</div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">User</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Priority</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Due Date</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{task.title}</div>
                          {task.description && (
                            <div className="text-xs text-gray-400 truncate max-w-xs">
                              {task.description}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{task.username}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[task.status]}`}>
                            {task.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[task.priority]}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-xs px-3 py-1 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
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
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            {usersLoading ? (
              <div className="text-center py-16 text-gray-400">Loading users...</div>
            ) : usersError ? (
              <div className="text-center py-16 text-red-500">{usersError}</div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left px-4 py-3 font-medium text-gray-600">ID</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Username</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-400">{u.id}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{u.username}</td>
                        <td className="px-4 py-3 text-gray-600">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            u.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Layout>
    </ProtectedRoute>
  );
}