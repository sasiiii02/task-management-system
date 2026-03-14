import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import TaskForm from '@/components/TaskForm';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/axios';

export default function EditTask() {
  const router = useRouter();
  const { id } = router.query;
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api.get(`/api/tasks/${id}`)
      .then((res) => setTask(res.data))
      .catch(() => setError('Task not found'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-xl">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Task</h1>
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <TaskForm initialData={task} />
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}