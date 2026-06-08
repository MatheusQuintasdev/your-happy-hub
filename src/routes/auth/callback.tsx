import { createFileRoute } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'
import { useEffect } from 'react'


export const Route = createFileRoute('/auth/callback')({
  component: AuthCallback,
})

function AuthCallback() {
  const navigate = Route.useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate({ to: '/dashboard' });
      } else {
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'PASSWORD_RECOVERY') {
            navigate({ to: '/auth/update-password' });
            return;
          }
          if (session) {
            navigate({ to: '/dashboard' });
          }
        });
        
        const timeout = setTimeout(() => {
          navigate({ to: '/' });
        }, 5000);

        return () => {
          data.subscription.unsubscribe();
          clearTimeout(timeout);
        };
      }


    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#08090A] space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary shadow-[0_0_15px_rgba(139,92,246,0.5)]"></div>
      <p className="text-muted-foreground font-bold animate-pulse">Sincronizando com o Painel...</p>
    </div>
  );
}

