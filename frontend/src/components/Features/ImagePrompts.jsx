import { useState } from 'react';
import { ImageIcon, Sparkles, Copy, Check } from 'lucide-react';
import { Card, Button, Input, Loader, ErrorMessage, CopyButton } from '../UI';
import api from '../../utils/api';
import './ImagePrompts.css';

const styles = ['Cinematic', 'Minimalist', 'Vibrant', 'Professional', 'Cyberpunk', 'Vintage', '3D Render'];

export default function ImagePrompts() {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('Cinematic');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatingImages, setGeneratingImages] = useState({}); // { index: true/false }
  const [generatedImages, setGeneratedImages] = useState({}); // { index: url }
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await api.generateImagePrompts({ topic: topic.trim(), style });
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to generate prompts');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateVisual = async (index, promptText) => {
    setGeneratingImages(prev => ({ ...prev, [index]: true }));
    try {
      const data = await api.generateImage({ prompt: promptText });
      setGeneratedImages(prev => ({ ...prev, [index]: data.url }));
    } catch (err) {
      setError(err.message || 'Failed to generate visual');
    } finally {
      setGeneratingImages(prev => ({ ...prev, [index]: false }));
    }
  };

  return (
    <div className="image-prompts-container">
      <Card>
        <div className="card-header">
          <div>
            <h2 className="card-title">🎨 AI Image Prompt Generator</h2>
            <p className="card-subtitle">Generate high-quality prompts for Midjourney, DALL-E, or Canva</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input 
            label="What is your post about?"
            placeholder="e.g. A woman drinking coffee in a cozy cafe..."
            value={topic}
            onChange={e => setTopic(e.target.value)}
            required
          />

          <div>
            <label className="input-label" style={{ marginBottom: '8px', display: 'block' }}>Visual Style</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {styles.map(s => (
                <button
                  key={s}
                  type="button"
                  className={`tone-btn ${style === s ? 'active' : ''}`}
                  onClick={() => setStyle(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <Button variant="primary" size="lg" loading={loading} icon={<Sparkles size={16} />}>
            Generate Prompts
          </Button>
        </form>
      </Card>

      {error && <ErrorMessage message={error} />}
      {loading && <Loader text="Engineered perfect prompts for your visuals..." />}

      {result && !loading && (
        <div className="prompts-grid">
          {result.prompts.map((p, i) => (
            <Card key={i} className="prompt-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontWeight: 700 }}>{p.title}</h4>
                <CopyButton text={p.prompt} size={16} />
              </div>
              <div className="prompt-tag">Prompt</div>
              <div className="prompt-box">{p.prompt}</div>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginBottom: '16px' }}>{p.description}</p>
              
              <div className="visual-action">
                {generatedImages[i] ? (
                  <div className="generated-visual-container">
                    <img src={generatedImages[i]} alt={`Visual for ${p.title}`} className="generated-visual" />
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => handleGenerateVisual(i, p.prompt)}
                      loading={generatingImages[i]}
                      style={{ marginTop: '10px', width: '100%' }}
                    >
                      Regenerate Visual
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="primary" 
                    size="sm" 
                    fullWidth
                    onClick={() => handleGenerateVisual(i, p.prompt)}
                    loading={generatingImages[i]}
                    icon={<ImageIcon size={14} />}
                  >
                    Generate Visual
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
