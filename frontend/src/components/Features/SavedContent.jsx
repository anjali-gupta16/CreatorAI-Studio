import { useState, useEffect } from 'react';
import { Bookmark, Trash2, ExternalLink, PenLine, Lightbulb, UserCircle, TrendingUp, Search } from 'lucide-react';
import { Card, Button, Badge, Loader, ErrorMessage, Input, CopyButton } from '../UI';
import api from '../../utils/api';
import './SavedContent.css';

export default function SavedContent() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const data = await api.getSaved();
      setItems(data);
    } catch (err) {
      setError('Failed to load saved content');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this saved item?')) return;
    try {
      await api.deleteSaved(id);
      setItems(items.filter(item => item._id !== id));
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  const filteredItems = items.filter(item => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         JSON.stringify(item.content).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'caption': return <PenLine size={14} />;
      case 'idea': return <Lightbulb size={14} />;
      case 'bio': return <UserCircle size={14} />;
      case 'viral-analysis': return <TrendingUp size={14} />;
      default: return <Bookmark size={14} />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'caption': return 'var(--primary-400)';
      case 'idea': return 'var(--accent-orange)';
      case 'bio': return 'var(--accent-pink)';
      case 'viral-analysis': return 'var(--accent-green)';
      default: return 'var(--text-muted)';
    }
  };

  const getContentPreview = (item) => {
    if (item.type === 'caption') return item.content.caption;
    if (item.type === 'idea') return item.content.description || item.content.title;
    if (item.type === 'bio') return item.content.improvedBios?.[0] || 'Profile Optimization';
    return 'Saved Analysis';
  };

  if (loading && items.length === 0) return <Loader text="Loading your saved content..." />;

  return (
    <div className="saved-container">
      <div className="saved-header">
        <div>
          <h2 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800 }}>Saved Content</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>Access all your AI-generated growth assets</p>
        </div>
      </div>

      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <Input 
              placeholder="Search saved content..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              icon={<Search size={16} />}
            />
          </div>
          <div className="saved-filters">
            {['all', 'caption', 'idea', 'bio'].map(f => (
              <button 
                key={f}
                className={`tone-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
                style={{ textTransform: 'capitalize' }}
              >
                {f === 'all' ? 'All Items' : f + 's'}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {error && <ErrorMessage message={error} onRetry={fetchSaved} />}

      {filteredItems.length === 0 ? (
        <div className="saved-empty">
          <div className="saved-empty-icon">
            <Bookmark size={32} />
          </div>
          <h3 style={{ marginBottom: '8px' }}>No saved items found</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
            {searchTerm || filter !== 'all' 
              ? "We couldn't find any items matching your current filters." 
              : "Items you save from the generator tools will appear here for easy access."}
          </p>
          {(searchTerm || filter !== 'all') && (
            <Button variant="ghost" style={{ marginTop: '16px' }} onClick={() => { setFilter('all'); setSearchTerm(''); }}>
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="saved-grid">
          {filteredItems.map((item, i) => (
            <Card key={item._id} className="saved-card" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="saved-card-type" style={{ color: getTypeColor(item.type) }}>
                {getTypeIcon(item.type)}
                <span style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>{item.type}</span>
              </div>
              <h4 style={{ fontSize: 'var(--font-base)', fontWeight: 700, marginBottom: '8px' }}>{item.title}</h4>
              <p className="saved-card-content">{getContentPreview(item)}</p>
              
              <div className="saved-card-footer">
                <span className="saved-date">
                  {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <CopyButton text={getContentPreview(item)} label="" />
                  <Button variant="danger" size="icon" onClick={() => handleDelete(item._id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
