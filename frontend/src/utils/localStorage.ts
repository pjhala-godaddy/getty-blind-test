interface ReviewState {
  businessId: string;
  selectedOption?: 'A' | 'B';
  commentA?: string;
  commentB?: string;
  startTime: number;
}

export function saveReviewState(
  sessionId: string,
  reviewerName: string,
  currentIndex: number,
  state: ReviewState
) {
  const key = `review_${sessionId}_${reviewerName}`;
  const data = {
    currentIndex,
    state,
    lastUpdated: Date.now(),
  };
  localStorage.setItem(key, JSON.stringify(data));
}

export function getReviewState(sessionId: string, reviewerName: string) {
  const key = `review_${sessionId}_${reviewerName}`;
  const stored = localStorage.getItem(key);
  if (stored) {
    return JSON.parse(stored);
  }
  return null;
}

export function clearReviewState(sessionId: string, reviewerName: string) {
  const key = `review_${sessionId}_${reviewerName}`;
  localStorage.removeItem(key);
}

export function saveReviewerName(name: string) {
  localStorage.setItem('reviewer_name', name);
}

export function getReviewerName(): string | null {
  return localStorage.getItem('reviewer_name');
}

