import { Router, Request, Response } from 'express';
import db from '../db/connection';
import { CreateSessionRequest, TestSession, Business } from '../types';
import { randomBytes } from 'crypto';

const router = Router();

function generateId(): string {
  return randomBytes(16).toString('hex');
}

// Create new test session with businesses
router.post('/', async (req: Request, res: Response) => {
  const { name, created_by, businesses }: CreateSessionRequest = req.body;

  if (!name || !created_by || !businesses || businesses.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const sessionId = generateId();
    
    // Insert session
    const insertSession = db.prepare(
      'INSERT INTO test_sessions (id, name, created_by) VALUES (?, ?, ?)'
    );
    insertSession.run(sessionId, name, created_by);

    // Insert businesses
    const insertBusiness = db.prepare(
      `INSERT INTO businesses 
      (id, session_id, name, description, industry, content_style, writing_style, image_url_a, image_url_b, order_index) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    businesses.forEach((business, index) => {
      insertBusiness.run(
        generateId(),
        sessionId,
        business.name,
        business.description || null,
        business.industry || null,
        business.content_style || null,
        business.writing_style || null,
        business.image_url_a,
        business.image_url_b,
        index
      );
    });

    const session = db.prepare('SELECT * FROM test_sessions WHERE id = ?').get(sessionId);
    res.status(201).json({ session, businesses_count: businesses.length });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Get session with all businesses
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const session = db.prepare('SELECT * FROM test_sessions WHERE id = ?').get(id);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const businesses = db.prepare(
      'SELECT * FROM businesses WHERE session_id = ? ORDER BY order_index'
    ).all(id);

    res.json({ session, businesses });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// Get all sessions
router.get('/', async (req: Request, res: Response) => {
  try {
    const sessions = db.prepare(
      'SELECT * FROM test_sessions ORDER BY created_at DESC'
    ).all();
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

export default router;
