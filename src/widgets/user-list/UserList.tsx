import { useState, type FormEvent } from 'react';
import { useUsers } from '@entities/user/use-users';
import { useCreateUser } from '@entities/user/use-create-user';
import type { User } from '@entities/user/api/user-service';

const SuccessModal = ({ user, onClose }: { user: User; onClose: () => void }) => (
  <div
    onClick={onClose}
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      zIndex: 10,
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{ background: '#fff', borderRadius: 12, padding: 24, width: 320, maxWidth: '100%' }}
    >
      <h3 style={{ margin: '0 0 8px' }}>Пользователь создан</h3>
      <p style={{ margin: '0 0 16px', color: '#57606a' }}>
        {user.name} · id {user.id}
      </p>
      <button
        onClick={onClose}
        style={{
          padding: '6px 12px',
          border: '1px solid #d0d7de',
          borderRadius: 6,
          background: '#f6f8fa',
          font: 'inherit',
          cursor: 'pointer',
        }}
      >
        Закрыть
      </button>
    </div>
  </div>
);

type Props = {
  selectedId: string;
  onSelect: (id: string) => void;
};

export const UserList = ({ selectedId, onSelect }: Props) => {
  const { data: users, isPending, isFetching } = useUsers();
  const [name, setName] = useState('');
  const [createdUser, setCreatedUser] = useState<User>();

  const createUser = useCreateUser({
    onSuccess: (user) => {
      setName('');
      setCreatedUser(user);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createUser.mutate({ name });
  };

  return (
    <div style={{ padding: 24 }}>
      <h3 style={{ margin: '0 0 12px' }}>
        Пользователи {isFetching && <span style={{ fontSize: 13, color: '#1f6feb' }}>обновляется…</span>}
      </h3>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
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
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={createUser.isPending}
          style={{
            padding: '6px 12px',
            border: '1px solid #1f6feb',
            borderRadius: 6,
            background: '#1f6feb',
            color: '#fff',
            font: 'inherit',
            fontSize: 14,
            cursor: createUser.isPending ? 'wait' : 'pointer',
            opacity: createUser.isPending ? 0.6 : 1,
          }}
        >
          {createUser.isPending ? 'Создаём…' : 'Создать'}
        </button>
      </form>

      {createUser.isError && (
        <div style={{ color: '#cf222e', fontSize: 14, marginBottom: 8 }}>{createUser.error.message}</div>
      )}

      {isPending ? (
        <div style={{ color: '#57606a' }}>Загрузка...</div>
      ) : (
        <ol reversed style={{ margin: 0, paddingLeft: 24, maxHeight: 240, overflowY: 'auto', fontSize: 14 }}>
          {[...(users ?? [])].reverse().map((user) => (
            <li
              key={user.id}
              onClick={() => onSelect(user.id)}
              style={{
                cursor: 'pointer',
                fontWeight: user.id === selectedId ? 600 : 400,
                color: user.id === selectedId ? '#1f6feb' : undefined,
              }}
            >
              {user.name}
            </li>
          ))}
        </ol>
      )}

      {createdUser && <SuccessModal user={createdUser} onClose={() => setCreatedUser(undefined)} />}
    </div>
  );
};
