import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import LinkForm from './pages/LinkForm';
import SmartLinkPage from './pages/SmartLinkPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<LinkForm />} />
            <Route path="/edit/:slug" element={<LinkForm />} />
            <Route path="/:slug" element={<SmartLinkPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

