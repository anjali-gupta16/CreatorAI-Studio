const express = require('express');
const { protect } = require('../middleware/auth');
const { checkGenerationLimit } = require('../middleware/rateLimit');
const { generateIdeas } = require('../services/aiService');
const SavedContent = require('../models/SavedContent');

const router = express.Router();

// POST /api/generate-ideas
router.post('/', protect, checkGenerationLimit, async (req, res) => {
  try {
    const { niche } = req.body;

    if (!niche || niche.trim().length === 0) {
      return res.status(400).json({ error: 'Niche/topic is required' });
    }

    const result = await generateIdeas(niche.trim());

    res.json({
      ...result,
      niche,
      generationsRemaining: req.generationsRemaining
    });
  } catch (error) {
    console.error('Ideas generation error:', error);
    res.status(500).json({ error: 'Failed to generate ideas' });
  }
});

// POST /api/generate-ideas/save
router.post('/save', protect, async (req, res) => {
  try {
    const { idea, niche } = req.body;

    const saved = await SavedContent.create({
      userId: req.user._id,
      type: 'idea',
      title: idea.title || `Idea: ${niche}`,
      content: { ...idea, niche }
    });

    res.status(201).json(saved);
  } catch (error) {
    console.error('Save idea error:', error);
    res.status(500).json({ error: 'Failed to save idea' });
  }
});

module.exports = router;
