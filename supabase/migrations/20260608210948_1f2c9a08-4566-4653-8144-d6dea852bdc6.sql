-- Ensure profiles table has correct RLS and non-escalatable roles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing broad management policies
DROP POLICY IF EXISTS "Users can manage own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage their own profiles" ON public.profiles;

-- Create restrictive policies: Users can only view their own profile
DROP POLICY IF EXISTS "Users can view own profiles" ON public.profiles;
CREATE POLICY "Users can view own profiles" ON public.profiles FOR SELECT USING (auth.uid() = id);

-- Users can update only specific non-sensitive fields of their own profile
DROP POLICY IF EXISTS "Users can update own profiles" ON public.profiles;
CREATE POLICY "Users can update own profiles" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Trigger was already created in previous steps, but let's ensure it covers all bases
-- Re-defining the protection trigger to be very explicit about blocking 'role' or 'admin' escalations
CREATE OR REPLACE FUNCTION public.handle_profile_security_v2()
RETURNS TRIGGER AS $$
BEGIN
    -- Prevent unauthorized role changes
    IF (TG_OP = 'UPDATE') THEN
        -- If 'role' column exists, protect it
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
            IF (OLD.role IS DISTINCT FROM NEW.role AND auth.role() <> 'service_role') THEN
                NEW.role = OLD.role;
            END IF;
        END IF;
        
        -- Prevent users from modifying their own 'is_admin' or similar if they exist
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_admin') THEN
            IF (OLD.is_admin IS DISTINCT FROM NEW.is_admin AND auth.role() <> 'service_role') THEN
                NEW.is_admin = OLD.is_admin;
            END IF;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS tr_handle_profile_security_v2 ON public.profiles;
CREATE TRIGGER tr_handle_profile_security_v2
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_profile_security_v2();
