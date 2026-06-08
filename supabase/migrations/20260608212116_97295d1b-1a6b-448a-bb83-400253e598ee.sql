-- 1. Recommendations Library: Ensure even shared content is restricted to session-based access
DROP POLICY IF EXISTS "Shared recommendations are viewable by authenticated users" ON public.recommendations_library;
CREATE POLICY "sec_rec_sel" ON public.recommendations_library FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);

-- 2. Final security check: Ensure all tables have TO authenticated on their user-facing policies
-- This prevents accidental 'public' exposure.

-- Diagnostics
DROP POLICY IF EXISTS "d1_sel" ON public.diagnostics;
DROP POLICY IF EXISTS "d1_ins" ON public.diagnostics;
CREATE POLICY "sec_diag_sel" ON public.diagnostics FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "sec_diag_ins" ON public.diagnostics FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Profiles
DROP POLICY IF EXISTS "p1_sel" ON public.profiles;
DROP POLICY IF EXISTS "p1_upd" ON public.profiles;
CREATE POLICY "sec_prof_sel" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "sec_prof_upd" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Tasks
DROP POLICY IF EXISTS "t1_all" ON public.user_tasks;
CREATE POLICY "sec_task_all" ON public.user_tasks FOR ALL TO authenticated USING (auth.uid() = user_id);

-- AI Insights
DROP POLICY IF EXISTS "i1_sel" ON public.ai_insights;
CREATE POLICY "sec_ins_sel" ON public.ai_insights FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- AI Messages
DROP POLICY IF EXISTS "m1_sel" ON public.ai_consultant_messages;
DROP POLICY IF EXISTS "m1_ins" ON public.ai_consultant_messages;
CREATE POLICY "sec_msg_sel" ON public.ai_consultant_messages FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "sec_msg_ins" ON public.ai_consultant_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Subscriptions and Reports
DROP POLICY IF EXISTS "s1_sel" ON public.subscriptions;
DROP POLICY IF EXISTS "w1_sel" ON public.weekly_reports;
DROP POLICY IF EXISTS "r1_sel" ON public.reports;
CREATE POLICY "sec_sub_sel" ON public.subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "sec_wrep_sel" ON public.weekly_reports FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "sec_rep_sel" ON public.reports FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Ensure service_role has access to everything for the backend to function
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;
