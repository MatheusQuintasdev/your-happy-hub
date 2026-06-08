-- 2. Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    status TEXT, -- 'active', 'trialing', 'past_due', 'canceled', 'unpaid'
    plan_id TEXT,
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

GRANT SELECT, INSERT, UPDATE ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own subscription') THEN
        CREATE POLICY "Users can view own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;

-- 3. Diagnostics Table
CREATE TABLE IF NOT EXISTS public.diagnostics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    business_name TEXT NOT NULL,
    category_scores JSONB NOT NULL, -- { google: 80, instagram: 50, website: 30, ... }
    overall_score INTEGER NOT NULL,
    status TEXT NOT NULL, -- 'Crítico', 'Precisa Melhorar', 'Bom', 'Excelente'
    answers JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

GRANT SELECT, INSERT ON public.diagnostics TO authenticated;
GRANT ALL ON public.diagnostics TO service_role;

ALTER TABLE public.diagnostics ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own diagnostics') THEN
        CREATE POLICY "Users can view own diagnostics" ON public.diagnostics FOR SELECT USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create own diagnostics') THEN
        CREATE POLICY "Users can create own diagnostics" ON public.diagnostics FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;
