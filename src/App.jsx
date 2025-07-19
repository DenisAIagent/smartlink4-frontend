import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateLinkPage from './pages/CreateLinkPage';
import DashboardPage from './pages/DashboardPage';
import SmartLinkPage from './pages/SmartLinkPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateLinkPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/:slug" element={<SmartLinkPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

