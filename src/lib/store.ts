import { User, Task } from './types';

const USERS_KEY = 'campus_run_users';
const TASKS_KEY = 'campus_run_tasks';
const CURRENT_USER_KEY = 'campus_run_current_user';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ---- Users ----
export function getUsers(): User[] {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser(): User | null {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export function register(username: string, password: string): { success: boolean; message: string; user?: User } {
  const users = getUsers();
  if (users.find((u) => u.username === username)) {
    return { success: false, message: '用户名已存在' };
  }
  const newUser: User = {
    id: generateId(),
    username,
    password,
    creditScore: 100,
    avatar: username.charAt(0).toUpperCase(),
    createdAt: Date.now(),
  };
  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser);
  return { success: true, message: '注册成功', user: newUser };
}

export function login(username: string, password: string): { success: boolean; message: string; user?: User } {
  const users = getUsers();
  const user = users.find((u) => u.username === username);
  if (!user) {
    return { success: false, message: '用户不存在' };
  }
  if (user.password !== password) {
    return { success: false, message: '密码错误' };
  }
  setCurrentUser(user);
  return { success: true, message: '登录成功', user };
}

export function logout(): void {
  setCurrentUser(null);
}

export function updateCreditScore(userId: string, delta: number): void {
  const users = getUsers();
  const user = users.find((u) => u.id === userId);
  if (user) {
    user.creditScore = Math.max(0, Math.min(200, user.creditScore + delta));
    saveUsers(users);
    const current = getCurrentUser();
    if (current && current.id === userId) {
      setCurrentUser(user);
      window.dispatchEvent(new Event('user-updated'));
    }
  }
}

export function refreshCurrentUser(): User | null {
  const current = getCurrentUser();
  if (!current) return null;
  const users = getUsers();
  const fresh = users.find((u) => u.id === current.id);
  if (fresh) {
    setCurrentUser(fresh);
    return fresh;
  }
  return null;
}

// ---- Tasks ----
export function getTasks(): Task[] {
  const data = localStorage.getItem(TASKS_KEY);
  if (!data) {
    return getDefaultTasks();
  }
  return JSON.parse(data);
}

function saveTasks(tasks: Task[]): void {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  window.dispatchEvent(new Event('tasks-updated'));
}

export function getTaskById(id: string): Task | undefined {
  return getTasks().find((t) => t.id === id);
}

export function createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'acceptorId' | 'acceptorName'>): Task {
  const tasks = getTasks();
  const newTask: Task = {
    ...task,
    id: generateId(),
    status: 'open',
    acceptorId: null,
    acceptorName: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  tasks.unshift(newTask);
  saveTasks(tasks);
  return newTask;
}

export function acceptTask(taskId: string, acceptorId: string, acceptorName: string): boolean {
  const tasks = getTasks();
  const task = tasks.find((t) => t.id === taskId);
  if (!task || task.status !== 'open') return false;
  task.status = 'accepted';
  task.acceptorId = acceptorId;
  task.acceptorName = acceptorName;
  task.updatedAt = Date.now();
  saveTasks(tasks);
  return true;
}

export function completeTask(taskId: string): boolean {
  const tasks = getTasks();
  const task = tasks.find((t) => t.id === taskId);
  if (!task || task.status !== 'accepted') return false;
  task.status = 'completed';
  task.updatedAt = Date.now();
  saveTasks(tasks);

  // Credit score changes
  if (task.acceptorId) {
    updateCreditScore(task.acceptorId, 5); // +5 for completing
  }
  if (task.publisherId) {
    updateCreditScore(task.publisherId, 2); // +2 for publishing completed task
  }
  return true;
}

export function cancelTask(taskId: string, userId: string): boolean {
  const tasks = getTasks();
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return false;
  if (task.status === 'completed') return false;
  // If task was accepted, penalize the acceptor
  if (task.status === 'accepted' && task.acceptorId) {
    updateCreditScore(task.acceptorId, -10); // -10 for cancellation
  }
  task.status = 'cancelled';
  task.updatedAt = Date.now();
  saveTasks(tasks);
  return true;
}

function getDefaultTasks(): Task[] {
  const now = Date.now();
  const defaults: Task[] = [
    {
      id: 'demo1',
      title: '帮忙取菜鸟驿站快递',
      description: '有3个包裹，取件码稍后发你，谢谢！',
      category: 'express',
      reward: 5,
      pickupLocation: '菜鸟驿站（南门）',
      deliveryLocation: '6号宿舍楼 305',
      deadline: new Date(now + 3 * 3600000).toISOString(),
      status: 'open',
      publisherId: 'demo_pub',
      publisherName: '小明',
      acceptorId: null,
      acceptorName: null,
      createdAt: now - 600000,
      updatedAt: now - 600000,
    },
    {
      id: 'demo2',
      title: '帮买一杯瑞幸咖啡',
      description: '要生椰拿铁，冰的，少糖。校园店下单即可。',
      category: 'buy',
      reward: 3,
      pickupLocation: '瑞幸咖啡（教学楼店）',
      deliveryLocation: '图书馆 3楼自习室',
      deadline: new Date(now + 2 * 3600000).toISOString(),
      status: 'open',
      publisherId: 'demo_pub2',
      publisherName: '小红',
      acceptorId: null,
      acceptorName: null,
      createdAt: now - 1200000,
      updatedAt: now - 1200000,
    },
    {
      id: 'demo3',
      title: '帮忙占明天高数课座位',
      description: '明天上午第1-2节高等数学，希望坐前排中间位置。',
      category: 'seat',
      reward: 8,
      pickupLocation: '教学楼A-201',
      deliveryLocation: '教学楼A-201',
      deadline: new Date(now + 12 * 3600000).toISOString(),
      status: 'open',
      publisherId: 'demo_pub3',
      publisherName: '小华',
      acceptorId: null,
      acceptorName: null,
      createdAt: now - 1800000,
      updatedAt: now - 1800000,
    },
    {
      id: 'demo4',
      title: '代送实验报告到办公室',
      description: '物理实验报告，需要送到理学院办公楼302。',
      category: 'deliver',
      reward: 4,
      pickupLocation: '6号宿舍楼 512',
      deliveryLocation: '理学院办公楼 302',
      deadline: new Date(now + 6 * 3600000).toISOString(),
      status: 'accepted',
      publisherId: 'demo_pub4',
      publisherName: '小李',
      acceptorId: 'demo_acc',
      acceptorName: '小张',
      createdAt: now - 7200000,
      updatedAt: now - 3600000,
    },
    {
      id: 'demo5',
      title: '帮取京东快递大件',
      description: '一个大箱子，可能需要推车。取件码：8-2-1234',
      category: 'express',
      reward: 10,
      pickupLocation: '京东快递柜（东门）',
      deliveryLocation: '12号宿舍楼 101',
      deadline: new Date(now + 4 * 3600000).toISOString(),
      status: 'completed',
      publisherId: 'demo_pub5',
      publisherName: '小王',
      acceptorId: 'demo_acc2',
      acceptorName: '小陈',
      createdAt: now - 86400000,
      updatedAt: now - 43200000,
    },
    {
      id: 'demo6',
      title: '帮买食堂早餐',
      description: '两个肉包子+一杯豆浆，7:30前送到。',
      category: 'buy',
      reward: 2,
      pickupLocation: '第一食堂',
      deliveryLocation: '3号宿舍楼 618',
      deadline: new Date(now + 1 * 3600000).toISOString(),
      status: 'open',
      publisherId: 'demo_pub6',
      publisherName: '小赵',
      acceptorId: null,
      acceptorName: null,
      createdAt: now - 300000,
      updatedAt: now - 300000,
    },
  ];
  saveTasks(defaults);
  return defaults;
}
