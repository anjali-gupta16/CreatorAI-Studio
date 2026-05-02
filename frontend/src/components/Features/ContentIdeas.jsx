import { useState } from 'react';
import { Lightbulb, Film } from 'lucide-react';
import { Button, Card, Input, Badge, SaveButton, Loader, ErrorMessage } from '../UI';
import api from '../../utils/api';
import './ContentIdeas.css';

export default function ContentIdeas() {
  const [niche, setNiche] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedIds, setSavedIds] = useState(new Set());

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!niche.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await api.generateIdeas({ niche: niche.trim() });
      setResult(data);
    } catch (err) {
      setError(err.message || err.error || 'Failed to generate ideas');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (idea, index) => {
    try {
      await api.saveContent('/generate-ideas', { idea, niche });
      setSavedIds(prev => new Set([...prev, index]));
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  return (
    <div className="ideas-container">
      <Card>
        <div className="card-header">
          <div>
            <h2 className="card-title">💡 Content Ideas Generator</h2>
            <p className="card-subtitle">Get AI-powered post and reel ideas for your niche</p>
          </div>
        </div>
        <form style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }} onSubmit={handleGenerate}>
          <div style={{ flex: 1 }}>
            <Input
              label="Your Niche"
              placeholder="e.g., fitness, travel, cooking, tech..."
              value={niche}
              onChange={e => setNiche(e.target.value)}
              required
            />
          </div>
          <Button variant="primary" loading={loading} icon={<Lightbulb size={16} />} style={{ height: '46px' }}>
            Generate
          </Button>
        </form>
      </Card>

      {error && <ErrorMessage message={error} />}
      {loading && <Loader text="Brainstorming creative ideas..." />}

      {result && !loading && (
        <div style={{ marginTop: '8px' }}>
          {result.postIdeas?.length > 0 && (
            <>
              <h3 className="ideas-section-title">📸 Post Ideas</h3>
              <div className="ideas-grid">
                {result.postIdeas.map((idea, i) => (
                  <div className="idea-card" key={`post-${i}`} style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="idea-card-header">
                      <span className="idea-card-title">{idea.title}</span>
                      <SaveButton saved={savedIds.has(`p${i}`)} onSave={() => handleSave(idea, `p${i}`)} size={16} />
                    </div>
                    <p className="idea-card-desc">{idea.description}</p>
                    <div className="idea-card-meta">
                      <Badge variant="primary">{idea.format || 'Post'}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {result.reelIdeas?.length > 0 && (
            <>
              <h3 className="ideas-section-title"><Film size={18} /> Reel Ideas</h3>
              <div className="ideas-grid">
                {result.reelIdeas.map((idea, i) => (
                  <div className="idea-card" key={`reel-${i}`} style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="idea-card-header">
                      <span className="idea-card-title">{idea.title}</span>
                      <SaveButton saved={savedIds.has(`r${i}`)} onSave={() => handleSave(idea, `r${i}`)} size={16} />
                    </div>
                    <p className="idea-card-desc">{idea.description}</p>
                    <div className="idea-card-meta">
                      <Badge variant="blue">{idea.duration || '30s'}</Badge>
                      <Badge variant="orange">Reel</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
