import { useState } from 'react';
import AnimatedBackground from './AnimatedBackground';

interface AdminSettings {
  activeFeed: 'A' | 'B';
  feedName: string;
}

const STORAGE_KEY = 'feed-admin-settings';
const PASSWORD = '120803';

function getSettings(): AdminSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { activeFeed: 'A', feedName: '' };
}

function saveSettings(settings: AdminSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [settings, setSettings] = useState<AdminSettings>(getSettings());

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) {
      setAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleSave = () => {
    saveSettings(settings);
  };

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white p-4 relative">
        <AnimatedBackground />
        <h1 className="text-title-light mb-8 text-center opacity-0 animate-stagger stagger-1 relative z-10">
          Admin
        </h1>
        <form onSubmit={handleLogin} className="w-full max-w-sm opacity-0 animate-stagger stagger-2 relative z-10">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full py-3 px-5 rounded-2xl glass text-white placeholder:text-white/30 outline-none mb-3"
            style={{ fontSize: 15 }}
          />
          {error && <p className="text-red-400 text-sm mb-3 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 px-5 rounded-2xl glass glass-hover hover-scale text-white font-medium transition-all duration-200"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-4 relative">
      <AnimatedBackground />
      <h1 className="text-title-light mb-8 text-center relative z-10">Admin Dashboard</h1>

      <div className="w-full max-w-sm flex flex-col gap-4 relative z-10">
        {/* Feed toggle */}
        <div className="glass rounded-2xl p-5">
          <label className="text-label block mb-3" style={{ color: 'var(--text-secondary)' }}>
            Active Feed Condition
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setSettings(s => ({ ...s, activeFeed: 'A' }))}
              className={`flex-1 py-3 rounded-xl font-medium transition-all duration-200 ${
                settings.activeFeed === 'A'
                  ? 'bg-white/15 text-white'
                  : 'glass glass-hover hover-scale text-white/60'
              }`}
            >
              Condition A
            </button>
            <button
              onClick={() => setSettings(s => ({ ...s, activeFeed: 'B' }))}
              className={`flex-1 py-3 rounded-xl font-medium transition-all duration-200 ${
                settings.activeFeed === 'B'
                  ? 'bg-white/15 text-white'
                  : 'glass glass-hover hover-scale text-white/60'
              }`}
            >
              Condition B
            </button>
          </div>
        </div>

        {/* Feed name */}
        <div className="glass rounded-2xl p-5">
          <label className="text-label block mb-3" style={{ color: 'var(--text-secondary)' }}>
            Feed Display Name
          </label>
          <input
            type="text"
            value={settings.feedName}
            onChange={(e) => setSettings(s => ({ ...s, feedName: e.target.value }))}
            placeholder="e.g. Study 1 - Condition A"
            className="w-full py-3 px-4 rounded-xl glass text-white placeholder:text-white/30 outline-none"
            style={{ fontSize: 15 }}
          />
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          className="w-full py-3 px-5 rounded-2xl glass glass-hover hover-scale text-white font-medium transition-all duration-200"
        >
          Save Settings
        </button>

        {/* Logout */}
        <button
          onClick={() => setAuthenticated(false)}
          className="w-full py-2 text-sm transition-all duration-200"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
