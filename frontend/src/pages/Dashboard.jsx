import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Eye, Users, Heart, TrendingUp, PenLine, Lightbulb, BarChart3, UserCircle, 
  ArrowUpRight, Bookmark, Clock, ArrowRight, Zap, ImageIcon, Calendar
} from 'lucide-react';
import api from '../utils/api';
import './Dashboard.css';
import { Card, Badge, Loader, Button } from '../components/UI';

const stats = [
  { icon: Eye, label: 'Avg Reach', value: '15.6K', change: '+22%', color: '#7c3aed' },
  { icon: Users, label: 'Followers', value: '12.8K', change: '+340', color: '#3b82f6' },
  { icon: Heart, label: 'Engagement', value: '4.8%', change: '+0.6%', color: '#ec4899' },
  { icon: TrendingUp, label: 'Posts', value: '142', change: '+12', color: '#10b981' },
];

const quickActions = [
  { icon: PenLine, title: 'Generate Caption', desc: 'Create engaging captions with AI-optimized hashtags', path: '/dashboard/captions', color: '#7c3aed' },
  { icon: Lightbulb, title: 'Content Ideas', desc: 'Get fresh post and reel ideas for your niche', path: '/dashboard/ideas', color: '#f59e0b' },
  { icon: ImageIcon, title: 'Image Prompts', desc: 'Generate AI art prompts for your posts', path: '/dashboard/image-prompts', color: '#06b6d4' },
  { icon: TrendingUp, title: 'Viral Score', desc: 'Predict how well your caption will perform', path: '/dashboard/viral-score', color: '#10b981' },
  { icon: BarChart3, title: 'Analytics', desc: 'Track engagement and growth metrics', path: '/dashboard/analytics', color: '#3b82f6' },
  { icon: UserCircle, title: 'Profile Optimizer', desc: 'Improve your bio and username', path: '/dashboard/profile', color: '#ec4899' },
  { icon: Bookmark, title: 'Saved Content', desc: 'Access your saved captions and ideas', path: '/dashboard/saved', color: '#94a3b8' },
  { icon: Calendar, title: 'Content Planner', desc: 'Plan and schedule your weekly content', path: '/dashboard/planner', color: '#7c3aed' },
];

export default function Dashboard() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [recentSaved, setRecentSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      const finishUpgrade = async () => {
        try {
          const data = await api.upgrade();
          updateUser({ plan: data.plan });
          alert('🚀 Premium Activated! Thank you for your purchase.');
          // Clean up the URL
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (err) {
          console.error('Upgrade finalization failed');
        }
      };
      finishUpgrade();
    }
  }, []);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const data = await api.getSaved();
        setRecentSaved(data.slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch recent activity');
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  return (
    <div className="animate-fade-in-up">
      <div className="dashboard-welcome" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2>Welcome back, {user?.name?.split(' ')[0] || 'Creator'} 👋</h2>
          <p>Here's your Instagram growth overview. Use AI tools to create viral content.</p>
        </div>
        <Badge variant="orange" style={{ padding: '8px 12px', fontSize: '11px' }}>
          <Zap size={12} fill="currentColor" /> DEMO MODE
        </Badge>
      </div>

      <div className="stats-row">
        {stats.map((s, i) => (
          <div className="stat-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="stat-card-header">
              <div className="stat-card-icon" style={{ background: `${s.color}15` }}>
                <s.icon size={20} color={s.color} />
              </div>
              <span className="stat-card-change positive">
                <ArrowUpRight size={12} /> {s.change}
              </span>
            </div>
            <div className="stat-card-value">{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <h3>AI Tools</h3>
        <div className="quick-actions-grid">
          {quickActions.map((a, i) => (
            <Link className="quick-action-card" key={i} to={a.path}>
              <div className="quick-action-icon" style={{ background: `${a.color}15` }}>
                <a.icon size={22} color={a.color} />
              </div>
              <div className="quick-action-title">{a.title}</div>
              <div className="quick-action-desc">{a.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <div className="recent-activity">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700 }}>Recent Activity</h3>
            <Link to="/dashboard/saved" style={{ fontSize: 'var(--font-xs)', color: 'var(--primary-400)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <ArrowRight size={12} />
            </Link>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '70px', borderRadius: 'var(--radius-md)' }} />)
            ) : recentSaved.length > 0 ? (
              recentSaved.map((item, i) => (
                <div key={item._id} className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '16px', animationDelay: `${i * 0.1}s` }}>
                  <div style={{ padding: '10px', background: 'rgba(148, 163, 184, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
                    <Clock size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600 }}>{item.title}</div>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Saved on {new Date(item.createdAt).toLocaleDateString()}</div>
                  </div>
                  <Badge variant={item.type === 'caption' ? 'primary' : 'orange'}>{item.type}</Badge>
                </div>
              ))
            ) : (
              <div className="card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No recent activity. Start generating content!
              </div>
            )}
          </div>
        </div>

        <div className="growth-insight">
          <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: '16px' }}>Growth Insight</h3>
          <Card gradient style={{ height: 'calc(100% - 40px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '32px' }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(124, 58, 237, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'var(--primary-400)', marginBottom: '16px' }}>
              <TrendingUp size={32} />
            </div>
            <h4 style={{ marginBottom: '8px' }}>Optimization Tip</h4>
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Your audience engagement is highest on **Tuesdays at 7 PM**. Try scheduling your next carousel post for that slot to maximize reach!
            </p>
            <Button variant="primary" size="sm" style={{ marginTop: '20px' }} onClick={() => navigate('/dashboard/analytics')}>
              View Full Report
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
