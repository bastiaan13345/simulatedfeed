import { useNavigate } from 'react-router-dom';
import { ChevronRight, Settings } from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';

interface AdminSettings {
  activeFeed: 'A' | 'B';
  feedName: string;
}

function getAdminSettings(): AdminSettings | null {
  try {
    const raw = localStorage.getItem('feed-admin-settings');
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export default function Landing() {
  const navigate = useNavigate();
  const settings = getAdminSettings();

  // If admin has configured settings, show single entry button
  if (settings && settings.feedName) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white p-4 relative">
        <AnimatedBackground />
        <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
          <h1 className="text-title-light mb-6 text-center opacity-0 animate-stagger stagger-1">
            {settings.feedName}
          </h1>

          <div
            className="w-48 h-px mb-10 opacity-0 animate-stagger stagger-2"
            style={{
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          />

          <div className="w-full opacity-0 animate-stagger stagger-3">
            <button
              onClick={() => navigate('/feed')}
              className="glass glass-hover hover-scale w-full py-4 px-6 rounded-[20px] flex items-center justify-between transition-all duration-200"
            >
              <span className="text-username">Enter Feed</span>
              <ChevronRight className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.4)' }} />
            </button>
          </div>
        </div>

        <button
          onClick={() => navigate('/admin')}
          className="absolute top-6 right-6 z-20 glass w-10 h-10 rounded-full flex items-center justify-center hover-scale transition-all duration-200"
        >
          <Settings className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.4)', strokeWidth: 1.5 }} />
        </button>

        <p className="text-label absolute bottom-6 z-10" style={{ color: 'var(--text-tertiary)' }}>
          Research Study v1.0
        </p>
      </div>
    );
  }

  // Fallback: show both conditions
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-4 relative">
      <AnimatedBackground />
      <button
        onClick={() => navigate('/admin')}
        className="absolute top-6 right-6 z-20 glass w-10 h-10 rounded-full flex items-center justify-center hover-scale transition-all duration-200"
      >
        <Settings className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.4)', strokeWidth: 1.5 }} />
      </button>
      <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
        <h1 className="text-title-light mb-6 text-center opacity-0 animate-stagger stagger-1">
          Simulated Social Media Environment
        </h1>

        <div
          className="w-48 h-px mb-10 opacity-0 animate-stagger stagger-2"
          style={{
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        />

        <div className="flex flex-col gap-3 w-full opacity-0 animate-stagger stagger-3">
          <button
            onClick={() => navigate('/feed/a')}
            className="glass glass-hover hover-scale w-full py-4 px-6 rounded-[20px] flex items-center justify-between transition-all duration-200"
          >
            <span className="text-username">Condition A</span>
            <ChevronRight className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.4)' }} />
          </button>

          <button
            onClick={() => navigate('/feed/b')}
            className="glass glass-hover hover-scale w-full py-4 px-6 rounded-[20px] flex items-center justify-between transition-all duration-200"
          >
            <span className="text-username">Condition B</span>
            <ChevronRight className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.4)' }} />
          </button>
        </div>
      </div>

      <p className="text-label absolute bottom-6 z-10" style={{ color: 'var(--text-tertiary)' }}>
        Research Study v1.0
      </p>
    </div>
  );
}
