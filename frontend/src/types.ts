export interface TestSession {
  id: string;
  name: string;
  created_at: string;
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
  created_at: string;
}

export interface ParsedBusinessData {
  name: string;
  description: string;
  industry: string;
  content_style: string;
  writing_style: string;
  image_url_a: string;
  image_url_b: string;
}

export interface SessionData {
  session: TestSession;
  businesses: Business[];
}

export interface AnalyticsData {
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

