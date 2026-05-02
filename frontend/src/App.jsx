import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './components/Layout/DashboardLayout';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Pricing from './pages/Pricing';
import Settings from './pages/Settings';
import CaptionGenerator from './components/Features/CaptionGenerator';
import ContentIdeas from './components/Features/ContentIdeas';
import ViralScore from './components/Features/ViralScore';
import Analytics from './components/Features/Analytics';
import ProfileOptimizer from './components/Features/ProfileOptimizer';
import SavedContent from './components/Features/SavedContent';
import ImagePrompts from './components/Features/ImagePrompts';
import Planner from './components/Features/Planner';
import { Loader } from './components/UI';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><Loader text="Loading..." /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><Loader text="Loading..." /></div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="captions" element={<CaptionGenerator />} />
        <Route path="ideas" element={<ContentIdeas />} />
        <Route path="viral-score" element={<ViralScore />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="profile" element={<ProfileOptimizer />} />
        <Route path="image-prompts" element={<ImagePrompts />} />
        <Route path="planner" element={<Planner />} />
        <Route path="saved" element={<SavedContent />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
