const express = require('express');
const { protect } = require('../middleware/auth');
const { checkGenerationLimit } = require('../middleware/rateLimit');
const { predictViralScore } = require('../services/aiService');

const router = express.Router();

// POST /api/viral-score
router.post('/', protect, checkGenerationLimit, async (req, res) => {
  try {
    const { caption } = req.body;

    if (!caption || caption.trim().length === 0) {
      return res.status(400).json({ error: 'Caption text is required' });
    }

    const result = await predictViralScore(caption.trim());

    res.json({
      ...result,
      generationsRemaining: req.generationsRemaining
    });
  } catch (error) {
    console.error('Viral score error:', error);
    res.status(500).json({ error: 'Failed to analyze caption' });
  }
});

module.exports = router;
