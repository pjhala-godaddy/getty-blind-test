import { Router, Request, Response } from 'express';
import db from '../db/connection';
import { AnalyticsResponse, TestSession, Business, Review } from '../types';

const router = Router();

// Get comprehensive analytics for a session
router.get('/:sessionId', async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  try {
    // Get session
    const session = db.prepare('SELECT * FROM test_sessions WHERE id = ?').get(sessionId) as TestSession | undefined;

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Get all businesses for this session
    const businesses = db.prepare(
      'SELECT * FROM businesses WHERE session_id = ? ORDER BY order_index'
    ).all(sessionId) as Business[];

    // Get all reviews for this session
    const reviews = db.prepare(
      `SELECT r.* FROM reviews r
       JOIN businesses b ON r.business_id = b.id
       WHERE b.session_id = ?`
    ).all(sessionId) as Review[];

    // Calculate overall preferences
    const optionACount = reviews.filter(r => r.selected_option === 'A').length;
    const optionBCount = reviews.filter(r => r.selected_option === 'B').length;
    const totalReviews = reviews.length;

    // Get unique reviewers
    const uniqueReviewers = [...new Set(reviews.map(r => r.reviewer_name))];

    // Calculate per-business results
    const businessResults = businesses.map(business => {
      const businessReviews = reviews.filter(r => r.business_id === business.id);
      const aCount = businessReviews.filter(r => r.selected_option === 'A').length;
      const bCount = businessReviews.filter(r => r.selected_option === 'B').length;
      
      const commentsA = businessReviews
        .filter(r => r.comment_a)
        .map(r => r.comment_a as string);
      
      const commentsB = businessReviews
        .filter(r => r.comment_b)
        .map(r => r.comment_b as string);

      return {
        business,
        reviews_count: businessReviews.length,
        option_a_count: aCount,
        option_b_count: bCount,
        comments_a: commentsA,
        comments_b: commentsB
      };
    });

    // Calculate reviewer stats
    const reviewerStats = uniqueReviewers.map(reviewer => ({
      reviewer_name: reviewer,
      reviews_count: reviews.filter(r => r.reviewer_name === reviewer).length
    }));

    const analytics: AnalyticsResponse = {
      session,
      total_businesses: businesses.length,
      total_reviews: totalReviews,
      unique_reviewers: uniqueReviewers.length,
      overall_preference: {
        option_a: optionACount,
        option_b: optionBCount,
        option_a_percentage: totalReviews > 0 ? (optionACount / totalReviews) * 100 : 0,
        option_b_percentage: totalReviews > 0 ? (optionBCount / totalReviews) * 100 : 0
      },
      business_results: businessResults,
      reviewer_stats: reviewerStats
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error generating analytics:', error);
    res.status(500).json({ error: 'Failed to generate analytics' });
  }
});

export default router;
