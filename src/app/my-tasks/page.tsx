'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task } from '@/lib/types';
import { getTasks } from '@/lib/store';
import { useAuth } from '@/components/auth-provider';
import { TaskCard } from '@/components/task-card';
import { TaskListSkeleton } from '@/components/skeleton';
import { AlertCircle, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type Tab = 'published' | 'accepted';

export default function MyTasksPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('published');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTasks = useCallback(() => {
    setTasks(getTasks());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadTasks();
    const handleUpdate = () => loadTasks();
    window.addEventListener('tasks-updated', handleUpdate);
    return () => window.removeEventListener('tasks-updated', handleUpdate);
  }, [loadTasks]);

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <AlertCircle className="mb-3 h-10 w-10 text-slate-300" />
        <p className="mb-2 text-sm text-slate-500">请先登录查看我的任务</p>
        <Link href="/login" className="text-sm font-medium text-emerald-500 hover:underline">
          去登录
        </Link>
      </div>
    );
  }

  const published = tasks.filter((t) => t.publisherId === user.id);
  const accepted = tasks.filter((t) => t.acceptorId === user.id);
  const currentList = tab === 'published' ? published : accepted;

  return (
    <div className="px-4 pt-4">
      <h1 className="mb-4 text-xl font-bold text-slate-800">我的任务</h1>

      {/* Tabs */}
      <div className="mb-4 flex rounded-xl bg-slate-100 p-1">
        <button
          onClick={() => setTab('published')}
          className={cn(
            'flex-1 rounded-lg py-2 text-sm font-medium transition',
            tab === 'published' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'
          )}
        >
          我发布的 ({published.length})
        </button>
        <button
          onClick={() => setTab('accepted')}
          className={cn(
            'flex-1 rounded-lg py-2 text-sm font-medium transition',
            tab === 'accepted' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'
          )}
        >
          我接的 ({accepted.length})
        </button>
      </div>

      {/* List */}
      <div className="animate-fade-in space-y-3">
        {isLoading ? (
          <TaskListSkeleton count={3} />
        ) : currentList.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <ClipboardList className="h-6 w-6 text-slate-300" />
            </div>
            <p className="text-sm text-slate-400">
              {tab === 'published' ? '还没有发布过任务' : '还没有接过任务'}
            </p>
            {tab === 'published' && (
              <Link href="/publish" className="mt-2 text-sm font-medium text-emerald-500 hover:underline">
                去发布任务
              </Link>
            )}
          </div>
        ) : (
          currentList.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}
