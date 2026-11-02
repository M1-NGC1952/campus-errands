'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TaskCategory, CATEGORY_MAP } from '@/lib/types';
import { createTask } from '@/lib/store';
import { useAuth } from '@/components/auth-provider';
import { Send, MapPin, Clock, Coins, FileText, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function PublishPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('express');
  const [reward, setReward] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <AlertCircle className="mb-3 h-10 w-10 text-slate-300" />
        <p className="mb-2 text-sm text-slate-500">请先登录后再发布任务</p>
        <Link href="/login" className="text-sm font-medium text-emerald-500 hover:underline">
          去登录
        </Link>
      </div>
    );
  }

  function handleSubmit() {
    if (!user) return;
    setError('');

    if (!title.trim()) { setError('请输入任务标题'); return; }
    if (!description.trim()) { setError('请输入任务描述'); return; }
    if (!reward || Number(reward) <= 0) { setError('请输入有效赏金'); return; }
    if (!pickupLocation.trim()) { setError('请输入取件地点'); return; }
    if (!deliveryLocation.trim()) { setError('请输入送达地点'); return; }
    if (!deadline) { setError('请选择截止时间'); return; }

    const deadlineDate = new Date(deadline);
    if (deadlineDate.getTime() < Date.now()) {
      setError('截止时间不能早于当前时间');
      return;
    }

    createTask({
      title: title.trim(),
      description: description.trim(),
      category,
      reward: Number(reward),
      pickupLocation: pickupLocation.trim(),
      deliveryLocation: deliveryLocation.trim(),
      deadline: deadlineDate.toISOString(),
      publisherId: user.id,
      publisherName: user.username,
    });

    router.push('/');
  }

  return (
    <div className="px-4 pt-4">
      <h1 className="mb-1 text-xl font-bold text-slate-800">发布任务</h1>
      <p className="mb-4 text-xs text-slate-400">填写任务信息，等待同学接单</p>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <FileText className="h-3.5 w-3.5 text-emerald-500" />
            任务标题
          </label>
          <input
            type="text"
            placeholder="如：帮忙取菜鸟驿站快递"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={30}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-300 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-1.5 text-sm font-medium text-slate-700">任务类别</label>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(CATEGORY_MAP) as [TaskCategory, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-medium transition',
                  category === key
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1 text-sm font-medium text-slate-700">任务描述</label>
          <textarea
            placeholder="描述任务详情，如取件码、物品信息等..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={200}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-300 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Reward */}
        <div>
          <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <Coins className="h-3.5 w-3.5 text-amber-500" />
            赏金（元）
          </label>
          <input
            type="number"
            placeholder="输入赏金金额"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            min="1"
            max="100"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-300 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Locations */}
        <div>
          <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <MapPin className="h-3.5 w-3.5 text-emerald-500" />
            取件/出发地点
          </label>
          <input
            type="text"
            placeholder="如：菜鸟驿站（南门）"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-300 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <MapPin className="h-3.5 w-3.5 text-sky-500" />
            送达地点
          </label>
          <input
            type="text"
            placeholder="如：6号宿舍楼 305"
            value={deliveryLocation}
            onChange={(e) => setDeliveryLocation(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-300 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Deadline */}
        <div>
          <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <Clock className="h-3.5 w-3.5 text-amber-500" />
            截止时间
          </label>
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
          />
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
          <Send className="h-4 w-4" />
          发布任务
        </button>
      </div>
    </div>
  );
}
