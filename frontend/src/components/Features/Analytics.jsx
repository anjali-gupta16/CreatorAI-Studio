import { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Loader, ErrorMessage, Badge, Button } from '../UI';
import api from '../../utils/api';
import './Analytics.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 } } },
    tooltip: { backgroundColor: '#1e293b', titleColor: '#f8fafc', bodyColor: '#94a3b8', borderColor: '#334155', borderWidth: 1, cornerRadius: 8, padding: 12 }
  },
  scales: {
    x: { ticks: { color: '#64748b', font: { family: 'Inter' } }, grid: { color: 'rgba(148,163,184,0.06)' } },
    y: { ticks: { color: '#64748b', font: { family: 'Inter' } }, grid: { color: 'rgba(148,163,184,0.06)' } }
  }
};

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await api.getAnalytics();
        setData(result);
      } catch (err) {
        setError(err.message || err.error || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader text="Loading analytics data..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return null;

  const engagementData = {
    labels: data.weeklyEngagement?.labels || [],
    datasets: [
      { label: 'Likes', data: data.weeklyEngagement?.likes || [], backgroundColor: 'rgba(124, 58, 237, 0.7)', borderRadius: 6 },
      { label: 'Comments', data: data.weeklyEngagement?.comments || [], backgroundColor: 'rgba(236, 72, 153, 0.7)', borderRadius: 6 },
      { label: 'Shares', data: data.weeklyEngagement?.shares || [], backgroundColor: 'rgba(6, 182, 212, 0.7)', borderRadius: 6 },
    ]
  };

  const growthData = {
    labels: data.followerGrowth?.labels || [],
    datasets: [{
      label: 'Followers',
      data: data.followerGrowth?.data || [],
      borderColor: '#7c3aed',
      backgroundColor: 'rgba(124, 58, 237, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#7c3aed',
      pointRadius: 4,
    }]
  };

  const o = data.overview || {};
  const stats = [
    { label: 'Total Followers', value: (o.totalFollowers || 0).toLocaleString(), change: `+${o.followersGrowth || 0}` },
    { label: 'Total Likes', value: (o.totalLikes || 0).toLocaleString(), change: `+${o.likesGrowth || 0}%` },
    { label: 'Total Comments', value: (o.totalComments || 0).toLocaleString(), change: `+${o.commentsGrowth || 0}%` },
    { label: 'Avg Reach', value: (o.avgReach || 0).toLocaleString(), change: `+${o.reachGrowth || 0}%` },
    { label: 'Engagement Rate', value: `${o.engagementRate || 0}%`, change: `+${o.engagementGrowth || 0}%` },
  ];

  return (
    <div className="analytics-container">
      <div className="analytics-stats">
        {stats.map((s, i) => (
          <div className="analytics-stat" key={i}>
            <div className="analytics-stat-label">{s.label}</div>
            <div className="analytics-stat-value">{s.value}</div>
            <div className="analytics-stat-change">{s.change}</div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-wrapper">
          <h3>📊 Weekly Engagement</h3>
          <div style={{ height: 280 }}>
            <Bar data={engagementData} options={chartOptions} />
          </div>
        </div>
        <div className="chart-wrapper">
          <h3>📈 Follower Growth</h3>
          <div style={{ height: 280 }}>
            <Line data={growthData} options={chartOptions} />
          </div>
        </div>
      </div>

      {data.topPerformingContent?.length > 0 && (
        <div className="charts-grid" style={{ marginBottom: '24px' }}>
          <div className="chart-wrapper">
            <h3>🏆 Top Performing Content</h3>
            <table className="top-content-table">
              <thead>
                <tr><th>Type</th><th>Title</th><th>Reach</th></tr>
              </thead>
              <tbody>
                {data.topPerformingContent.map((c, i) => (
                  <tr key={i}>
                    <td><Badge variant={c.type === 'Reel' ? 'blue' : 'primary'}>{c.type}</Badge></td>
                    <td style={{ fontWeight: 500 }}>{c.title}</td>
                    <td>{c.reach.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="chart-wrapper">
            <h3>#️⃣ Top Hashtags</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
              {[
                { tag: '#instagramgrowth', reach: '12.4K', eng: '4.2%' },
                { tag: '#contentcreator', reach: '10.1K', eng: '3.8%' },
                { tag: '#socialmediatips', reach: '8.9K', eng: '5.1%' },
                { tag: '#creatoreconomy', reach: '7.5K', eng: '4.7%' },
                { tag: '#viralcontent', reach: '6.8K', eng: '3.2%' },
              ].map((h, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 600, color: 'var(--primary-400)' }}>{h.tag}</div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
                    <span>{h.reach} reach</span>
                    <span style={{ color: 'var(--accent-green)' }}>{h.eng} eng</span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" style={{ width: '100%', marginTop: '20px' }}>Explore All Hashtags</Button>
          </div>
        </div>
      )}

      <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: '16px' }}>🔍 AI Insights</h3>
      <div className="insights-grid">
        {data.insights?.map((insight, i) => (
          <div className="insight-card" key={i}>
            <div className="insight-icon">{insight.icon}</div>
            <div>
              <div className="insight-title">{insight.title}</div>
              <div className="insight-desc">{insight.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
