import { useState } from 'react';
import { useStartTask, useTask } from '@entities/task/use-task';
import type { TaskStatus as Status } from '@entities/task/api/task-service';

const STATUS_COLORS: Record<Status, string> = {
  queued: '#8c959f',
  processing: '#9a6700',
  done: '#1a7f37',
};

export const TaskStatus = () => {
  const [taskId, setTaskId] = useState<string>();
  const startTask = useStartTask();
  const { data: task, isFetching, dataUpdatedAt } = useTask(taskId);

  const isRunning = task !== undefined && task.status !== 'done';

  return (
    <div style={{ padding: 24 }}>
      <h3 style={{ margin: '0 0 12px' }}>Пуллинг статуса задачи</h3>
      <button
        disabled={startTask.isPending || isRunning}
        onClick={() => startTask.mutate(undefined, { onSuccess: (created) => setTaskId(created.id) })}
        style={{
          padding: '6px 12px',
          border: '1px solid #1f6feb',
          borderRadius: 6,
          background: '#1f6feb',
          color: '#fff',
          font: 'inherit',
          fontSize: 14,
          cursor: 'pointer',
          opacity: startTask.isPending || isRunning ? 0.6 : 1,
        }}
      >
        Запустить задачу
      </button>

      {task && (
        <div style={{ marginTop: 12, fontSize: 14, display: 'flex', gap: 8, alignItems: 'center' }}>
          <span>Задача #{task.id}:</span>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 999,
              color: '#fff',
              fontWeight: 600,
              fontSize: 12,
              background: STATUS_COLORS[task.status],
            }}
          >
            {task.status}
          </span>
          <span style={{ color: '#57606a' }}>
            ответ в {new Date(dataUpdatedAt).toLocaleTimeString()}
            {isFetching && ' · запрос…'}
            {task.status === 'done' && ' · пуллинг остановлен'}
          </span>
        </div>
      )}
    </div>
  );
};
