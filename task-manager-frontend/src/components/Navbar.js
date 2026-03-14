import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/tasks" className="text-xl font-semibold text-gray-800">
          Task Manager
        </Link>

        <div className="flex items-center gap-4">
          {/* Show Admin Dashboard link only for admins */}
          {user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                router.pathname.startsWith('/admin')
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Admin Panel
            </Link>
          )}

          <Link
            href="/tasks"
            className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
              router.pathname.startsWith('/tasks')
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            My Tasks
          </Link>

          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            <span className="text-sm text-gray-500">{user?.username}</span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
              user?.role === 'ADMIN'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {user?.role}
            </span>
            <button
              onClick={logout}
              className="text-sm text-red-500 hover:text-red-700 font-medium ml-1"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}