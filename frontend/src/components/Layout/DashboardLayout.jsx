import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function DashboardLayout() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Sidebar />
      <TopBar />
      <main style={{
        marginLeft: 'var(--sidebar-width)',
        paddingTop: 'var(--topbar-height)',
        minHeight: '100vh',
      }}>
        <div style={{ padding: '24px 32px', maxWidth: '1400px' }}>
          <Outlet />
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          main { margin-left: 0 !important; }
          main > div { padding: 16px !important; }
        }
      `}</style>
    </div>
  );
}
