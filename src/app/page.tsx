'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Task, TaskCategory, TaskStatus, CATEGORY_MAP, STATUS_MAP } from '@/lib/types';
import { getTasks } from '@/lib/store';
import { TaskCard } from '@/components/task-card';
import { TaskListSkeleton } from '@/components/skeleton';
import { useAuth } from '@/components/auth-provider';
import { Search, Filter, LogIn } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const ALL = 'all' as const;

export default function HomePage() {
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState<TaskCategory | typeof ALL>(ALL);
  const [status, setStatus] = useState<TaskStatus | typeof ALL>(ALL);
  const [search, setSearch] = useState('');

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

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (category !== ALL && t.category !== category) return false;
      if (status !== ALL && t.status !== status) return false;
      if (search && !t.title.includes(search) && !t.description.includes(search)) return false;
      return true;
    });
  }, [tasks, category, status, search]);

  const categories = [
    { value: ALL, label: '全部' },
    ...Object.entries(CATEGORY_MAP).map(([k, v]) => ({ value: k as TaskCategory, label: v })),
  ];

  const statuses = [
    { value: ALL, label: '全部状态' },
    ...Object.entries(STATUS_MAP).map(([k, v]) => ({ value: k as TaskStatus, label: v })),
  ];

  return (
    <div className="px-4 pt-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">任务广场</h1>
          <p className="text-xs text-slate-400">发现身边的跑腿机会</p>
        </div>
        {!user && (
          <Link
            href="/login"
            className="flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-emerald-600 active:scale-95"
          >
            <LogIn className="h-3.5 w-3.5" />
            登录
          </Link>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
        <input
          type="text"
          placeholder="搜索任务..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-300 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {/* Category Filter */}
      <div className="mb-2 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <Filter className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        {categories.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={cn(
              'shrink-0 rounded-full px-3 py-1 text-xs font-medium transition',
              category === c.value
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'bg-white text-slate-500 hover:bg-slate-100'
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Status Filter */}
      <div className="mb-4 flex items-center gap-1.5">
        {statuses.map((s) => (
          <button
            key={s.value}
            onClick={() => setStatus(s.value)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition',
              status === s.value
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-white text-slate-500 hover:bg-slate-100'
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="animate-fade-in space-y-3">
        {isLoading ? (
          <TaskListSkeleton count={4} />
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <Search className="h-6 w-6 text-slate-300" />
            </div>
            <p className="text-sm text-slate-400">暂无匹配的任务</p>
            <Link href="/publish" className="mt-2 text-sm font-medium text-emerald-500 hover:underline">
              去发布一个任务
            </Link>
          </div>
        ) : (
          filtered.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>

      {/* Stats */}
      <div className="mt-6 mb-4 text-center text-xs text-slate-300">
        共 {filtered.length} 个任务
      </div>
    </div>
  );
}
