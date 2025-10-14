import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnalytics } from '../utils/api';
import { exportToCSV } from '../utils/excelParser';
import { AnalyticsData } from '../types';
import PreferenceChart from '../components/PreferenceChart';
import '../styles/AnalyticsPage.css';

function AnalyticsPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      navigate('/');
      return;
    }
    loadAnalytics();
  }, [sessionId]);

  const loadAnalytics = async () => {
    try {
      const data = await getAnalytics(sessionId!);
      setAnalytics(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!analytics) return;

    const exportData = analytics.business_results.flatMap((result) => {
      const reviews = [];
      for (let i = 0; i < Math.max(result.option_a_count, result.option_b_count); i++) {
        reviews.push({
          'Business Name': result.business.name,
          'Industry': result.business.industry,
          'Content Style': result.business.content_style,
          'Writing Style': result.business.writing_style,
          'Option A Votes': result.option_a_count,
          'Option B Votes': result.option_b_count,
          'Total Reviews': result.reviews_count,
          'Comment A': result.comments_a[i] || '',
          'Comment B': result.comments_b[i] || '',
        });
      }
      return reviews;
    });

    exportToCSV(exportData, `analytics-${analytics.session.name}-${Date.now()}.csv`);
  };

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="loading">Loading analytics...</div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="analytics-page">
        <div className="error">{error || 'Analytics not found'}</div>
        <button onClick={() => navigate('/')} className="btn-secondary">
          Back to Home
        </button>
      </div>
    );
  }

  const allCommentsA = analytics.business_results.flatMap(r => r.comments_a);
  const allCommentsB = analytics.business_results.flatMap(r => r.comments_b);

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div>
          <h1>Analytics Dashboard</h1>
          <p className="session-name">{analytics.session.name}</p>
        </div>
        <div className="header-actions">
          <button
            onClick={() => navigate(`/review/${sessionId}`)}
            className="btn-secondary"
          >
            Back to Review
          </button>
          <button onClick={handleExport} className="btn-primary">
            Export Results (CSV)
          </button>
        </div>
      </div>

      <div className="analytics-container">
        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-value">{analytics.total_businesses}</div>
            <div className="summary-label">Total Businesses</div>
          </div>
          <div className="summary-card">
            <div className="summary-value">{analytics.total_reviews}</div>
            <div className="summary-label">Total Reviews</div>
          </div>
          <div className="summary-card">
            <div className="summary-value">{analytics.unique_reviewers}</div>
            <div className="summary-label">Unique Reviewers</div>
          </div>
        </div>

        {/* Overall Preference */}
        <div className="card">
          <h2>Overall Preference</h2>
          <PreferenceChart
            optionACount={analytics.overall_preference.option_a}
            optionBCount={analytics.overall_preference.option_b}
            optionAPercentage={analytics.overall_preference.option_a_percentage}
            optionBPercentage={analytics.overall_preference.option_b_percentage}
          />
        </div>

        {/* Reviewer Stats */}
        {analytics.reviewer_stats.length > 0 && (
          <div className="card">
            <h2>Reviewer Participation</h2>
            <div className="reviewer-stats">
              {analytics.reviewer_stats.map((stat) => (
                <div key={stat.reviewer_name} className="reviewer-stat">
                  <span className="reviewer-name">{stat.reviewer_name}</span>
                  <span className="reviewer-count">
                    {stat.reviews_count} / {analytics.total_businesses} reviews
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Per-Business Results */}
        <div className="card">
          <h2>Results by Business</h2>
          <div className="business-results-table">
            <table>
              <thead>
                <tr>
                  <th>Business Name</th>
                  <th>Reviews</th>
                  <th>Option A</th>
                  <th>Option B</th>
                  <th>Winner</th>
                </tr>
              </thead>
              <tbody>
                {analytics.business_results.map((result) => {
                  const winner =
                    result.option_a_count > result.option_b_count
                      ? 'A'
                      : result.option_b_count > result.option_a_count
                      ? 'B'
                      : 'Tie';
                  return (
                    <tr key={result.business.id}>
                      <td className="business-name-cell">{result.business.name}</td>
                      <td>{result.reviews_count}</td>
                      <td className="vote-count">{result.option_a_count}</td>
                      <td className="vote-count">{result.option_b_count}</td>
                      <td className={`winner-cell winner-${winner.toLowerCase()}`}>
                        {winner}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Comment Analysis */}
        <div className="card">
          <h2>Comment Analysis</h2>
          <p className="comment-intro">
            All comments grouped by option for theme identification
          </p>
          <div className="comments-comparison">
            <div className="comments-column">
              <h3>Option A Comments ({allCommentsA.length})</h3>
              <div className="comments-list">
                {allCommentsA.length > 0 ? (
                  allCommentsA.map((comment, idx) => (
                    <div key={idx} className="comment-item">
                      {comment}
                    </div>
                  ))
                ) : (
                  <div className="no-comments">No comments for Option A</div>
                )}
              </div>
            </div>

            <div className="comments-column">
              <h3>Option B Comments ({allCommentsB.length})</h3>
              <div className="comments-list">
                {allCommentsB.length > 0 ? (
                  allCommentsB.map((comment, idx) => (
                    <div key={idx} className="comment-item">
                      {comment}
                    </div>
                  ))
                ) : (
                  <div className="no-comments">No comments for Option B</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;

