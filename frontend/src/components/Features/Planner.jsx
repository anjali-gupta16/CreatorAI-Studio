import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';
import { Card, Button, Badge, Loader } from '../UI';
import api from '../../utils/api';
import './Planner.css';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Planner() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getSaved();
        setSavedItems(data);
      } catch (err) {
        console.error('Failed to load planner data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getDaysInWeek = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  };

  const weekDays = getDaysInWeek(currentDate);

  const getItemsForDay = (day) => {
    const dayStr = day.toISOString().split('T')[0];
    // In demo mode, we'll just mock-assign some items if they match the date
    // or randomly distribute them for visual effect
    return savedItems.filter(item => {
      const itemDate = new Date(item.createdAt).toISOString().split('T')[0];
      return itemDate === dayStr;
    });
  };

  const isToday = (day) => {
    const today = new Date();
    return day.getDate() === today.getDate() && 
           day.getMonth() === today.getMonth() && 
           day.getFullYear() === today.getFullYear();
  };

  if (loading) return <Loader text="Setting up your content calendar..." />;

  return (
    <div className="planner-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800 }}>Content Planner</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>Schedule and organize your Instagram posts</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: '4px' }}>
            <Button variant="ghost" size="icon" style={{ height: '32px', width: '32px' }} onClick={() => {
              const d = new Date(currentDate);
              d.setDate(d.getDate() - 7);
              setCurrentDate(d);
            }}>
              <ChevronLeft size={16} />
            </Button>
            <div style={{ padding: '0 16px', display: 'flex', alignItems: 'center', fontSize: 'var(--font-sm)', fontWeight: 600 }}>
              {weekDays[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </div>
            <Button variant="ghost" size="icon" style={{ height: '32px', width: '32px' }} onClick={() => {
              const d = new Date(currentDate);
              d.setDate(d.getDate() + 7);
              setCurrentDate(d);
            }}>
              <ChevronRight size={16} />
            </Button>
          </div>
          <Button variant="primary" size="sm" icon={<Plus size={16} />}>New Post</Button>
        </div>
      </div>

      <div className="planner-grid">
        {weekDays.map((day, i) => {
          const items = getItemsForDay(day);
          return (
            <div key={i} className={`planner-day ${isToday(day) ? 'today' : ''}`}>
              <div className="planner-day-header">
                <div className="day-name">{days[day.getDay()]}</div>
                <div className="day-number">{day.getDate()}</div>
              </div>
              <div className="planner-slots">
                {items.length > 0 ? items.map((item, j) => (
                  <div key={j} className={`planner-item ${item.type}`}>
                    <div style={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '10px', color: 'var(--text-muted)' }}>
                      <Clock size={10} /> 10:00 AM
                    </div>
                  </div>
                )) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.2 }}>
                    <Plus size={20} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Card style={{ marginTop: '32px' }}>
        <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: '16px' }}>📌 Unscheduled Items</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {savedItems.length > 0 ? savedItems.slice(0, 5).map((item, i) => (
            <div key={i} className={`planner-item ${item.type}`} style={{ minWidth: '180px' }}>
              <div style={{ fontWeight: 600 }}>{item.title}</div>
              <div style={{ fontSize: '10px', marginTop: '2px', textTransform: 'capitalize' }}>{item.type}</div>
            </div>
          )) : (
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-sm)' }}>No saved items to schedule.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
