export interface TestSession {
  id: string;
  name: string;
  created_at: Date;
  created_by: string;
}

export interface Business {
  id: string;
  session_id: string;
  name: string;
  description: string;
  industry: string;
  content_style: string;
  writing_style: string;
  image_url_a: string;
  image_url_b: string;
  order_index: number;
}

export interface Review {
  id: string;
  business_id: string;
  reviewer_name: string;
  selected_option: 'A' | 'B';
  comment_a: string | null;
  comment_b: string | null;
  time_spent_ms: number;
  created_at: Date;
}

export interface CreateSessionRequest {
  name: string;
  created_by: string;
  businesses: Omit<Business, 'id' | 'session_id' | 'order_index'>[];
}

export interface CreateReviewRequest {
  business_id: string;
  reviewer_name: string;
  selected_option: 'A' | 'B';
  comment_a?: string;
  comment_b?: string;
  time_spent_ms: number;
}

export interface AnalyticsResponse {
  session: TestSession;
  total_businesses: number;
  total_reviews: number;
  unique_reviewers: number;
  overall_preference: {
    option_a: number;
    option_b: number;
    option_a_percentage: number;
    option_b_percentage: number;
  };
  business_results: {
    business: Business;
    reviews_count: number;
    option_a_count: number;
    option_b_count: number;
    comments_a: string[];
    comments_b: string[];
  }[];
  reviewer_stats: {
    reviewer_name: string;
    reviews_count: number;
  }[];
}

