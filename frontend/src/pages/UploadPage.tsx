import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClientSession } from '../utils/clientStorage';
import { getReviewerName, saveReviewerName } from '../utils/localStorage';
import REAL_DATA from '../data/businesses.json';
import '../styles/UploadPage.css';

function UploadPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewerName, setReviewerName] = useState(getReviewerName() || '');
  const navigate = useNavigate();

  const handleStartReview = () => {
    if (!reviewerName.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      saveReviewerName(reviewerName);
      const result = createClientSession(
        `WSBA Prompt Testing - ${REAL_DATA.length} Businesses`, 
        reviewerName, 
        REAL_DATA
      );
      
      navigate(`/review/${result.session.id}?reviewer=${encodeURIComponent(reviewerName)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <h1>Getty Blind Test</h1>
        <p className="subtitle">
          Compare AI-generated website designs from different prompts
        </p>

        <div className="info-card">
          <h3>Test Overview</h3>
          <ul>
            <li><strong>{REAL_DATA.length} businesses</strong> to review</li>
            <li>Two website designs per business (Option A vs B)</li>
            <li>Add comments on what works/doesn't work</li>
            <li>Keyboard shortcuts: A/B to select, arrows to navigate</li>
            <li><strong>All data saved in your browser</strong> (no server needed)</li>
          </ul>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label htmlFor="reviewer-name">Your Name</label>
            <input
              id="reviewer-name"
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Enter your name"
              className="text-input"
              disabled={loading}
              onKeyPress={(e) => e.key === 'Enter' && handleStartReview()}
            />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          className="start-btn"
          onClick={handleStartReview}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Start Reviewing'}
        </button>

        <p className="help-text">
          Your progress will be saved in your browser
        </p>
      </div>
    </div>
  );
}

export default UploadPage;
