import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Feed from './Feed';
import EndTask from './EndTask';
import Admin from './Admin';
import InformedConsent from './InformedConsent';

const CONSENT_KEY = 'feed-consent-given';

function App() {
  const [consented, setConsented] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored === 'true') {
        setConsented(true);
      } else {
        setConsented(false);
      }
    } catch {
      setConsented(false);
    }
  }, []);

  const handleAccepted = () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'true');
    } catch {}
    setConsented(true);
  };

  if (consented === null) return null;

  if (!consented) {
    return <InformedConsent onAccepted={handleAccepted} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/feed"
          element={<Feed condition={(JSON.parse(localStorage.getItem('feed-admin-settings') || '{}').activeFeed || 'A')} />}
        />
        <Route path="/feed/a" element={<Feed condition="A" />} />
        <Route path="/feed/b" element={<Feed condition="B" />} />
        <Route path="/end" element={<EndTask />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;