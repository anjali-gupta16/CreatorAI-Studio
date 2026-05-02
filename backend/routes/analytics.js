const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

const generateMockAnalytics = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return {
    overview: {
      totalFollowers: 12847, followersGrowth: 340,
      totalLikes: 48920, likesGrowth: 12.5,
      totalComments: 3240, commentsGrowth: 8.3,
      avgReach: 15600, reachGrowth: 22.1,
      engagementRate: 4.8, engagementGrowth: 0.6
    },
    weeklyEngagement: {
      labels: days,
      likes: [820, 932, 1101, 934, 1290, 1530, 1420],
      comments: [120, 182, 191, 134, 290, 330, 310],
      shares: [45, 62, 71, 54, 90, 120, 98]
    },
    followerGrowth: { labels: months, data: [8200, 9100, 9800, 10500, 11600, 12847] },
    topPerformingContent: [
      { type: 'Carousel', title: '10 Tips for Better Photos', likes: 2340, comments: 189, shares: 156, reach: 18500 },
      { type: 'Reel', title: 'Day in My Life Vlog', likes: 3120, comments: 245, shares: 312, reach: 25400 },
      { type: 'Single Post', title: 'Sunset Photography', likes: 1890, comments: 98, shares: 67, reach: 12300 }
    ],
    insights: [
      { icon: '📸', title: 'Carousels Perform Best', description: 'Carousel posts get 2.3x more engagement than single images.' },
      { icon: '⏰', title: 'Best Posting Time', description: 'Audience most active 6-9 PM weekdays.' },
      { icon: '🎬', title: 'Reels Drive Growth', description: 'Reels = 65% of new followers this month.' },
      { icon: '💬', title: 'Engagement Sweet Spot', description: '5-8 hashtags + question = 40% more comments.' }
    ],
    bestPostingTimes: {
      labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM', '12AM'],
      engagement: [15, 35, 55, 40, 85, 92, 30]
    }
  };
};

router.get('/', protect, (req, res) => {
  try {
    res.json(generateMockAnalytics());
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;
