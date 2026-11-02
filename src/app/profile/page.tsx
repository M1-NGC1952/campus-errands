'use client';

import { useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth-provider';
import { AlertCircle, LogOut, Shield, Star, Trophy, Award } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ProfileSkeleton } from '@/components/skeleton';

export default function ProfilePage() {
  const { user, setUser, loading } = useAuth();
  const router = useRouter();

  const refreshUser = useCallback(() => {
    const event = new Event('user-updated');
    window.dispatchEvent(event);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return null;
  }

  function handleLogout() {
    setUser(null);
    router.push('/');
  }

  const creditLevel = user.creditScore >= 120 ? '优秀' : user.creditScore >= 80 ? '良好' : user.creditScore >= 50 ? '一般' : '较差';
  const creditColor = user.creditScore >= 120 ? 'text-emerald-500' : user.creditScore >= 80 ? 'text-sky-500' : user.creditScore >= 50 ? 'text-amber-500' : 'text-red-500';
  const creditBg = user.creditScore >= 120 ? 'bg-emerald-50' : user.creditScore >= 80 ? 'bg-sky-50' : user.creditScore >= 50 ? 'bg-amber-50' : 'bg-red-50';

  return (
    <div className="px-4 pt-4">
      {/* Profile Card */}
      <div className="mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-5 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-2xl font-bold backdrop-blur-sm">
            {user.avatar}
          </div>
          <div>
            <h1 className="text-lg font-bold">{user.username}</h1>
            <p className="text-xs text-emerald-100">校园跑腿达人</p>
          </div>
        </div>
      </div>

      {/* Credit Score */}
      <div className={cn('mb-4 rounded-xl p-4', creditBg)}>
        <div className="mb-2 flex items-center gap-2">
          <Shield className={cn('h-4 w-4', creditColor)} />
          <span className="text-sm font-medium text-slate-700">信用分</span>
        </div>
        <div className="flex items-end gap-3">
          <span className={cn('text-3xl font-bold', creditColor)}>{user.creditScore}</span>
          <span className={cn('mb-1 rounded-full px-2 py-0.5 text-xs font-medium', creditColor, 'bg-white/60')}>
            {creditLevel}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 text-amber-400" />
            完成任务 +5分
          </span>
          <span className="flex items-center gap-1">
            <Award className="h-3 w-3 text-red-400" />
            违约/取消 -10分
          </span>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mb-4 space-y-2">
        <Link
          href="/my-tasks"
          className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-500">
            <Trophy className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">我的任务</p>
            <p className="text-xs text-slate-400">查看发布和接到的任务</p>
          </div>
        </Link>
      </div>

      {/* Rules */}
      <div className="mb-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
        <h3 className="mb-2 text-sm font-semibold text-slate-700">信用分规则</h3>
        <ul className="space-y-1.5 text-xs text-slate-500">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
            初始信用分为 100 分
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
            成功完成任务，接单者 +5 分，发布者 +2 分
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
            任务被取消，接单者 -10 分
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
            信用分范围 0-200，分数越高越受信赖
          </li>
        </ul>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-500 hover:border-red-200 active:scale-[0.98]"
      >
        <LogOut className="h-4 w-4" />
        退出登录
      </button>
    </div>
  );
}
