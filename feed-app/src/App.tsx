import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AnimatedBackground from './AnimatedBackground';
import Landing from './Landing';
import Feed from './Feed';
import EndTask from './EndTask';
import Admin from './Admin';
import RequireConsent from './RequireConsent';
import {
  DEFAULT_ADMIN_SETTINGS,
  loadAdminSettings,
  saveAdminSettings,
  type AdminSettings,
} from './adminSettings';

function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-4 relative">
      <AnimatedBackground />
      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <h1 className="text-title-light opacity-0 animate-stagger stagger-1">Simulated Social Media Environment</h1>
        <p className="text-label opacity-0 animate-stagger stagger-2" style={{ color: 'var(--text-secondary)' }}>
          Loading study settings...
        </p>
      </div>
    </div>
  );
}

function App() {
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_ADMIN_SETTINGS);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadAdminSettings()
      .then(loadedSettings => {
        if (cancelled) {
          return;
        }

        setSettings(loadedSettings);
        setSettingsLoaded(true);
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setSettings({ ...DEFAULT_ADMIN_SETTINGS });
        setSettingsLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSaveSettings = async (nextSettings: AdminSettings) => {
    const savedSettings = await saveAdminSettings(nextSettings);
    setSettings(savedSettings);
    return savedSettings;
  };

  if (!settingsLoaded) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<RequireConsent forceRequire={true}><Landing settings={settings} /></RequireConsent>} />
        <Route
          path="/feed"
          element={
            <RequireConsent>
              <Feed
                key={`feed-active-${settings.activeFeed}-${settings.timerMinutes}`}
                condition={settings.activeFeed}
                timerMinutes={settings.timerMinutes}
              />
            </RequireConsent>
          }
        />
        <Route
          path="/feed/a"
          element={
            <RequireConsent>
              <Feed
                key={`feed-a-${settings.timerMinutes}`}
                condition="A"
                timerMinutes={settings.timerMinutes}
              />
            </RequireConsent>
          }
        />
        <Route
          path="/feed/b"
          element={
            <RequireConsent>
              <Feed
                key={`feed-b-${settings.timerMinutes}`}
                condition="B"
                timerMinutes={settings.timerMinutes}
              />
            </RequireConsent>
          }
        />
        <Route path="/end" element={<EndTask />} />
        <Route path="/admin" element={<Admin settings={settings} onSaveSettings={handleSaveSettings} />} />
      </Routes>
    </Router>
  );
}

export default App;