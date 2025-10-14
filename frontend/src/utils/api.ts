import { TestSession, Business, Review, ParsedBusinessData, SessionData, AnalyticsData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export async function createSession(
  name: string,
  createdBy: string,
  businesses: ParsedBusinessData[]
): Promise<{ session: TestSession; businesses_count: number }> {
  const response = await fetch(`${API_BASE_URL}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, created_by: createdBy, businesses }),
  });

  if (!response.ok) {
    throw new Error('Failed to create session');
  }

  return response.json();
}

export async function getSession(sessionId: string): Promise<SessionData> {
  const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch session');
  }

  return response.json();
}

export async function submitReview(review: {
  business_id: string;
  reviewer_name: string;
  selected_option: 'A' | 'B';
  comment_a?: string;
  comment_b?: string;
  time_spent_ms: number;
}): Promise<Review> {
  const response = await fetch(`${API_BASE_URL}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review),
  });

  if (!response.ok) {
    throw new Error('Failed to submit review');
  }

  return response.json();
}

export async function getReviewerProgress(
  sessionId: string,
  reviewerName: string
): Promise<Review[]> {
  const response = await fetch(
    `${API_BASE_URL}/reviews/progress/${sessionId}/${encodeURIComponent(reviewerName)}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch progress');
  }

  return response.json();
}

export async function getAnalytics(sessionId: string): Promise<AnalyticsData> {
  const response = await fetch(`${API_BASE_URL}/analytics/${sessionId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch analytics');
  }

  return response.json();
}

