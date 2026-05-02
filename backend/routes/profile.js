const express = require('express');
const { protect } = require('../middleware/auth');
const { checkGenerationLimit } = require('../middleware/rateLimit');
const { optimizeProfile } = require('../services/aiService');

const router = express.Router();

// POST /api/optimize-profile
router.post('/', protect, checkGenerationLimit, async (req, res) => {
  try {
    const { bio } = req.body;

    if (!bio || bio.trim().length === 0) {
      return res.status(400).json({ error: 'Instagram bio is required' });
    }

    const result = await optimizeProfile(bio.trim());

    res.json({
      ...result,
      originalBio: bio,
      generationsRemaining: req.generationsRemaining
    });
  } catch (error) {
    console.error('Profile optimization error:', error);
    res.status(500).json({ error: 'Failed to optimize profile' });
  }
});

module.exports = router;
