-- Revoke execution from public/authenticated users for the new security function
REVOKE EXECUTE ON FUNCTION public.handle_profile_security_v2() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_profile_security_v2() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_profile_security_v2() FROM anon;

-- Grant execution only to system/service_role
GRANT EXECUTE ON FUNCTION public.handle_profile_security_v2() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_profile_security_v2() TO postgres;
