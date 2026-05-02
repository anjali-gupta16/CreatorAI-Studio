import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, PenLine, Lightbulb, TrendingUp,
  BarChart3, UserCircle, CreditCard, Crown, Menu, X, Bookmark, ImageIcon, Calendar, Settings,
  Video, Hash
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const navItems = [
  { section: 'Overview', items: [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/dashboard/planner', icon: Calendar, label: 'Content Planner' },
  ]},
  { section: 'AI Tools', items: [
    { path: '/dashboard/captions', icon: PenLine, label: 'Caption Gen' },
    { path: '/dashboard/ideas', icon: Lightbulb, label: 'Content Ideas' },
    { path: '/dashboard/image-prompts', icon: ImageIcon, label: 'Image Prompts' },
    { path: '/dashboard/reel-scripts', icon: Video, label: 'Reel Scripts' },
    { path: '/dashboard/hashtags', icon: Hash, label: 'Hashtag Research' },
    { path: '/dashboard/viral-score', icon: TrendingUp, label: 'Viral Score' },
    { path: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/dashboard/profile', icon: UserCircle, label: 'Profile Optimizer' },
    { path: '/dashboard/saved', icon: Bookmark, label: 'Saved Content' },
  ]},
  { section: 'Account', items: [
    { path: '/dashboard/pricing', icon: CreditCard, label: 'Pricing' },
    { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ]},
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setOpen(true)}>
        <Menu size={20} />
      </button>

      <div className={`sidebar-overlay ${open ? 'visible' : ''}`} onClick={() => setOpen(false)} />

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">C</div>
          <div>
            <div className="sidebar-logo-text">CreatorAI Studio</div>
            <div className="sidebar-logo-sub">Instagram Growth</div>
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setOpen(false)}
            style={{ display: open ? 'flex' : undefined, position: 'static', background: 'none', border: 'none', marginLeft: 'auto' }}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(section => (
            <div className="sidebar-section" key={section.section}>
              <div className="sidebar-section-title">{section.section}</div>
              {section.items.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/dashboard'}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={() => setOpen(false)}
                >
                  <span className="sidebar-link-icon"><item.icon size={18} /></span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {user?.plan !== 'premium' && (
          <div className="sidebar-footer">
            <div className="sidebar-upgrade" onClick={() => { navigate('/dashboard/pricing'); setOpen(false); }}>
              <div className="sidebar-upgrade-icon"><Crown size={16} /></div>
              <div>
                <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>Go Premium</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Unlimited AI access</div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
