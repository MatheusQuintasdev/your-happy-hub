-- 1. AI Insights Table (Stores generated recommendations, plans, etc.)
CREATE TABLE IF NOT EXISTS public.ai_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diagnostic_id UUID NOT NULL REFERENCES public.diagnostics(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    growth_plan JSONB, -- Stores the 30-day plan
    lost_opportunities JSONB, -- Stores problem/impact/solution cards
    priorities JSONB, -- Stores ranked actions
    simulations JSONB, -- Stores current vs projected score
    content_suggestions JSONB, -- Stores social media posts, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Smart Tasks (Recommendations converted to trackable tasks)
CREATE TABLE IF NOT EXISTS public.user_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    diagnostic_id UUID REFERENCES public.diagnostics(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    difficulty TEXT,
    impact TEXT,
    estimated_time TEXT,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. AI Consultant Chat (Contextual messages)
CREATE TABLE IF NOT EXISTS public.ai_consultant_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Retention Reports (Weekly reports)
CREATE TABLE IF NOT EXISTS public.weekly_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    summary JSONB, -- What improved, what worsened, next actions
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Grants
GRANT ALL ON public.ai_insights TO authenticated;
GRANT ALL ON public.user_tasks TO authenticated;
GRANT ALL ON public.ai_consultant_messages TO authenticated;
GRANT ALL ON public.weekly_reports TO authenticated;

GRANT ALL ON public.ai_insights TO service_role;
GRANT ALL ON public.user_tasks TO service_role;
GRANT ALL ON public.ai_consultant_messages TO service_role;
GRANT ALL ON public.weekly_reports TO service_role;

-- RLS
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_consultant_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own insights" ON public.ai_insights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own tasks" ON public.user_tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own messages" ON public.ai_consultant_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own messages" ON public.ai_consultant_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own reports" ON public.weekly_reports FOR SELECT USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ai_insights_updated_at BEFORE UPDATE ON public.ai_insights FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_tasks_updated_at BEFORE UPDATE ON public.user_tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
