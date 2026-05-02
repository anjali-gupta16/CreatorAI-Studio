import { useState } from 'react';
import { Hash, Sparkles, Copy, Check, Save, TrendingUp, Target, Zap } from 'lucide-react';
import { Button, Input, Card, Badge } from '../../components/UI';
import { api } from '../../utils/api';
import './HashtagResearch.css';

export default function HashtagResearch() {
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(null);

  const handleSearch = async () => {
    if (!niche.trim()) return;
    setLoading(true);
    try {
      const data = await api.researchHashtags({ niche });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (hashtags, id) => {
    navigator.clipboard.writeText(hashtags.join(' '));
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const getAllHashtags = () => {
    return result.categories.flatMap(c => c.hashtags).join(' ');
  };

  return (
    <div className="hashtag-research-container">
      <header className="feature-header">
        <div className="feature-header-icon"><Hash size={24} /></div>
        <div>
          <h1>Hashtag Research</h1>
          <p>Find the perfect mix of viral and niche hashtags to boost your reach.</p>
        </div>
      </header>

      <Card className="hashtag-input-card">
        <div className="hashtag-input-group">
          <Input
            label="What is your niche or topic?"
            placeholder="e.g. Minimalist Home Decor, Personal Finance, Travel Photography..."
            value={niche}
            onChange={e => setNiche(e.target.value)}
          />
          <Button 
            primary 
            onClick={handleSearch} 
            loading={loading}
            disabled={!niche.trim()}
          >
            <Sparkles size={18} />
            {result ? 'Refresh Research' : 'Search Hashtags'}
          </Button>
        </div>
      </Card>

      {result && (
        <div className="hashtag-result-container animate-fade-in">
          <Card className="strategy-card">
            <div className="strategy-header">
              <TrendingUp size={20} className="strategy-icon" />
              <h3>AI Strategy</h3>
            </div>
            <p>{result.strategy}</p>
          </Card>

          <div className="hashtag-grid">
            {result.categories.map((category, idx) => (
              <Card key={idx} className="hashtag-category-card">
                <div className="category-header">
                  <div className="category-title">
                    {idx === 0 ? <Zap size={18} /> : idx === 1 ? <Target size={18} /> : <Hash size={18} />}
                    <h4>{category.name}</h4>
                  </div>
                  <button 
                    className="copy-mini-btn"
                    onClick={() => handleCopy(category.hashtags, idx)}
                    title="Copy category hashtags"
                  >
                    {copied === idx ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="hashtag-list">
                  {category.hashtags.map((tag, tIdx) => (
                    <span key={tIdx} className="hashtag-pill">{tag}</span>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          <div className="hashtag-actions">
            <Button primary fullWidth onClick={() => handleCopy(result.categories.flatMap(c => c.hashtags), 'all')}>
              {copied === 'all' ? <Check size={18} /> : <Copy size={18} />}
              Copy All {result.categories.flatMap(c => c.hashtags).length} Hashtags
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
