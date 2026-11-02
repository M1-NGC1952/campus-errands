export interface User {
  id: string;
  username: string;
  password: string;
  creditScore: number;
  avatar: string;
  createdAt: number;
}

export type TaskCategory = 'express' | 'buy' | 'seat' | 'deliver' | 'other';
export type TaskStatus = 'open' | 'accepted' | 'completed' | 'cancelled';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  reward: number;
  pickupLocation: string;
  deliveryLocation: string;
  deadline: string;
  status: TaskStatus;
  publisherId: string;
  publisherName: string;
  acceptorId: string | null;
  acceptorName: string | null;
  createdAt: number;
  updatedAt: number;
}

export const CATEGORY_MAP: Record<TaskCategory, string> = {
  express: '代取快递',
  buy: '代买物品',
  seat: '代占座位',
  deliver: '代送资料',
  other: '其他任务',
};

export const CATEGORY_ICON: Record<TaskCategory, string> = {
  express: 'Package',
  buy: 'ShoppingBag',
  seat: 'Armchair',
  deliver: 'FileText',
  other: 'MoreHorizontal',
};

export const STATUS_MAP: Record<TaskStatus, string> = {
  open: '待接单',
  accepted: '进行中',
  completed: '已完成',
  cancelled: '已取消',
};

export const STATUS_COLOR: Record<TaskStatus, string> = {
  open: 'bg-sky-100 text-sky-700',
  accepted: 'bg-amber-100 text-amber-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-slate-100 text-slate-500',
};
