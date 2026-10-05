export type TaskStatus = 'queued' | 'processing' | 'done';

export type Task = {
  id: string;
  status: TaskStatus;
};

// имитация бэкенда: статус зависит от времени с момента создания задачи
const createdAt = new Map<string, number>();

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const statusFor = (elapsed: number): TaskStatus => {
  if (elapsed < 3_000) return 'queued';
  if (elapsed < 6_000) return 'processing';
  return 'done';
};

export const taskService = {
  async startTask(): Promise<Task> {
    await delay(300);
    const id = String(createdAt.size + 1);
    createdAt.set(id, Date.now());
    return { id, status: 'queued' };
  },

  async getTask(id: string): Promise<Task> {
    await delay(300);
    const start = createdAt.get(id);
    if (start === undefined) throw new Error(`Task ${id} not found`);
    return { id, status: statusFor(Date.now() - start) };
  },
};
