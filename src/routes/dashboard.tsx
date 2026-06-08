import { createFileRoute, redirect, Outlet, useLocation } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'
import Sidebar from '@/components/dashboard/Sidebar'
import { useAuth } from '@/hooks/useAuth'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ location }) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No session found in dashboard beforeLoad, redirecting to login');
        throw redirect({ 
          to: '/auth',
          search: {
            redirect: location.href,
          },
        });
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('redirect')) throw error;
      throw redirect({ to: '/auth' });
    }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // beforeLoad should have handled this, but safety first
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar currentPath={location.pathname} />
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
