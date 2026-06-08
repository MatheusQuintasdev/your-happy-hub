CREATE OR REPLACE FUNCTION public.protect_profile_sensitive_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (auth.role() <> 'service_role') THEN
    -- Prevent privilege escalation
    IF (NEW.is_admin IS DISTINCT FROM OLD.is_admin) THEN
      NEW.is_admin = OLD.is_admin;
    END IF;
    -- Prevent quota tampering
    IF (NEW.free_diagnostics_left IS DISTINCT FROM OLD.free_diagnostics_left) THEN
      NEW.free_diagnostics_left = OLD.free_diagnostics_left;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profile_sensitive_fields_trigger ON public.profiles;

CREATE TRIGGER protect_profile_sensitive_fields_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_profile_sensitive_fields();