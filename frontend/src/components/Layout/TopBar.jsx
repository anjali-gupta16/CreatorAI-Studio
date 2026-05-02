import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Settings, User, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './TopBar.css';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/dashboard/captions': 'Caption Generator',
  '/dashboard/ideas': 'Content Ideas',
  '/dashboard/viral-score': 'Viral Score',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/profile': 'Profile Optimizer',
  '/dashboard/pricing': 'Pricing',
};

export default function TopBar() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const title = pageTitles[location.pathname] || 'Dashboard';
  const initial = user?.name?.charAt(0)?.toUpperCase() || 'U';
  const today = new Date().toISOString().split('T')[0];
  const usedToday = user?.lastGenerationDate === today ? (user?.generationsToday || 0) : 0;

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{title}</h1>
      </div>

      <div className="topbar-right">
        {user?.plan === 'free' && (
          <div className="topbar-usage">
            <Zap size={12} />
            {5 - usedToday}/5 free today
          </div>
        )}

        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <div className="topbar-avatar" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className="topbar-avatar-circle">{initial}</div>
            <div>
              <div className="topbar-avatar-name">{user?.name || 'User'}</div>
              <div className="topbar-avatar-plan">{user?.plan || 'free'} plan</div>
            </div>
          </div>

          {dropdownOpen && (
            <div className="topbar-dropdown">
              <button className="topbar-dropdown-item" onClick={() => { navigate('/dashboard/profile'); setDropdownOpen(false); }}>
                <User size={14} /> Profile
              </button>
              <button className="topbar-dropdown-item" onClick={() => { navigate('/dashboard/pricing'); setDropdownOpen(false); }}>
                <Settings size={14} /> Upgrade Plan
              </button>
              <div style={{ height: 1, background: 'var(--border-color)', margin: '4px 0' }} />
              <button className="topbar-dropdown-item danger" onClick={handleLogout}>
                <LogOut size={14} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
