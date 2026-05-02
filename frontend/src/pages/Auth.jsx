import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PenLine, BarChart3, Zap, Shield } from 'lucide-react';
import { Button, Input, ErrorMessage } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!name.trim()) { setError('Name is required'); setLoading(false); return; }
        await signup(name, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <button className="btn btn-ghost auth-back" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Back
        </button>
        <div className="auth-brand-content">
          <div className="auth-brand-logo">C</div>
          <h1>CreatorAI <span className="gradient-text">Studio</span></h1>
          <p>The all-in-one AI platform to grow your Instagram presence and create viral content.</p>
          <div className="auth-features-list">
            <div>
              <div className="auth-feature-icon"><PenLine size={14} color="var(--primary-400)" /></div>
              AI-powered caption & hashtag generation
            </div>
            <div>
              <div className="auth-feature-icon"><BarChart3 size={14} color="var(--primary-400)" /></div>
              Engagement analytics & growth tracking
            </div>
            <div>
              <div className="auth-feature-icon"><Zap size={14} color="var(--primary-400)" /></div>
              Viral score prediction with improvements
            </div>
            <div>
              <div className="auth-feature-icon"><Shield size={14} color="var(--primary-400)" /></div>
              5 free AI generations daily, no credit card
            </div>
          </div>
        </div>
      </div>

      <div className="auth-form-section">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2>{isLogin ? 'Welcome back' : 'Create your account'}</h2>
            <p>{isLogin ? 'Log in to access your dashboard' : 'Start growing your Instagram today'}</p>
          </div>

          {error && <ErrorMessage message={error} />}

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <Input
                label="Full Name"
                placeholder="Anjali Gupta"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            )}
            <Input
              label="Email Address"
              type="email"
              placeholder="justu@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <Button variant="primary" size="lg" loading={loading} style={{ width: '100%', marginTop: '8px' }}>
              {loading ? 'Please wait...' : (isLogin ? 'Log In' : 'Create Account')}
            </Button>
          </form>

          <div className="auth-toggle">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }}>
              {isLogin ? 'Sign up free' : 'Log in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
