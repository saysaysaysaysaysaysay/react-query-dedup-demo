import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { userKeys } from '@entities/user/api/user-queries';import { Header } from '@widgets/header/Header';
import { UserProfile } from '@widgets/user-profile/UserProfile';
import { UserList } from '@widgets/user-list/UserList';
import { TaskStatus } from '@widgets/task-status/TaskStatus';
import { CacheInspector } from '@widgets/query-demo/CacheInspector';
import { DemoControls } from '@widgets/query-demo/DemoControls';
import { DEFAULT_DEMO_CONFIG, type DemoConfig } from '@widgets/query-demo/config';

export const App = () => {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState('1');
  const [config, setConfig] = useState(DEFAULT_DEMO_CONFIG);
  const [session, setSession] = useState(0);
  const [showHeader, setShowHeader] = useState(true);
  const [showProfile, setShowProfile] = useState(true);

  // gcTime у существующего query можно только увеличить, поэтому при смене настроек начинаем с чистого кеша
  const handleConfigChange = (next: DemoConfig) => {
    queryClient.clear();
    queryClient.setDefaultOptions({ queries: next });
    setConfig(next);
    setShowHeader(true);
    setShowProfile(true);
    setSession((s) => s + 1);
  };

  return (
    <div key={session} style={{ fontFamily: 'system-ui, sans-serif', color: '#1f2328' }}>
      {showHeader ? (
        <Header userId={userId} />
      ) : (
        <div style={{ padding: '20px 24px', borderBottom: '1px dashed #d0d7de', color: '#8c959f' }}>
          Header размонтирован
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 32,
          padding: 24,
        }}
      >
        <div>
          <DemoControls
            config={config}
            onConfigChange={handleConfigChange}
            showHeader={showHeader}
            showProfile={showProfile}
            onToggleHeader={() => setShowHeader((v) => !v)}
            onToggleProfile={() => setShowProfile((v) => !v)}
            onInvalidate={() => queryClient.invalidateQueries({ queryKey: userKeys.all })}
          />
          <div style={{ marginTop: 16, border: '1px solid #d0d7de', borderRadius: 8 }}>
            {showProfile ? (
              <UserProfile userId={userId} />
            ) : (
              <div style={{ padding: 24, color: '#8c959f' }}>Profile размонтирован</div>
            )}
          </div>
          <div style={{ marginTop: 16, border: '1px solid #d0d7de', borderRadius: 8 }}>
            <UserList selectedId={userId} onSelect={setUserId} />
          </div>
          <div style={{ marginTop: 16, border: '1px solid #d0d7de', borderRadius: 8 }}>
            <TaskStatus />
          </div>        </div>
        <CacheInspector staleTime={config.staleTime} />
      </div>
    </div>
  );
};
