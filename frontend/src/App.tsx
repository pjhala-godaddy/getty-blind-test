import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import ReviewPage from './pages/ReviewPage';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  // Use basename only in production (GitHub Pages)
  const basename = process.env.NODE_ENV === 'production' ? '/getty-blind-test' : '';
  
  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/review/:sessionId" element={<ReviewPage />} />
        <Route path="/analytics/:sessionId" element={<AnalyticsPage />} />
      </Routes>
    </Router>
  );
}

export default App;

