import Layout from '@/components/Layout';
import TaskForm from '@/components/TaskForm';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function NewTask() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-xl">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create Task</h1>
          <TaskForm />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}