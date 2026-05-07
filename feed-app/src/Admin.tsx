import { useEffect, useState } from 'react';
import AnimatedBackground from './AnimatedBackground';

import type { AdminSettings } from './adminSettings';

const PASSWORD = '120803';

interface AdminProps {
  settings: AdminSettings;
  onSaveSettings: (settings: AdminSettings) => Promise<AdminSettings>;
}

export default function Admin({ settings, onSaveSettings }: AdminProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [draftSettings, setDraftSettings] = useState<AdminSettings>(settings);

  useEffect(() => {
    setDraftSettings(settings);
  }, [settings]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) {
      setAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');

    try {
      const savedSettings = await onSaveSettings(draftSettings);
      setDraftSettings(savedSettings);
    } catch {
      setError('Unable to save settings');
    } finally {
      setIsSaving(false);
    }
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
              onClick={() => setDraftSettings(s => ({ ...s, activeFeed: 'A' }))}
              className={`flex-1 py-3 rounded-xl font-medium transition-all duration-200 ${
                draftSettings.activeFeed === 'A'
                  ? 'bg-white/15 text-white'
                  : 'glass glass-hover hover-scale text-white/60'
              }`}
            >
              Condition A
            </button>
            <button
              onClick={() => setDraftSettings(s => ({ ...s, activeFeed: 'B' }))}
              className={`flex-1 py-3 rounded-xl font-medium transition-all duration-200 ${
                draftSettings.activeFeed === 'B'
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
            value={draftSettings.feedName}
            onChange={(e) => setDraftSettings(s => ({ ...s, feedName: e.target.value }))}
            placeholder="e.g. Study 1 - Condition A"
            className="w-full py-3 px-4 rounded-xl glass text-white placeholder:text-white/30 outline-none"
            style={{ fontSize: 15 }}
          />
        </div>

        {/* Timer duration */}
        <div className="glass rounded-2xl p-5">
          <label className="text-label block mb-3" style={{ color: 'var(--text-secondary)' }}>
            Timer Duration (minutes)
          </label>
          <input
            type="number"
            min={1}
            max={60}
            value={draftSettings.timerMinutes}
            onChange={(e) => setDraftSettings(s => ({ ...s, timerMinutes: Math.max(1, parseInt(e.target.value) || 1) }))}
            className="w-full py-3 px-4 rounded-xl glass text-white outline-none"
            style={{ fontSize: 15 }}
          />
          <p className="text-label mt-2" style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>
            Participants are redirected to the survey when time expires.
          </p>
        </div>

        {/* Save */}
        {/* Condition Toggles */}
        <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
          <label className="block text-label text-white/50 mb-4">
            Visible Conditions (Fallback View)
          </label>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-white">Show Condition A</span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-white rounded"
                checked={draftSettings.showConditionA !== false}
                onChange={(e) => setDraftSettings(s => ({ ...s, showConditionA: e.target.checked }))}
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-white">Show Condition B</span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-white rounded"
                checked={draftSettings.showConditionB !== false}
                onChange={(e) => setDraftSettings(s => ({ ...s, showConditionB: e.target.checked }))}
              />
            </label>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full py-3 px-5 rounded-2xl glass glass-hover hover-scale text-white font-medium transition-all duration-200"
          style={isSaving ? { opacity: 0.7, cursor: 'wait' } : undefined}
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
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