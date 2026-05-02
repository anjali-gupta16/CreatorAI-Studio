import { useState } from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { Button, Card, Textarea, CopyButton, Loader, ErrorMessage } from '../UI';
import api from '../../utils/api';
import './ViralScore.css';

function getScoreColor(score) {
  if (score >= 75) return 'var(--accent-green)';
  if (score >= 50) return 'var(--accent-orange)';
  return 'var(--accent-red)';
}

function ScoreCircle({ score }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="score-circle">
      <svg viewBox="0 0 160 160">
        <circle className="score-circle-bg" cx="80" cy="80" r={radius} />
        <circle
          className="score-circle-progress"
          cx="80" cy="80" r={radius}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="score-value">
        <div className="score-number" style={{ color }}>{score}</div>
        <div className="score-label">/ 100</div>
      </div>
    </div>
  );
}

export default function ViralScore() {
  const [caption, setCaption] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!caption.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await api.getViralScore({ caption: caption.trim() });
      setResult(data);
    } catch (err) {
      setError(err.message || err.error || 'Failed to analyze caption');
    } finally {
      setLoading(false);
    }
  };

  const breakdownLabels = {
    emojiUsage: 'Emoji Usage',
    hashtagQuality: 'Hashtag Quality',
    captionLength: 'Caption Length',
    callToAction: 'Call to Action',
    hookStrength: 'Hook Strength'
  };

  return (
    <div className="viral-container">
      <Card>
        <div className="card-header">
          <div>
            <h2 className="card-title">📊 Viral Score Predictor</h2>
            <p className="card-subtitle">Analyze your caption's viral potential before posting</p>
          </div>
        </div>
        <form onSubmit={handleAnalyze}>
          <Textarea
            label="Paste Your Caption"
            placeholder="Paste or type your Instagram caption here..."
            value={caption}
            onChange={e => setCaption(e.target.value)}
            style={{ minHeight: '120px' }}
            required
          />
          <div style={{ marginTop: '16px' }}>
            <Button variant="primary" size="lg" loading={loading} icon={<TrendingUp size={16} />}>
              {loading ? 'Analyzing...' : 'Analyze Caption'}
            </Button>
          </div>
        </form>
        {error && <div style={{ marginTop: '12px' }}><ErrorMessage message={error} /></div>}
      </Card>

      {loading && <Loader text="AI is analyzing your caption's viral potential..." />}

      {result && !loading && (
        <Card className="viral-result">
          <div className="card-header">
            <h3 className="card-title">Analysis Results</h3>
          </div>

          <div className="score-display">
            <ScoreCircle score={result.score} />
          </div>

          {result.breakdown && (
            <div className="breakdown-grid">
              {Object.entries(result.breakdown).map(([key, value]) => (
                <div className="breakdown-item" key={key}>
                  <div className="breakdown-item-label">{breakdownLabels[key] || key}</div>
                  <div className="breakdown-item-value" style={{ color: getScoreColor(value) }}>{value}</div>
                  <div className="breakdown-item-bar">
                    <div className="breakdown-item-bar-fill" style={{ width: `${value}%`, background: getScoreColor(value) }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {result.suggestions?.length > 0 && (
            <>
              <h4 style={{ fontWeight: 700, margin: '20px 0 8px' }}>💡 Suggestions to Improve</h4>
              <div className="suggestions-list">
                {result.suggestions.map((s, i) => (
                  <div className="suggestion-item" key={i}>
                    <AlertCircle size={16} className="suggestion-icon" />
                    {s}
                  </div>
                ))}
              </div>
            </>
          )}

          {result.improvedCaption && (
            <div className="improved-caption">
              <div className="improved-caption-title">✨ AI-Improved Version</div>
              <div className="improved-caption-text">{result.improvedCaption}</div>
              <div style={{ marginTop: '12px' }}>
                <CopyButton text={result.improvedCaption} label="Copy Improved Caption" />
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
