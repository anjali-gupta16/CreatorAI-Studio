import { useState } from 'react';
import { User, Mail, Shield, Key, LogOut, Save, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Input, Badge } from '../components/UI';

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [apiKey, setApiKey] = useState(localStorage.getItem('creatorai_openai_key') || '');
  const [loading, setLoading] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate save
    setTimeout(() => {
      updateUser({ name, email });
      localStorage.setItem('creatorai_openai_key', apiKey);
      setLoading(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  return (
    <div className="animate-fade-in-up" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800 }}>Account Settings</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>Manage your profile and platform preferences</p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Card>
          <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} /> Personal Information
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input 
              label="Full Name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
            />
            <Input 
              label="Email Address" 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              disabled 
            />
          </div>
        </Card>

        <Card>
          <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} /> Subscription Plan
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>{user?.plan} Plan</span>
                <Badge variant={user?.plan === 'premium' ? 'primary' : 'secondary'}>
                  {user?.plan === 'premium' ? 'Active' : 'Free'}
                </Badge>
              </div>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
                {user?.plan === 'premium' 
                  ? 'You have unlimited access to all AI tools.' 
                  : 'You are limited to 5 generations per day.'}
              </p>
            </div>
            {user?.plan === 'free' && (
              <Button variant="primary" size="sm" icon={<Zap size={14} />} onClick={() => window.location.href='/dashboard/pricing'}>
                Upgrade
              </Button>
            )}
          </div>
        </Card>

        <Card>
          <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key size={18} /> AI Configuration
          </h3>
          <div style={{ marginBottom: '16px' }}>
            <Input 
              label="OpenAI API Key (Optional)" 
              type="password" 
              placeholder="sk-..." 
              value={apiKey} 
              onChange={e => setApiKey(e.target.value)}
              helperText="Provide your own key to bypass demo limits. Keys are stored locally in your browser."
            />
          </div>
          <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-xs)', color: 'var(--accent-blue)' }}>
            <strong>Note:</strong> In Demo Mode, all tools work even without an API key using high-quality sample data.
          </div>
        </Card>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button variant="danger" ghost icon={<LogOut size={16} />} onClick={logout}>
            Logout Account
          </Button>
          <Button variant="primary" size="lg" icon={<Save size={16} />} loading={loading} type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
