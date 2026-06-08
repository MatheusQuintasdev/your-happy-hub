-- Grant access to diagnostics table
GRANT SELECT, INSERT, UPDATE, DELETE ON public.diagnostics TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.diagnostics TO service_role;

-- Grant access to AI insights table
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_insights TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_insights TO service_role;

-- Grant access to user tasks table
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_tasks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_tasks TO service_role;

-- Ensure RLS is enabled but policies allow authenticated users
ALTER TABLE public.diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tasks ENABLE ROW LEVEL SECURITY;

-- If policies don't exist, create them (using DO block to avoid errors if they exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'diagnostics' AND policyname = 'Users can manage their own diagnostics') THEN
        CREATE POLICY "Users can manage their own diagnostics" ON public.diagnostics FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_insights' AND policyname = 'Users can manage their own insights') THEN
        CREATE POLICY "Users can manage their own insights" ON public.ai_insights FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_tasks' AND policyname = 'Users can manage their own tasks') THEN
        CREATE POLICY "Users can manage their own tasks" ON public.user_tasks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;
