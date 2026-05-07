import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { FarmerListingPage } from './pages/FarmerListingPage';
import { SearchPage } from './pages/SearchPage';
import { ChatPage } from './pages/ChatPage';
import { NegotiationPage } from './pages/NegotiationPage';
import './App.css';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/farmers" element={<FarmerListingPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/negotiations" element={<NegotiationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
