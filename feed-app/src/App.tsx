import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Feed from './Feed';
import EndTask from './EndTask';
import Admin from './Admin';
import RequireConsent from './RequireConsent';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RequireConsent forceRequire={true}><Landing /></RequireConsent>} />
        <Route
          path="/feed"
          element={
            <RequireConsent>
              <Feed condition={(JSON.parse(localStorage.getItem('feed-admin-settings') || '{}').activeFeed || 'A')} />
            </RequireConsent>
          }
        />
        <Route path="/feed/a" element={<RequireConsent><Feed condition="A" /></RequireConsent>} />
        <Route path="/feed/b" element={<RequireConsent><Feed condition="B" /></RequireConsent>} />
        <Route path="/end" element={<EndTask />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;