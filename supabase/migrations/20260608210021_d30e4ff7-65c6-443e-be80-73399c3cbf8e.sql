-- 1. Fix: Function Search Path Mutable
-- Set secure search_path for common utility functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Fix: Write Protection for Subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can manage own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can manage their own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- 3. Fix: Write Protection for AI Insights
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own insights" ON public.ai_insights;
DROP POLICY IF EXISTS "Users can manage own insights" ON public.ai_insights;
DROP POLICY IF EXISTS "Users can view own insights" ON public.ai_insights;
DROP POLICY IF EXISTS "Users can view their own insights" ON public.ai_insights;
CREATE POLICY "Users can view own insights" ON public.ai_insights FOR SELECT USING (auth.uid() = user_id);

-- 4. Fix: Write Protection for Reports and Weekly Reports
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'reports') THEN
        ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Users can manage own reports" ON public.reports;
        DROP POLICY IF EXISTS "Users can view own reports" ON public.reports;
        CREATE POLICY "Users can view own reports" ON public.reports FOR SELECT USING (auth.uid() = user_id);
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'weekly_reports') THEN
        ALTER TABLE public.weekly_reports ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Users can manage own weekly reports" ON public.weekly_reports;
        DROP POLICY IF EXISTS "Users can view own weekly reports" ON public.weekly_reports;
        CREATE POLICY "Users can view own weekly reports" ON public.weekly_reports FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;

-- 5. Fix: Privilege Escalation Prevention
-- Ensure 'role' updates on profiles are only allowed by service_role
CREATE OR REPLACE FUNCTION public.handle_profile_security()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        -- Revert role changes if not from service_role
        IF (OLD.role IS DISTINCT FROM NEW.role AND auth.role() <> 'service_role') THEN
            NEW.role = OLD.role;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
        DROP TRIGGER IF EXISTS tr_handle_profile_security ON public.profiles;
        CREATE TRIGGER tr_handle_profile_security
        BEFORE UPDATE ON public.profiles
        FOR EACH ROW EXECUTE FUNCTION public.handle_profile_security();
    END IF;
END $$;

-- 6. Ensure service_role maintains full access for Edge Functions
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;
