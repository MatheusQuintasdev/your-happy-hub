export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  free_diagnostics_left: number;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan_name: string;
  status: 'active' | 'canceled' | 'past_due' | 'inactive';
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface Diagnostic {
  id: string;
  user_id: string;
  company_name: string;
  website_url: string | null;
  industry: string | null;
  responses: any;
  score: number;
  category_scores: any;
  ai_recommendations: any;
  created_at: string;
}

export interface Recommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimated_time: string;
  impact: 'Low' | 'Medium' | 'High' | 'Very High';
  action_plan_week: number;
}
