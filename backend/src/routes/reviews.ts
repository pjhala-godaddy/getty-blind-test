import { Router, Request, Response } from 'express';
import db from '../db/connection';
import { CreateReviewRequest, Review } from '../types';
import { randomBytes } from 'crypto';

const router = Router();

function generateId(): string {
  return randomBytes(16).toString('hex');
}

// Submit a review
router.post('/', async (req: Request, res: Response) => {
  const { business_id, reviewer_name, selected_option, comment_a, comment_b, time_spent_ms }: CreateReviewRequest = req.body;

  if (!business_id || !reviewer_name || !selected_option) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (selected_option !== 'A' && selected_option !== 'B') {
    return res.status(400).json({ error: 'Invalid selected_option. Must be A or B' });
  }

  try {
    // Check if review already exists
    const existing = db.prepare(
      'SELECT id FROM reviews WHERE business_id = ? AND reviewer_name = ?'
    ).get(business_id, reviewer_name) as any;

    if (existing) {
      // Update existing review
      db.prepare(
        `UPDATE reviews SET 
         selected_option = ?,
         comment_a = ?,
         comment_b = ?,
         time_spent_ms = ?,
         created_at = datetime('now')
         WHERE id = ?`
      ).run(selected_option, comment_a || null, comment_b || null, time_spent_ms || 0, existing.id);

      const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(existing.id);
      res.status(201).json(review);
    } else {
      // Insert new review
      const reviewId = generateId();
      db.prepare(
        `INSERT INTO reviews (id, business_id, reviewer_name, selected_option, comment_a, comment_b, time_spent_ms)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).run(reviewId, business_id, reviewer_name, selected_option, comment_a || null, comment_b || null, time_spent_ms || 0);

      const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(reviewId);
      res.status(201).json(review);
    }
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Get all reviews for a session
router.get('/session/:sessionId', async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  try {
    const reviews = db.prepare(
      `SELECT r.* FROM reviews r
       JOIN businesses b ON r.business_id = b.id
       WHERE b.session_id = ?
       ORDER BY r.created_at DESC`
    ).all(sessionId);

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Get reviews for a specific business
router.get('/business/:businessId', async (req: Request, res: Response) => {
  const { businessId } = req.params;

  try {
    const reviews = db.prepare(
      'SELECT * FROM reviews WHERE business_id = ? ORDER BY created_at DESC'
    ).all(businessId);

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Get reviewer's progress for a session
router.get('/progress/:sessionId/:reviewerName', async (req: Request, res: Response) => {
  const { sessionId, reviewerName } = req.params;

  try {
    const reviews = db.prepare(
      `SELECT r.* FROM reviews r
       JOIN businesses b ON r.business_id = b.id
       WHERE b.session_id = ? AND r.reviewer_name = ?
       ORDER BY b.order_index`
    ).all(sessionId, reviewerName);

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

export default router;
