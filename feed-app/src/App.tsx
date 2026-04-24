import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Feed from './Feed';
import EndTask from './EndTask';
import Admin from './Admin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/feed" element={<Feed condition={(JSON.parse(localStorage.getItem('feed-admin-settings') || '{}').activeFeed || 'A')} />} />
        <Route path="/feed/a" element={<Feed condition="A" />} />
        <Route path="/feed/b" element={<Feed condition="B" />} />
        <Route path="/end" element={<EndTask />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
