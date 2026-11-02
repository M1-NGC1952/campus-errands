'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Task, CATEGORY_MAP, STATUS_MAP, STATUS_COLOR } from '@/lib/types';
import { getTaskById, acceptTask, completeTask, cancelTask } from '@/lib/store';
import { useAuth } from '@/components/auth-provider';
import { TaskCardSkeleton } from '@/components/skeleton';
import { cn } from '@/lib/utils';
import {
  ArrowLeft, MapPin, Clock, Coins, User, Package,
  ShoppingBag, Armchair, FileText, MoreHorizontal,
  CheckCircle2, XCircle, HandMetal, AlertTriangle,
} from 'lucide-react';

const ICON_MAP: Record<string, typeof Package> = {
  Package, ShoppingBag, Armchair, FileText, MoreHorizontal,
};

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionType, setActionType] = useState<'accept' | 'complete' | 'cancel'>('accept');
  const [now, setNow] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadTask = useCallback(() => {
    if (params.id) {
      const found = getTaskById(params.id as string);
      setTask(found || null);
    }
    setIsLoading(false);
  }, [params.id]);

  useEffect(() => {
    loadTask();
    setNow(Date.now());

    const handleUpdate = () => loadTask();
    window.addEventListener('tasks-updated', handleUpdate);
    return () => window.removeEventListener('tasks-updated', handleUpdate);
  }, [loadTask]);

  if (isLoading) {
    return (
      <div className="px-4 pt-4">
        <div className="mb-3 h-8 w-16 animate-pulse rounded bg-slate-200" />
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-start gap-3">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-200" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 w-full animate-pulse rounded bg-slate-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
          <AlertTriangle className="h-6 w-6 text-slate-300" />
        </div>
        <p className="text-sm text-slate-400">任务不存在</p>
      </div>
    );
  }

  const IconComponent = ICON_MAP[
    task.category === 'express' ? 'Package' :
    task.category === 'buy' ? 'ShoppingBag' :
    task.category === 'seat' ? 'Armchair' :
    task.category === 'deliver' ? 'FileText' : 'MoreHorizontal'
  ] || MoreHorizontal;

  const isPublisher = user?.id === task.publisherId;
  const isAcceptor = user?.id === task.acceptorId;
  const deadline = new Date(task.deadline);
  const isExpired = now > 0 && deadline.getTime() < now;

  function handleAction(type: 'accept' | 'complete' | 'cancel') {
    if (!user) {
      router.push('/login');
      return;
    }
    setActionType(type);
    setShowConfirm(true);
  }

  function confirmAction() {
    if (!user || !task) return;
    if (actionType === 'accept') {
      acceptTask(task.id, user.id, user.username);
    } else if (actionType === 'complete') {
      completeTask(task.id);
    } else if (actionType === 'cancel') {
      cancelTask(task.id, user.id);
    }
    setShowConfirm(false);
    // Refresh task
    const updated = getTaskById(task.id);
    setTask(updated || null);
  }

  return (
    <div className="px-4 pt-4">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="mb-3 flex items-center gap-1 text-sm text-slate-500 transition hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        返回
      </button>

      {/* Card */}
      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
        {/* Header */}
        <div className="mb-3 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <IconComponent className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-lg font-bold leading-tight text-slate-800">{task.title}</h1>
              <span className={cn('shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium', STATUS_COLOR[task.status])}>
                {STATUS_MAP[task.status]}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-400">
              {CATEGORY_MAP[task.category]} · {task.publisherName} 发布
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4 rounded-lg bg-slate-50 p-3">
          <p className="text-sm leading-relaxed text-slate-600">{task.description}</p>
        </div>

        {/* Details */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-emerald-500" />
            <span className="text-slate-500">取件地点：</span>
            <span className="font-medium text-slate-700">{task.pickupLocation}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-sky-500" />
            <span className="text-slate-500">送达地点：</span>
            <span className="font-medium text-slate-700">{task.deliveryLocation}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className={cn('h-4 w-4', isExpired ? 'text-red-400' : 'text-amber-500')} />
            <span className="text-slate-500">截止时间：</span>
            <span className={cn('font-medium', isExpired ? 'text-red-500' : 'text-slate-700')}>
              {deadline.toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              {isExpired && ' (已超时)'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Coins className="h-4 w-4 text-amber-500" />
            <span className="text-slate-500">赏金：</span>
            <span className="text-lg font-bold text-amber-500">¥{task.reward}</span>
          </div>
        </div>

        {/* Acceptor Info */}
        {task.acceptorName && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-sky-50 p-3">
            <User className="h-4 w-4 text-sky-500" />
            <span className="text-sm text-slate-500">接单者：</span>
            <span className="text-sm font-medium text-sky-700">{task.acceptorName}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 space-y-2">
        {task.status === 'open' && !isPublisher && (
          <button
            onClick={() => handleAction('accept')}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 active:scale-[0.98]"
          >
            <HandMetal className="h-4 w-4" />
            接受任务
          </button>
        )}

        {task.status === 'accepted' && isPublisher && (
          <button
            onClick={() => handleAction('complete')}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 active:scale-[0.98]"
          >
            <CheckCircle2 className="h-4 w-4" />
            确认完成
          </button>
        )}

        {task.status === 'accepted' && isAcceptor && (
          <div className="rounded-lg bg-sky-50 p-3 text-center text-sm text-sky-600">
            任务进行中，请等待发布者确认完成
          </div>
        )}

        {(task.status === 'open' || task.status === 'accepted') && (isPublisher || isAcceptor) && (
          <button
            onClick={() => handleAction('cancel')}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white py-3 text-sm font-medium text-red-500 transition hover:bg-red-50 active:scale-[0.98]"
          >
            <XCircle className="h-4 w-4" />
            取消任务
          </button>
        )}

        {task.status === 'completed' && (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 py-3 text-sm font-medium text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            任务已完成
          </div>
        )}

        {task.status === 'cancelled' && (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 py-3 text-sm font-medium text-slate-500">
            <XCircle className="h-4 w-4" />
            任务已取消
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
          <div className="w-full max-w-md rounded-t-2xl bg-white p-6 sm:rounded-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full',
                actionType === 'cancel' ? 'bg-red-100 text-red-500' : 'bg-emerald-100 text-emerald-500'
              )}>
                {actionType === 'cancel' ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">
                  {actionType === 'accept' && '确认接单'}
                  {actionType === 'complete' && '确认完成'}
                  {actionType === 'cancel' && '确认取消'}
                </h3>
                <p className="text-xs text-slate-400">
                  {actionType === 'accept' && '接单后请按时完成任务'}
                  {actionType === 'complete' && '确认任务已完成，双方信用分将更新'}
                  {actionType === 'cancel' && '取消任务可能会影响信用分'}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                再想想
              </button>
              <button
                onClick={confirmAction}
                className={cn(
                  'flex-1 rounded-xl py-2.5 text-sm font-medium text-white transition',
                  actionType === 'cancel'
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-emerald-500 hover:bg-emerald-600'
                )}
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
