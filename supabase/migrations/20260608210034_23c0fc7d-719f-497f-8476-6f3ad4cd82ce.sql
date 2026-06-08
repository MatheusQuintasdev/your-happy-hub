-- Revoke default EXECUTE privileges from public and authenticated roles for internal SECURITY DEFINER functions
-- This addresses linter warnings 0028 and 0029.

REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon;

REVOKE EXECUTE ON FUNCTION public.handle_profile_security() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_profile_security() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_profile_security() FROM anon;

-- Ensure service_role and postgres (system) can still execute them
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO service_role;
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO postgres;

GRANT EXECUTE ON FUNCTION public.handle_profile_security() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_profile_security() TO postgres;
