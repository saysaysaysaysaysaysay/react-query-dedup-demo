import { useState, type FormEvent } from 'react';
import { useUser } from '@entities/user/use-user';
import { useRenameUser } from '@entities/user/use-rename-user';

export const UserProfile = ({ userId }: { userId: string }) => {
  const { data: user, isLoading } = useUser(userId);
  const renameUser = useRenameUser();
  const [name, setName] = useState('');
  const [simulateError, setSimulateError] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    renameUser.mutate({ id: userId, name, simulateError });
    setName('');
  };

  if (isLoading) return <div style={{ padding: 24 }}>Загрузка...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ margin: '0 0 4px' }}>{user?.name}</h2>
      <p style={{ margin: '0 0 16px', color: '#57606a' }}>id {user?.id}</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          style={{
            padding: '6px 10px',
            border: '1px solid #d0d7de',
            borderRadius: 6,
            font: 'inherit',
            fontSize: 14,
            minWidth: 0,
            flex: 1,
          }}
          placeholder="Новое имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button
          type="submit"
          style={{
            padding: '6px 12px',
            border: '1px solid #1f6feb',
            borderRadius: 6,
            background: '#1f6feb',
            color: '#fff',
            font: 'inherit',
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          Переименовать
        </button>
        <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 14, width: '100%' }}>
          <input type="checkbox" checked={simulateError} onChange={(e) => setSimulateError(e.target.checked)} />
          сервер вернёт ошибку
        </label>
      </form>

      <div style={{ marginTop: 8, fontSize: 14, minHeight: 20 }}>
        {renameUser.isPending && <span style={{ color: '#1f6feb' }}>Сохраняем на сервере…</span>}
        {renameUser.isError && <span style={{ color: '#cf222e' }}>{renameUser.error.message}</span>}
      </div>
    </div>
  );
};
