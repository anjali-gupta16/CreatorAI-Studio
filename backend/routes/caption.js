const express = require('express');
const { protect } = require('../middleware/auth');
const { checkGenerationLimit } = require('../middleware/rateLimit');
const { generateCaption } = require('../services/aiService');
const SavedContent = require('../models/SavedContent');

const router = express.Router();

// POST /api/generate-caption
router.post('/', protect, checkGenerationLimit, async (req, res) => {
  try {
    const { topic, tone = 'professional' } = req.body;

    if (!topic || topic.trim().length === 0) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const validTones = ['funny', 'professional', 'viral', 'motivational'];
    if (!validTones.includes(tone)) {
      return res.status(400).json({ error: `Tone must be one of: ${validTones.join(', ')}` });
    }

    const result = await generateCaption(topic.trim(), tone);

    res.json({
      ...result,
      topic,
      tone,
      generationsRemaining: req.generationsRemaining
    });
  } catch (error) {
    console.error('Caption generation error:', error);
    res.status(500).json({ error: 'Failed to generate caption' });
  }
});

// POST /api/generate-caption/save
router.post('/save', protect, async (req, res) => {
  try {
    const { caption, hashtags, topic, tone } = req.body;

    const saved = await SavedContent.create({
      userId: req.user._id,
      type: 'caption',
      title: `Caption: ${topic}`,
      content: { caption, hashtags, topic, tone }
    });

    res.status(201).json(saved);
  } catch (error) {
    console.error('Save caption error:', error);
    res.status(500).json({ error: 'Failed to save caption' });
  }
});

module.exports = router;
