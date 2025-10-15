import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getClientSession, submitClientReview, getClientProgress } from '../utils/clientStorage';
import { Business } from '../types';
import BusinessCard from '../components/BusinessCard';
import ImageViewer from '../components/ImageViewer';
import CommentBox from '../components/CommentBox';
import '../styles/ReviewPage.css';

function ReviewPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reviewerName = searchParams.get('reviewer') || '';

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [sessionName, setSessionName] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [commentA, setCommentA] = useState('');
  const [commentB, setCommentB] = useState('');
  const [startTime, setStartTime] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!reviewerName) {
      navigate('/');
      return;
    }

    loadSession();
  }, []);

  const loadSession = () => {
    try {
      console.log('ReviewPage: Loading session...');
      const data = getClientSession();
      if (!data) {
        console.log('ReviewPage: No session data found, redirecting to home');
        navigate('/');
        return;
      }

      console.log('ReviewPage: Session loaded with', data.businesses.length, 'businesses');
      console.log('ReviewPage: First business:', data.businesses[0]?.name);
      console.log('ReviewPage: First image URL A:', data.businesses[0]?.image_url_a);
      
      setBusinesses(data.businesses);
      setSessionName(data.session.name);

      // Load previous progress
      const progress = getClientProgress(reviewerName);
      if (progress.length > 0 && progress.length < data.businesses.length) {
        setCurrentIndex(progress.length);
      }

      console.log('ReviewPage: Ready to display business', currentIndex + 1);
      setLoading(false);
    } catch (err) {
      console.error('ReviewPage: Error loading session:', err);
      setError(err instanceof Error ? err.message : 'Failed to load session');
      setLoading(false);
    }
  };

  const currentBusiness = businesses[currentIndex];

  const handleOptionSelect = (option: 'A' | 'B') => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption || !currentBusiness) return;

    setSubmitting(true);
    try {
      submitClientReview({
        business_id: currentBusiness.id,
        reviewer_name: reviewerName,
        selected_option: selectedOption,
        comment_a: commentA.trim() || undefined,
        comment_b: commentB.trim() || undefined,
        time_spent_ms: Date.now() - startTime,
      });

      // Move to next or finish
      if (currentIndex < businesses.length - 1) {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setSelectedOption(null);
        setCommentA('');
        setCommentB('');
        setStartTime(Date.now());
      } else {
        // All done - go to analytics
        navigate(`/analytics/${sessionId}`);
      }
    } catch (err) {
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedOption(null);
      setCommentA('');
      setCommentB('');
      setStartTime(Date.now());
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'a' || e.key === 'A') {
        handleOptionSelect('A');
      } else if (e.key === 'b' || e.key === 'B') {
        handleOptionSelect('B');
      } else if (e.key === 'ArrowRight' && selectedOption) {
        handleSubmit();
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedOption, currentIndex, currentBusiness]);

  if (loading) {
    return (
      <div className="review-page">
        <div className="loading">Loading session...</div>
      </div>
    );
  }

  if (error || !currentBusiness) {
    return (
      <div className="review-page">
        <div className="error">{error || 'Session not found'}</div>
        <button onClick={() => navigate('/')} className="btn-secondary">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="review-page">
      <div className="header">
        <div>
          <h1>Getty Blind Test</h1>
          <p className="session-info">
            Session: <strong>{sessionName}</strong> | Reviewer: <strong>{reviewerName}</strong>
          </p>
        </div>
        <button
          onClick={() => navigate(`/analytics/${sessionId}`)}
          className="view-analytics-btn"
        >
          View Analytics
        </button>
      </div>

      <div className="review-container">
        <BusinessCard business={currentBusiness} />

        <div className="images-container">
          <div className="image-option">
            <div className="option-label">Option A</div>
            <ImageViewer
              imageUrl={currentBusiness.image_url_a}
              alt="Option A"
              selected={selectedOption === 'A'}
              onSelect={() => handleOptionSelect('A')}
            />
            <CommentBox
              value={commentA}
              onChange={setCommentA}
              placeholder="Add any notes about Option A..."
            />
          </div>

          <div className="image-option">
            <div className="option-label">Option B</div>
            <ImageViewer
              imageUrl={currentBusiness.image_url_b}
              alt="Option B"
              selected={selectedOption === 'B'}
              onSelect={() => handleOptionSelect('B')}
            />
            <CommentBox
              value={commentB}
              onChange={setCommentB}
              placeholder="Add any notes about Option B..."
            />
          </div>
        </div>

        <div className="controls">
          <button
            className="btn-secondary"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            ← Previous
          </button>

          <div className="counter">
            <span className="current">{currentIndex + 1}</span> of{' '}
            <span className="total">{businesses.length}</span>
          </div>

          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={!selectedOption || submitting}
          >
            {submitting
              ? 'Submitting...'
              : currentIndex === businesses.length - 1
              ? 'Submit and Finish'
              : 'Submit and Next →'}
          </button>
        </div>

        <div className="keyboard-hints">
          Press <kbd>A</kbd> or <kbd>B</kbd> to select | <kbd>←</kbd> Previous | <kbd>→</kbd> Next
        </div>
      </div>
    </div>
  );
}

export default ReviewPage;
