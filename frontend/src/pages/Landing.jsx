import { useNavigate } from 'react-router-dom';
import { Sparkles, PenLine, Lightbulb, TrendingUp, BarChart3, UserCircle, ArrowRight, Zap } from 'lucide-react';
import { Button } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import './Landing.css';

const features = [
  { icon: '✍️', title: 'AI Caption Generator', desc: 'Generate engaging captions with emojis and optimized hashtags in any tone.', color: '#7c3aed' },
  { icon: '🎬', title: 'Reel Script Generator', desc: 'Turn any topic into a 30-60s structured script with visual and audio cues.', color: '#3b82f6' },
  { icon: '＃', title: 'Hashtag Research', desc: 'Find viral and low-competition hashtags categorized by niche and reach.', color: '#10b981' },
  { icon: '💡', title: 'Content Ideas Engine', desc: 'Daily post and reel suggestions tailored to your niche with bookmark support.', color: '#f59e0b' },
  { icon: '📊', title: 'Viral Score Predictor', desc: 'Analyze captions before posting with AI-driven tips to boost engagement.', color: '#ec4899' },
  { icon: '👤', title: 'Profile Optimizer', desc: 'AI-powered bio suggestions and username ideas to attract more followers.', color: '#06b6d4' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    navigate(user ? '/dashboard' : '/auth');
  };

  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav-brand">
          <div className="landing-nav-brand-icon">C</div>
          CreatorAI Studio
        </div>
        <div className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
        </div>
        <div className="landing-nav-actions">
          {user ? (
            <Button variant="primary" onClick={() => navigate('/dashboard')}>Dashboard <ArrowRight size={16} /></Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/auth')}>Log in</Button>
              <Button variant="primary" onClick={() => navigate('/auth')}>Get Started Free <ArrowRight size={16} /></Button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            AI-Powered Instagram Growth
          </div>
          <h1 className="hero-title">
            Grow Your Instagram with <span className="gradient-text">AI-Powered</span> Content
          </h1>
          <p className="hero-subtitle">
            Generate viral captions, predict engagement scores, get content ideas, and optimize your profile — all powered by artificial intelligence.
          </p>
          <div className="hero-actions">
            <Button variant="primary" size="lg" onClick={handleGetStarted}>
              <Zap size={18} /> Start Creating Free
            </Button>
            <Button variant="secondary" size="lg" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              See Features
            </Button>
          </div>
          <div className="hero-stats">
            <div>
              <div className="hero-stat-value">10K+</div>
              <div className="hero-stat-label">Creators</div>
            </div>
            <div>
              <div className="hero-stat-value">500K+</div>
              <div className="hero-stat-label">Generated</div>
            </div>
            <div>
              <div className="hero-stat-value">4.9★</div>
              <div className="hero-stat-label">Rating</div>
            </div>
          </div>
        </div>
        <div className="hero-image-container">
          <div className="hero-image-wrapper">
            <img src="/landing_hero_premium.png" alt="CreatorAI Studio Dashboard" className="hero-main-img" />
            <div className="hero-floating-card card-1 animate-float">
              <BarChart3 size={16} />
              <span>Engagement +42%</span>
            </div>
            <div className="hero-floating-card card-2 animate-float-delayed">
              <Zap size={16} />
              <span>Viral Score 98</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <div className="section-header">
          <div className="section-badge">Features</div>
          <h2 className="section-title">Everything You Need to <span className="gradient-text">Grow</span></h2>
          <p className="section-subtitle">Powerful AI tools designed to help Instagram creators save time, increase engagement, and grow their audience faster.</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="feature-icon" style={{ background: `${f.color}15` }}>{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="pricing">
        <div className="cta-content">
          <h2 className="cta-title">Ready to <span className="gradient-text">Supercharge</span> Your Instagram?</h2>
          <p className="cta-subtitle">Join thousands of creators already using CreatorAI Studio to grow faster.</p>
          <Button variant="primary" size="lg" onClick={handleGetStarted}>
            <Zap size={18} /> Get Started Free — No Credit Card Required
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div>© 2024 CreatorAI Studio. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="#" style={{ color: 'var(--text-muted)' }}>Privacy</a>
          <a href="#" style={{ color: 'var(--text-muted)' }}>Terms</a>
          <a href="#" style={{ color: 'var(--text-muted)' }}>Contact</a>
        </div>
      </footer>
    </div>
  );
}
