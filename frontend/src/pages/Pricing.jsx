import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Zap, Crown, CreditCard, Lock, ShieldCheck } from 'lucide-react';
import { Button, Card, Input } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const plans = [
  // ... (plans stay the same)
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Get started with basic AI tools',
    features: [
      { text: '5 AI generations per day', included: true },
      { text: 'Caption Generator', included: true },
      { text: 'Content Ideas', included: true },
      { text: 'Viral Score Predictor', included: true },
      { text: 'Basic Analytics', included: true },
      { text: 'Profile Optimizer', included: true },
      { text: 'Unlimited generations', included: false },
      { text: 'Priority AI processing', included: false },
      { text: 'Advanced analytics', included: false },
      { text: 'Export data', included: false },
    ],
    cta: 'Current Plan',
    variant: 'secondary',
    popular: false,
  },
  {
    name: 'Premium',
    price: '$9',
    period: '/month',
    desc: 'Unlimited access to all AI tools',
    features: [
      { text: 'Unlimited AI generations', included: true },
      { text: 'Caption Generator', included: true },
      { text: 'Content Ideas', included: true },
      { text: 'Viral Score Predictor', included: true },
      { text: 'Advanced Analytics', included: true },
      { text: 'Profile Optimizer', included: true },
      { text: 'Priority AI processing', included: true },
      { text: 'Advanced analytics & insights', included: true },
      { text: 'Export & download data', included: true },
      { text: 'Priority support', included: true },
    ],
    cta: 'Upgrade to Premium',
    variant: 'primary',
    popular: true,
  },
];

export default function Pricing() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });

  const handleUpgrade = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create real Stripe checkout session with dynamic origin
      const data = await api.createStripeSession({ origin: window.location.origin });
      
      // Redirect to Stripe Checkout page
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Could not get checkout URL');
      }
    } catch (err) {
      alert(err.error || 'Payment failed. Please check your Stripe keys in the .env file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2 style={{ fontSize: 'var(--font-3xl)', fontWeight: 800, marginBottom: '8px' }}>
          Simple, Transparent <span className="gradient-text">Pricing</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-base)' }}>
          Start free and upgrade when you need more power
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', maxWidth: '780px', margin: '0 auto' }}>
        {plans.map((plan, i) => (
          <Card
            key={i}
            gradient={plan.popular}
            style={{
              position: 'relative',
              border: plan.popular ? '2px solid var(--primary-500)' : undefined,
              boxShadow: plan.popular ? 'var(--shadow-glow-lg)' : undefined,
            }}
          >
            {plan.popular && (
              <div style={{
                position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                background: 'var(--gradient-primary)', padding: '4px 16px', borderRadius: 'var(--radius-full)',
                fontSize: 'var(--font-xs)', fontWeight: 700, color: 'white',
                display: 'flex', alignItems: 'center', gap: '4px'
              }}>
                <Crown size={12} /> Most Popular
              </div>
            )}

            <div style={{ textAlign: 'center', marginBottom: '24px', paddingTop: plan.popular ? '8px' : 0 }}>
              <h3 style={{ fontSize: 'var(--font-xl)', fontWeight: 700, marginBottom: '8px' }}>{plan.name}</h3>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontSize: 'var(--font-4xl)', fontWeight: 900 }}>{plan.price}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-sm)' }}>{plan.period}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>{plan.desc}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {plan.features.map((f, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--font-sm)' }}>
                  {f.included
                    ? <Check size={16} color="var(--accent-green)" />
                    : <X size={16} color="var(--text-muted)" />}
                  <span style={{ color: f.included ? 'var(--text-primary)' : 'var(--text-muted)' }}>{f.text}</span>
                </div>
              ))}
            </div>

            <Button
              variant={plan.variant}
              size="lg"
              style={{ width: '100%' }}
              disabled={(!plan.popular && user?.plan === 'free') || (plan.popular && user?.plan === 'premium')}
              icon={plan.popular ? <Zap size={16} /> : undefined}
              onClick={() => plan.popular && setShowCheckout(true)}
            >
              {user?.plan === 'premium' && plan.popular ? '✓ Active Plan' : plan.cta}
            </Button>
          </Card>
        ))}
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          padding: '20px'
        }}>
          <Card style={{ maxWidth: '450px', width: '100%', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: 'var(--font-xl)', fontWeight: 800 }}>Complete Payment</h3>
              <button onClick={() => setShowCheckout(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '24px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Premium Plan</span>
                <span style={{ fontWeight: 700 }}>$9.00/mo</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                <span>Billed monthly</span>
                <span>Tax: $0.00</span>
              </div>
            </div>

            <form onSubmit={handleUpgrade} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Google Pay / PayPal Simulation */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '8px' }}>
                <Button 
                  type="button"
                  style={{ background: '#000', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px' }}
                  onClick={handleUpgrade}
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Google_Pay_%28GPay%29_Logo.svg" alt="GPay" style={{ height: '18px', filter: 'brightness(0) invert(1)' }} />
                  Pay
                </Button>
                <Button 
                  type="button"
                  style={{ background: '#ffc439', color: '#003087', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px' }}
                  onClick={handleUpgrade}
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" style={{ height: '18px' }} />
                  Check out
                </Button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '8px 0' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>OR PAY WITH CARD</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
              </div>

              <Input 
                label="Cardholder Name" 
                placeholder="John Doe" 
                required 
                value={cardDetails.name}
                onChange={e => setCardDetails({...cardDetails, name: e.target.value})}
              />
              <Input 
                label="Card Number" 
                placeholder="0000 0000 0000 0000" 
                icon={<CreditCard size={16} />} 
                required 
                value={cardDetails.number}
                onChange={e => setCardDetails({...cardDetails, number: e.target.value})}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Input 
                  label="Expiry Date" 
                  placeholder="MM/YY" 
                  required 
                  value={cardDetails.expiry}
                  onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})}
                />
                <Input 
                  label="CVC" 
                  placeholder="123" 
                  type="password" 
                  required 
                  value={cardDetails.cvc}
                  onChange={e => setCardDetails({...cardDetails, cvc: e.target.value})}
                />
              </div>

              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '10px' }}>
                  <Lock size={12} /> Secure, encrypted payment
                  <ShieldCheck size={12} /> Powered by Stripe (Demo)
                </div>
                <Button variant="primary" size="lg" style={{ width: '100%' }} loading={loading}>
                  Pay $9.00 & Upgrade
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* FAQ */}
      <div style={{ maxWidth: '700px', margin: '64px auto 0', textAlign: 'center' }}>
        <h3 style={{ fontSize: 'var(--font-xl)', fontWeight: 700, marginBottom: '24px' }}>Frequently Asked Questions</h3>
        {[
          { q: 'Can I cancel anytime?', a: 'Yes! You can cancel your Premium subscription at any time. No questions asked.' },
          { q: 'What happens when I hit the free limit?', a: 'Free users get 5 AI generations per day. The counter resets at midnight. Upgrade to Premium for unlimited.' },
          { q: 'Do I need an OpenAI API key?', a: 'The platform works out of the box with sample data. For production AI responses, you\'ll need an API key.' },
        ].map((faq, i) => (
          <Card key={i} style={{ textAlign: 'left', marginBottom: '12px' }}>
            <h4 style={{ fontWeight: 600, marginBottom: '6px' }}>{faq.q}</h4>
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{faq.a}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
