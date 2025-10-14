// Client-side storage (replaces backend API)
import { Business, Review } from '../types';

const STORAGE_KEY = 'getty_blind_test_data';

interface StoredData {
  session: {
    id: string;
    name: string;
    created_at: string;
    created_by: string;
  };
  businesses: Business[];
  reviews: Review[];
}

export function createClientSession(name: string, createdBy: string, businesses: any[]) {
  const sessionId = generateId();
  const mappedBusinesses: Business[] = businesses.map((b, index) => ({
    id: generateId(),
    session_id: sessionId,
    name: b.name,
    description: b.description,
    industry: b.industry,
    content_style: b.content_style,
    writing_style: b.writing_style,
    image_url_a: b.image_url_a,
    image_url_b: b.image_url_b,
    order_index: index,
  }));

  const data: StoredData = {
    session: {
      id: sessionId,
      name,
      created_at: new Date().toISOString(),
      created_by: createdBy,
    },
    businesses: mappedBusinesses,
    reviews: [],
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return { session: data.session, businesses_count: mappedBusinesses.length };
}

export function getClientSession() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  
  const data: StoredData = JSON.parse(stored);
  return {
    session: data.session,
    businesses: data.businesses,
  };
}

export function submitClientReview(review: {
  business_id: string;
  reviewer_name: string;
  selected_option: 'A' | 'B';
  comment_a?: string;
  comment_b?: string;
  time_spent_ms: number;
}) {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) throw new Error('No session found');
  
  const data: StoredData = JSON.parse(stored);
  
  // Remove existing review from this reviewer for this business
  data.reviews = data.reviews.filter(
    r => !(r.business_id === review.business_id && r.reviewer_name === review.reviewer_name)
  );
  
  // Add new review
  const newReview: Review = {
    id: generateId(),
    business_id: review.business_id,
    reviewer_name: review.reviewer_name,
    selected_option: review.selected_option,
    comment_a: review.comment_a || null,
    comment_b: review.comment_b || null,
    time_spent_ms: review.time_spent_ms,
    created_at: new Date().toISOString(),
  };
  
  data.reviews.push(newReview);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  
  return newReview;
}

export function getClientProgress(reviewerName: string) {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  const data: StoredData = JSON.parse(stored);
  return data.reviews.filter(r => r.reviewer_name === reviewerName);
}

export function getClientAnalytics() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) throw new Error('No session found');
  
  const data: StoredData = JSON.parse(stored);
  const { session, businesses, reviews } = data;

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
      comments_b: commentsB,
    };
  });

  // Calculate reviewer stats
  const reviewerStats = uniqueReviewers.map(reviewer => ({
    reviewer_name: reviewer,
    reviews_count: reviews.filter(r => r.reviewer_name === reviewer).length,
  }));

  return {
    session,
    total_businesses: businesses.length,
    total_reviews: totalReviews,
    unique_reviewers: uniqueReviewers.length,
    overall_preference: {
      option_a: optionACount,
      option_b: optionBCount,
      option_a_percentage: totalReviews > 0 ? (optionACount / totalReviews) * 100 : 0,
      option_b_percentage: totalReviews > 0 ? (optionBCount / totalReviews) * 100 : 0,
    },
    business_results: businessResults,
    reviewer_stats: reviewerStats,
  };
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

