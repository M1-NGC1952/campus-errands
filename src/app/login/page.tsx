'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register, login } from '@/lib/store';
import { useAuth } from '@/components/auth-provider';
import { LogIn, UserPlus, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit() {
    setError('');

    if (!username.trim()) {
      setError('请输入用户名');
      return;
    }
    if (username.trim().length < 2) {
      setError('用户名至少2个字符');
      return;
    }
    if (!password) {
      setError('请输入密码');
      return;
    }
    if (password.length < 4) {
      setError('密码至少4个字符');
      return;
    }

    if (isRegister) {
      const result = register(username.trim(), password);
      if (result.success && result.user) {
        setUser(result.user);
        router.push('/');
      } else {
        setError(result.message);
      }
    } else {
      const result = login(username.trim(), password);
      if (result.success && result.user) {
        setUser(result.user);
        router.push('/');
      } else {
        setError(result.message);
      }
    }
  }

  return (
    <div className="flex min-h-[80vh] flex-col justify-center px-6">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-200">
          <span className="text-2xl font-bold text-white">跑</span>
        </div>
        <h1 className="text-xl font-bold text-slate-800">校园跑腿</h1>
        <p className="mt-1 text-xs text-slate-400">让校园生活更便利</p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div>
          <label className="mb-1 text-sm font-medium text-slate-700">用户名</label>
          <input
            type="text"
            placeholder="输入你的学号或昵称"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-300 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label className="mb-1 text-sm font-medium text-slate-700">密码</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-10 text-sm text-slate-700 placeholder:text-slate-300 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 active:scale-[0.98]"
        >
          {isRegister ? (
            <>
              <UserPlus className="h-4 w-4" />
              注册
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              登录
            </>
          )}
        </button>

        {/* Toggle */}
        <p className="text-center text-sm text-slate-400">
          {isRegister ? '已有账号？' : '没有账号？'}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="ml-1 font-medium text-emerald-500 hover:underline"
          >
            {isRegister ? '去登录' : '去注册'}
          </button>
        </p>
      </div>

      {/* Back */}
      <div className="mt-6 text-center">
        <Link href="/" className="text-xs text-slate-400 hover:text-slate-600">
          返回首页
        </Link>
      </div>
    </div>
  );
}
