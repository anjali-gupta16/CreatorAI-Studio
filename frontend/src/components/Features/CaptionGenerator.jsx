import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button, Card, Input, ToneSelector, CopyButton, Loader, ErrorMessage } from '../UI';
import api from '../../utils/api';
import './CaptionGenerator.css';

export default function CaptionGenerator() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await api.generateCaption({ topic: topic.trim(), tone });
      setResult(data);
    } catch (err) {
      setError(err.message || err.error || 'Failed to generate caption');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.saveContent('/generate-caption', { ...result, topic, tone });
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  return (
    <div className="caption-gen">
      <Card>
        <div className="card-header">
          <div>
            <h2 className="card-title">✍️ AI Caption Generator</h2>
            <p className="card-subtitle">Generate engaging captions with optimized hashtags</p>
          </div>
        </div>

        <form className="caption-gen-form" onSubmit={handleGenerate}>
          <Input
            label="Topic or Keyword"
            placeholder="e.g., morning routine, fitness tips, travel photography..."
            value={topic}
            onChange={e => setTopic(e.target.value)}
            required
          />

          <div>
            <label className="input-label" style={{ marginBottom: '8px', display: 'block' }}>Select Tone</label>
            <ToneSelector value={tone} onChange={setTone} />
          </div>

          <Button variant="primary" size="lg" loading={loading} icon={<Sparkles size={16} />}>
            {loading ? 'Generating...' : 'Generate Caption'}
          </Button>
        </form>

        {error && <ErrorMessage message={error} />}
      </Card>

      {loading && <Loader text="AI is crafting your perfect caption..." />}

      {result && !loading && (
        <Card className="caption-output" style={{ marginTop: '20px' }}>
          <div className="card-header">
            <h3 className="card-title">Your Caption</h3>
            <CopyButton text={`${result.caption}\n\n${result.hashtags?.join(' ') || ''}`} label="Copy All" />
          </div>

          <div className="caption-text">{result.caption}</div>

          {result.hashtags?.length > 0 && (
            <>
              <label className="input-label">Hashtags</label>
              <div className="hashtag-list">
                {result.hashtags.map((tag, i) => (
                  <span className="tag" key={i} onClick={() => navigator.clipboard.writeText(tag)}>{tag}</span>
                ))}
              </div>
              <CopyButton text={result.hashtags.join(' ')} label="Copy Hashtags" />
            </>
          )}

          <div className="caption-actions">
            <Button variant="secondary" size="sm" onClick={handleSave}>💾 Save</Button>
            <Button variant="ghost" size="sm" onClick={() => { setResult(null); }}>🔄 Generate Another</Button>
          </div>

          {result.generationsRemaining !== undefined && (
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginTop: '12px' }}>
              {result.generationsRemaining} generations remaining today
            </p>
          )}
        </Card>
      )}
    </div>
  );
}
