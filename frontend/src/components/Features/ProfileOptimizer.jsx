import { useState } from 'react';
import { UserCircle, AtSign, CheckCircle } from 'lucide-react';
import { Button, Card, Textarea, CopyButton, Badge, Loader, ErrorMessage } from '../UI';
import api from '../../utils/api';
import './ProfileOptimizer.css';

export default function ProfileOptimizer() {
  const [bio, setBio] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOptimize = async (e) => {
    e.preventDefault();
    if (!bio.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await api.optimizeProfile({ bio: bio.trim() });
      setResult(data);
    } catch (err) {
      setError(err.message || err.error || 'Failed to optimize profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <Card>
        <div className="card-header">
          <div>
            <h2 className="card-title">👤 Profile Optimizer</h2>
            <p className="card-subtitle">Transform your Instagram bio into a follower magnet</p>
          </div>
        </div>
        <form onSubmit={handleOptimize}>
          <Textarea
            label="Your Current Instagram Bio"
            placeholder="Paste your current Instagram bio here..."
            value={bio}
            onChange={e => setBio(e.target.value)}
            required
          />
          <div style={{ marginTop: '16px' }}>
            <Button variant="primary" size="lg" loading={loading} icon={<UserCircle size={16} />}>
              {loading ? 'Optimizing...' : 'Optimize My Profile'}
            </Button>
          </div>
        </form>
        {error && <div style={{ marginTop: '12px' }}><ErrorMessage message={error} /></div>}
      </Card>

      {loading && <Loader text="AI is crafting the perfect bio for you..." />}

      {result && !loading && (
        <div className="profile-results">
          {/* Bio Comparison */}
          <Card>
            <h3 className="card-title" style={{ marginBottom: '16px' }}>📝 Bio Comparison</h3>
            <div className="bio-comparison">
              <div className="bio-panel">
                <div className="bio-panel-title">Original Bio</div>
                <div className="bio-panel-text">{result.originalBio || bio}</div>
              </div>
              <div className="bio-panel" style={{ borderColor: 'rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.03)' }}>
                <div className="bio-panel-title" style={{ color: 'var(--accent-green)' }}>✨ AI Improved</div>
                <div className="bio-panel-text">{result.improvedBios?.[0] || ''}</div>
              </div>
            </div>
          </Card>

          {/* All Bio Suggestions */}
          {result.improvedBios?.length > 0 && (
            <Card style={{ marginTop: '16px' }}>
              <h3 className="card-title" style={{ marginBottom: '16px' }}>🎯 Bio Variations</h3>
              <div className="bio-suggestions">
                {result.improvedBios.map((b, i) => (
                  <div className="bio-suggestion-card" key={i}>
                    <div className="bio-suggestion-header">
                      <span className="bio-suggestion-label">Option {i + 1}</span>
                      <CopyButton text={b} />
                    </div>
                    <div className="bio-suggestion-text">{b}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Username Suggestions */}
          {result.usernameSuggestions?.length > 0 && (
            <Card style={{ marginTop: '16px' }}>
              <h3 className="card-title" style={{ marginBottom: '4px' }}>
                <AtSign size={18} style={{ display: 'inline', verticalAlign: 'middle' }} /> Username Ideas
              </h3>
              <p className="card-subtitle" style={{ marginBottom: '16px' }}>Click any username to copy it</p>
              <div className="username-suggestions">
                {result.usernameSuggestions.map((u, i) => (
                  <div className="username-chip" key={i} onClick={() => navigator.clipboard.writeText(u)}>
                    @{u}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Tips */}
          {result.tips?.length > 0 && (
            <Card style={{ marginTop: '16px' }}>
              <h3 className="card-title" style={{ marginBottom: '12px' }}>💡 Pro Tips</h3>
              <div className="tips-list">
                {result.tips.map((tip, i) => (
                  <div className="tip-item" key={i}>
                    <CheckCircle size={16} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: 2 }} />
                    {tip}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
