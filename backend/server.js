const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();

const { connectDB } = require('./config/db');
const { 
  generateCaption, generateIdeas, predictViralScore, optimizeProfile, generateImagePrompts, generateImage,
  generateReelScript, researchHashtags
} = require('./services/aiService');
const User = require('./models/User');
const SavedContent = require('./models/SavedContent');

const app = express();
app.use(cors());
app.use(express.json());

// Vercel `routePrefix` might strip the '/api' from the URL. 
// This middleware ensures the URL always starts with '/api' so existing routes match.
app.use((req, res, next) => {
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
  }
  next();
});

// Serverless DB Connection Middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error.message);
    res.status(500).json({ error: `Database connection failed: ${error.message}. Please check your MONGODB_URI and ensure MongoDB Atlas Network Access allows connections from anywhere (0.0.0.0/0).` });
  }
});

const JWT_SECRET = process.env.JWT_SECRET || 'creatorai-studio-production-secret-2024';
const FREE_DAILY_LIMIT = 5;

// ─── Auth Middleware ────────────────────────────────────────────
async function protect(req, res, next) {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ error: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) return res.status(401).json({ error: 'User not found' });
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid' });
  }
}

// ─── Rate Limit Middleware ──────────────────────────────────────
async function checkLimit(req, res, next) {
  const user = req.user;
  if (user.plan === 'premium') return next();

  const today = new Date().toISOString().split('T')[0];
  if (user.lastGenerationDate !== today) {
    user.generationsToday = 0;
    user.lastGenerationDate = today;
  }
  if (user.generationsToday >= FREE_DAILY_LIMIT) {
    return res.status(429).json({
      error: 'Daily limit reached',
      message: `You've used all ${FREE_DAILY_LIMIT} free generations today. Upgrade to Premium!`,
      limit: FREE_DAILY_LIMIT, used: user.generationsToday,
    });
  }
  user.generationsToday += 1;
  user.lastGenerationDate = today;

  try { await user.save(); } catch(e) {}

  req.generationsRemaining = FREE_DAILY_LIMIT - user.generationsToday;
  next();
}

// ═══════════════════════════════════════════════════════════════
// AUTH ROUTES
// ═══════════════════════════════════════════════════════════════

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be 6+ characters' });

    if (await User.findOne({ email })) return res.status(400).json({ error: 'Email already registered' });
    const user = await User.create({ name, email, password });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, plan: user.plan, generationsToday: 0, token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });
    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ error: 'Invalid email or password' });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ _id: user._id, name: user.name, email: user.email, plan: user.plan, generationsToday: user.generationsToday, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_your_key_here');

app.post('/api/auth/upgrade', protect, async (req, res) => {
  try {
    console.log(`[UPGRADE] Attempting to upgrade user: ${req.user.email}`);
    const user = await User.findById(req.user._id);
    if (!user) {
      console.error('[UPGRADE] User not found in DB');
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.plan = 'premium';
    await user.save();
    
    console.log(`[UPGRADE] Successfully upgraded user: ${req.user.email}`);
    res.json({ message: 'Upgraded to Premium', plan: 'premium' });
  } catch (error) {
    console.error('[UPGRADE] Error:', error);
    res.status(500).json({ error: 'Upgrade failed' });
  }
});

app.post('/api/stripe/create-checkout-session', protect, async (req, res) => {
  try {
    const { origin } = req.body;
    const clientUrl = origin || process.env.CLIENT_URL || 'http://localhost:5173';
    
    const isLocalDemo = !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_your_key_here';
    
    if (isLocalDemo) {
      // Return a simulated success URL for development/demo
      return res.json({ 
        id: 'demo_session', 
        url: `${clientUrl}/dashboard?payment=success&demo=true` 
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Google Pay and Apple Pay are included in 'card' by default in Stripe Checkout
      payment_method_collection: 'always',
      billing_address_collection: 'auto',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'CreatorAI Premium Plan',
              description: 'Unlimited access to all AI tools',
            },
            unit_amount: 900, // $9.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${clientUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}&payment=success`,
      cancel_url: `${clientUrl}/dashboard/pricing?payment=cancelled`,
      customer_email: req.user.email,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe Error:', error.message);
    res.status(500).json({ error: 'Could not create checkout session' });
  }
});

app.get('/api/auth/me', protect, (req, res) => {
  const u = req.user;
  const today = new Date().toISOString().split('T')[0];
  res.json({
    _id: u._id, name: u.name, email: u.email, plan: u.plan,
    generationsToday: u.lastGenerationDate === today ? u.generationsToday : 0,
    createdAt: u.createdAt,
  });
});

// ═══════════════════════════════════════════════════════════════
// AI FEATURE ROUTES
// ═══════════════════════════════════════════════════════════════

app.post('/api/generate-caption', protect, checkLimit, async (req, res) => {
  try {
    const { topic, tone = 'professional' } = req.body;
    if (!topic?.trim()) return res.status(400).json({ error: 'Topic is required' });
    const result = await generateCaption(topic.trim(), tone);
    res.json({ ...result, topic, tone, generationsRemaining: req.generationsRemaining });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate caption' });
  }
});

app.post('/api/generate-caption/save', protect, async (req, res) => {
  try {
    const item = await SavedContent.create({ 
      userId: req.user._id, 
      type: 'caption', 
      title: `Caption: ${req.body.topic || ''}`, 
      content: req.body 
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save caption' });
  }
});

app.post('/api/generate-ideas', protect, checkLimit, async (req, res) => {
  try {
    const { niche } = req.body;
    if (!niche?.trim()) return res.status(400).json({ error: 'Niche is required' });
    const result = await generateIdeas(niche.trim());
    res.json({ ...result, niche, generationsRemaining: req.generationsRemaining });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate ideas' });
  }
});

app.post('/api/generate-ideas/save', protect, async (req, res) => {
  try {
    const item = await SavedContent.create({ 
      userId: req.user._id, 
      type: 'idea', 
      title: req.body.idea?.title || 'Idea', 
      content: req.body 
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save idea' });
  }
});

app.post('/api/viral-score', protect, checkLimit, async (req, res) => {
  try {
    const { caption } = req.body;
    if (!caption?.trim()) return res.status(400).json({ error: 'Caption is required' });
    const result = await predictViralScore(caption.trim());
    res.json({ ...result, generationsRemaining: req.generationsRemaining });
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze caption' });
  }
});

app.post('/api/optimize-profile', protect, checkLimit, async (req, res) => {
  try {
    const { bio } = req.body;
    if (!bio?.trim()) return res.status(400).json({ error: 'Bio is required' });
    const result = await optimizeProfile(bio.trim());
    res.json({ ...result, originalBio: bio, generationsRemaining: req.generationsRemaining });
  } catch (error) {
    res.status(500).json({ error: 'Failed to optimize profile' });
  }
});

app.post('/api/generate-image-prompts', protect, checkLimit, async (req, res) => {
  try {
    const { topic, style = 'modern' } = req.body;
    if (!topic?.trim()) return res.status(400).json({ error: 'Topic is required' });
    const result = await generateImagePrompts(topic.trim(), style);
    res.json({ ...result, topic, style, generationsRemaining: req.generationsRemaining });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate image prompts' });
  }
});

app.post('/api/generate-image', protect, checkLimit, async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt?.trim()) return res.status(400).json({ error: 'Prompt is required' });
    
    const result = await generateImage(prompt.trim());
    res.json({ ...result, generationsRemaining: req.generationsRemaining });
  } catch (error) {
    console.error('[IMAGE_GEN] Error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to generate image' });
  }
});

app.post('/api/generate-reel-script', protect, checkLimit, async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic?.trim()) return res.status(400).json({ error: 'Topic is required' });
    const result = await generateReelScript(topic.trim());
    res.json({ ...result, generationsRemaining: req.generationsRemaining });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate reel script' });
  }
});

app.post('/api/research-hashtags', protect, checkLimit, async (req, res) => {
  try {
    const { niche } = req.body;
    if (!niche?.trim()) return res.status(400).json({ error: 'Niche is required' });
    const result = await researchHashtags(niche.trim());
    res.json({ ...result, generationsRemaining: req.generationsRemaining });
  } catch (error) {
    res.status(500).json({ error: 'Failed to research hashtags' });
  }
});

// ═══════════════════════════════════════════════════════════════
// ANALYTICS ROUTE
// ═══════════════════════════════════════════════════════════════

app.get('/api/analytics', protect, (req, res) => {
  res.json({
    overview: {
      totalFollowers: 12847, followersGrowth: 340,
      totalLikes: 48920, likesGrowth: 12.5,
      totalComments: 3240, commentsGrowth: 8.3,
      avgReach: 15600, reachGrowth: 22.1,
      engagementRate: 4.8, engagementGrowth: 0.6,
    },
    weeklyEngagement: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      likes: [820, 932, 1101, 934, 1290, 1530, 1420],
      comments: [120, 182, 191, 134, 290, 330, 310],
      shares: [45, 62, 71, 54, 90, 120, 98],
    },
    followerGrowth: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], data: [8200, 9100, 9800, 10500, 11600, 12847] },
    topPerformingContent: [
      { type: 'Carousel', title: '10 Tips for Better Photos', likes: 2340, comments: 189, shares: 156, reach: 18500 },
      { type: 'Reel', title: 'Day in My Life Vlog', likes: 3120, comments: 245, shares: 312, reach: 25400 },
      { type: 'Single Post', title: 'Sunset Photography', likes: 1890, comments: 98, shares: 67, reach: 12300 },
    ],
    insights: [
      { icon: '📸', title: 'Carousels Perform Best', description: 'Carousel posts get 2.3x more engagement than single images.' },
      { icon: '⏰', title: 'Best Posting Time', description: 'Audience most active 6-9 PM weekdays.' },
      { icon: '🎬', title: 'Reels Drive Growth', description: 'Reels = 65% of new followers this month.' },
      { icon: '💬', title: 'Engagement Sweet Spot', description: '5-8 hashtags + question = 40% more comments.' },
    ],
    bestPostingTimes: { labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM', '12AM'], engagement: [15, 35, 55, 40, 85, 92, 30] },
  });
});

// ═══════════════════════════════════════════════════════════════
// SAVED CONTENT ROUTES
// ═══════════════════════════════════════════════════════════════

app.get('/api/saved', protect, async (req, res) => {
  try {
    const items = await SavedContent.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch saved content' });
  }
});

app.delete('/api/saved/:id', protect, async (req, res) => {
  try {
    const result = await SavedContent.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!result) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete content' });
  }
});

// Health check
app.get(['/health', '/api/health'], (req, res) => {
  res.json({ status: 'ok', mode: 'serverless', timestamp: new Date().toISOString() });
});

// API 404 handler for all unmatched routes
app.use((req, res) => {
  console.log(`[404] Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Route not found', path: req.url });
});

// ═══════════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════════

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    connectDB(); // Only connect once at startup in development mode
    console.log(`\n🚀 CreatorAI Studio API running in DEVELOPMENT MODE on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health\n`);
  });
}

// Export the Express app for Vercel Serverless Functions
module.exports = app;
