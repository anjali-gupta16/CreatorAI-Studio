import { useState } from 'react';
import { Video, Sparkles, Copy, Check, Save, Clock, Film, Music } from 'lucide-react';
import { Button, Input, Card, Badge } from '../../components/UI';
import { api } from '../../utils/api';
import './ReelScriptGenerator.css';

export default function ReelScriptGenerator() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setSaved(false);
    try {
      const data = await api.generateReelScript({ topic });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="reel-gen-container">
      <header className="feature-header">
        <div className="feature-header-icon"><Video size={24} /></div>
        <div>
          <h1>Reel Script Generator</h1>
          <p>Turn any topic into a structured, viral-ready video script.</p>
        </div>
      </header>

      <Card className="reel-input-card">
        <div className="reel-input-group">
          <Input
            label="What is your Reel about?"
            placeholder="e.g. 5 Morning Habits for Productivity, My Journey as a Creator..."
            value={topic}
            onChange={e => setTopic(e.target.value)}
          />
          <Button 
            primary 
            onClick={handleGenerate} 
            loading={loading}
            disabled={!topic.trim()}
          >
            <Sparkles size={18} />
            {result ? 'Regenerate Script' : 'Generate Script'}
          </Button>
        </div>
      </Card>

      {result && (
        <div className="reel-result-grid animate-fade-in">
          <Card className="reel-overview-card">
            <div className="reel-meta">
              <Badge variant="viral">Hook: {result.hook}</Badge>
              <Badge variant="info">CTA: {result.cta}</Badge>
            </div>
            
            <div className="reel-scenes">
              {result.scenes.map((scene, idx) => (
                <div key={idx} className="reel-scene-item">
                  <div className="scene-number">Scene {scene.scene}</div>
                  <div className="scene-content">
                    <div className="scene-visual">
                      <div className="scene-label"><Film size={14} /> Visual</div>
                      <p>{scene.visual}</p>
                    </div>
                    <div className="scene-audio">
                      <div className="scene-label"><Music size={14} /> Audio / Script</div>
                      <p>{scene.audio}</p>
                    </div>
                    <div className="scene-duration">
                      <Clock size={12} /> {scene.duration}
                    </div>
                  </div>
                  <button 
                    className="copy-scene-btn" 
                    onClick={() => handleCopy(`${scene.visual}\n${scene.audio}`, idx)}
                  >
                    {copied === idx ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              ))}
            </div>

            <div className="reel-actions">
              <Button outline onClick={() => handleCopy(JSON.stringify(result, null, 2), 'all')}>
                {copied === 'all' ? <Check size={18} /> : <Copy size={18} />}
                Copy Full Script
              </Button>
              <Button primary disabled={saved}>
                <Save size={18} />
                {saved ? 'Saved' : 'Save to Library'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
