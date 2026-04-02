import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Feed from './Feed';
import EndTask from './EndTask';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/feed/a" element={<Feed condition="A" />} />
        <Route path="/feed/b" element={<Feed condition="B" />} />
        <Route path="/end" element={<EndTask />} />
      </Routes>
    </Router>
  );
}

export default App;
