import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/axios';

export default function TaskForm({ initialData }) {
  const router = useRouter();
  const isEdit = !!initialData;

  const [form, setForm] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || 'TODO',
    priority: initialData?.priority || 'MEDIUM',
    dueDate: initialData?.dueDate
      ? new Date(initialData.dueDate).toISOString().split('T')[0]
      : '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/api/tasks/${initialData.id}`, form);
      } else {
        await api.post('/api/tasks', form);
      }
      router.push('/tasks');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div>
        <label className={labelClass}>Title *</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="Task title"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          placeholder="Optional description"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Status</label>
          <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange} className={inputClass}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Due Date</label>
        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Task' : 'Create Task'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/tasks')}
          className="px-5 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}