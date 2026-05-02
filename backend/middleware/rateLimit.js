const User = require('../models/User');

const FREE_DAILY_LIMIT = 5;

const checkGenerationLimit = async (req, res, next) => {
  try {
    const user = req.user;
    const today = new Date().toISOString().split('T')[0];

    // Premium users have unlimited access
    if (user.plan === 'premium') {
      return next();
    }

    // Reset counter if it's a new day
    if (user.lastGenerationDate !== today) {
      user.generationsToday = 0;
      user.lastGenerationDate = today;
      await user.save();
    }

    // Check if free limit is reached
    if (user.generationsToday >= FREE_DAILY_LIMIT) {
      return res.status(429).json({
        error: 'Daily limit reached',
        message: `You've used all ${FREE_DAILY_LIMIT} free generations today. Upgrade to Premium for unlimited access!`,
        limit: FREE_DAILY_LIMIT,
        used: user.generationsToday,
        resetAt: 'midnight'
      });
    }

    // Increment counter
    user.generationsToday += 1;
    user.lastGenerationDate = today;
    await user.save();

    // Attach remaining count to response
    req.generationsRemaining = FREE_DAILY_LIMIT - user.generationsToday;

    next();
  } catch (error) {
    console.error('Rate limit error:', error);
    next();
  }
};

module.exports = { checkGenerationLimit, FREE_DAILY_LIMIT };
