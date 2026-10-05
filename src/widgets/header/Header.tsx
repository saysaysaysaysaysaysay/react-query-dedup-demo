import { useUser } from '@entities/user/use-user';
import { UserAvatar } from '@entities/user/ui/UserAvatar';

export const Header = ({ userId }: { userId: string }) => {
  const { data: user } = useUser(userId);

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 24px',
        borderBottom: '1px solid #eee',
      }}
    >
      <strong>My App</strong>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span>{user?.name}</span>
        <UserAvatar img={user?.avatar} />
      </div>
    </header>
  );
};
