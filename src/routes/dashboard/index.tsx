import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Rocket, TrendingUp, CreditCard, History, ArrowUpRight, BarChart3, AlertCircle } from 'lucide-react'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardHome,
})

function DashboardHome() {
  const { profile, isPro } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats', profile?.id],
    enabled: !!profile?.id,
    queryFn: async () => {
      const { count, data } = await supabase
        .from('diagnostics')
        .select('score', { count: 'exact' })
        .order('created_at', { ascending: false });

      return {
        total: count || 0,
        lastScore: data?.[0]?.score || null
      };
    }
  });


  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Olá, <span className="text-primary">{profile?.full_name?.split(' ')[0] || 'bem-vindo'}</span>!
          </h1>
          <p className="text-muted-foreground mt-2 text-lg font-medium">Sua central de crescimento digital profissional.</p>
        </div>
        <Link to="/dashboard/new">
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-8 py-6 text-lg glow-primary group">
            Novo Diagnóstico <ArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card border-none overflow-hidden relative group hover:scale-[1.02] transition-all">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <BarChart3 className="w-12 h-12 text-primary" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Último Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-primary">{stats?.lastScore !== null ? `${stats?.lastScore}/100` : '--/100'}</div>
            <p className="text-xs text-muted-foreground mt-2">Baseado no último diagnóstico</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-none overflow-hidden relative group hover:scale-[1.02] transition-all">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <History className="w-12 h-12 text-accent" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Diagnósticos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-foreground">{stats?.total || 0}</div>
            <p className="text-xs text-muted-foreground mt-2">Análises profissionais</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-none overflow-hidden relative group hover:scale-[1.02] transition-all">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Rocket className="w-12 h-12 text-yellow-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Diagnósticos Free</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-yellow-500">
              {isPro ? '∞' : `${profile?.free_diagnostics_left ?? 3}/3`}
            </div>
            <p className="text-xs text-muted-foreground mt-2">{isPro ? 'Acesso Ilimitado' : 'Restantes'}</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-none overflow-hidden relative group hover:scale-[1.02] transition-all border-l-4 border-l-primary/50">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <CreditCard className="w-12 h-12 text-foreground" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Plano</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-foreground">
              {isPro ? 'Pro' : 'Free'}
            </div>
            {!isPro && (
              <Link to="/dashboard/subscription">
                <p className="text-xs text-primary mt-2 cursor-pointer hover:underline flex items-center gap-1 font-bold">
                  Faça Upgrade <ArrowUpRight className="w-3 h-3" />
                </p>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="glass-card border-none relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent opacity-50" />
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Rocket className="w-6 h-6 text-primary" /> Growth Engine
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              Nosso motor de análise identificou novas oportunidades reais para aumentar seu faturamento. Acesse o Growth Engine para ver seu plano de 30 dias.
            </p>
            <Link to="/dashboard/advisor">
              <Button className="w-full bg-white text-black hover:bg-white/90 rounded-xl py-6 font-bold text-lg">
                Ver Plano de Crescimento
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full" />
          <CardHeader>
            <CardTitle className="text-2xl font-black">PulseScore Pro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-foreground/80 leading-relaxed font-medium">
              Libere o Detector de Dinheiro Perdido, Relatórios PDF profissionais e Benchmark de Mercado detalhado.
            </p>
            {!isPro ? (
              <Link to="/dashboard/subscription">
                <Button className="w-full bg-primary text-white hover:bg-primary/90 rounded-xl py-6 font-bold text-lg glow-primary">
                  Upgrade para Pro
                </Button>
              </Link>
            ) : (
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center font-bold text-primary">
                Acesso Pro Ativo!
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
