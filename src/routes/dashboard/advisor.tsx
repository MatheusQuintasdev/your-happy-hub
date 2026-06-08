import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Rocket, Loader2, AlertTriangle, ArrowRight, Lock, CheckCircle2, TrendingUp, BarChart, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import GrowthPlan from '@/components/dashboard/advisor/GrowthPlan'
import MoneyLeaks from '@/components/dashboard/advisor/MoneyLeaks'
import ScoreSimulator from '@/components/dashboard/advisor/ScoreSimulator'
import SmartChecklist from '@/components/dashboard/advisor/SmartChecklist'
import { toast } from 'sonner'
import { runGrowthEngine } from '@/lib/growth-engine/engine'
import { GrowthEngineResult } from '@/lib/growth-engine/types'


export const Route = createFileRoute('/dashboard/advisor')({
  component: AdvisorPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      diagnosticId: (search.diagnosticId as string) || undefined,
    }
  },
})

interface AIInsights extends GrowthEngineResult {}


function AdvisorPage() {
  const { profile, isPro } = useAuth()
  const queryClient = useQueryClient()
  const searchParams = Route.useSearch() as { diagnosticId?: string }

  // Fetch the diagnostic to analyze
  const { data: diagnostic, isLoading: isLoadingDiag } = useQuery({
    queryKey: ['diagnostic-for-advisor', searchParams.diagnosticId],
    enabled: !!profile?.id,
    queryFn: async () => {
      let query = supabase.from('diagnostics').select('*').order('created_at', { ascending: false })
      
      if (searchParams.diagnosticId) {
        query = query.eq('id', searchParams.diagnosticId)
      }
      
      const { data, error } = await query.limit(1).single()
      if (error) return null
      return data
    }
  })

  // Fetch existing AI insights
  const { data: insights, isLoading: isLoadingInsights } = useQuery({
    queryKey: ['ai-insights', diagnostic?.id],
    enabled: !!diagnostic?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('diagnostic_id', diagnostic!.id)
        .maybeSingle()
      
      if (error) return null
      return data as any
    }
  })

  // Fetch tasks
  const { data: tasks } = useQuery({
    queryKey: ['user-tasks', diagnostic?.id],
    enabled: !!diagnostic?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_tasks')
        .select('*')
        .eq('diagnostic_id', diagnostic!.id)
      
      if (error) return []
      return data
    }
  })

  // Generate insights mutation
  const generateMutation = useMutation({
    mutationFn: async () => {
      if (!diagnostic?.id) throw new Error('Diagnóstico não encontrado')
      
      const engineResult = runGrowthEngine(
        diagnostic.company_name,
        diagnostic.industry || 'Geral',
        diagnostic.score,
        diagnostic.responses as any
      );

      // Save to database as "AI" insights (reusing schema for speed)
      const { error } = await supabase.from('ai_insights').upsert({
        diagnostic_id: diagnostic.id,
        user_id: profile!.id,
        executive_summary: engineResult.executive_summary,
        growth_plan: engineResult.growth_plan as any,
        lost_opportunities: engineResult.lost_opportunities as any,
        bottlenecks: engineResult.bottlenecks as any,
        priorities: engineResult.priorities as any,
        simulations: engineResult.simulation as any,
        scores: engineResult.scores as any,
        updated_at: new Date().toISOString()
      });

      if (error) throw error;

      // Auto-generate tasks
      const allTasks = [
        ...(engineResult.growth_plan.week1 || []),
        ...(engineResult.growth_plan.week2 || []),
        ...(engineResult.growth_plan.week3 || []),
        ...(engineResult.growth_plan.week4 || [])
      ].map(t => ({
        user_id: profile!.id,
        diagnostic_id: diagnostic.id,
        title: t.title,
        description: t.description,
        difficulty: t.difficulty,
        impact: t.impact,
        estimated_time: t.time
      }));

      await supabase.from('user_tasks').delete().eq('diagnostic_id', diagnostic.id);
      await supabase.from('user_tasks').insert(allTasks);

      return engineResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-insights', diagnostic?.id] })
      queryClient.invalidateQueries({ queryKey: ['user-tasks', diagnostic?.id] })
      toast.success('Growth Engine recalibrado com sucesso!')
    },
    onError: (error) => {
      toast.error('Erro ao processar Growth Engine: ' + error.message)
    }

  })

  if (isLoadingDiag || isLoadingInsights) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    )
  }

  if (!diagnostic) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
        <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black">Nenhum diagnóstico encontrado</h2>
          <p className="text-muted-foreground mt-2 max-w-sm">
            O Growth Engine está pronto para analisar seus dados e criar um plano profissional.
          </p>
          <Link to="/dashboard/new" className="inline-block mt-8">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-8 py-6 text-lg glow-primary">
              Fazer Meu Primeiro Diagnóstico
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const needsGeneration = !insights && !generateMutation.isPending
  const castInsights = insights as AIInsights | null;

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
            <Rocket className="w-3 h-3" /> Growth Engine v1.0
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Estratégia para <span className="text-primary">{diagnostic.company_name}</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Seu plano mestre profissional para dominar o mercado.</p>
        </div>
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            className="glass border-white/10 hover:bg-white/5 rounded-2xl h-14 px-6"
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
          >
            {generateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Rocket className="w-4 h-4 mr-2" />}
            Atualizar Growth Engine
          </Button>
          {castInsights && (
            <Button className="bg-white text-black hover:bg-white/90 rounded-2xl h-14 px-6 font-bold flex gap-2">
              <Download className="w-4 h-4" /> PDF
            </Button>
          )}
        </div>
      </div>

      {needsGeneration ? (
        <div className="p-12 text-center glass-card border-none rounded-3xl space-y-6">
          <Rocket className="w-16 h-16 text-primary mx-auto animate-bounce" />
          <h2 className="text-3xl font-black">Pronto para sua consultoria?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-lg leading-relaxed">
            O Growth Engine está pronto para analisar seus dados e criar um plano de crescimento de 30 dias profissional.
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-12 py-8 text-xl font-black glow-primary"
            onClick={() => {
              console.log('Button clicked, starting mutation...');
              generateMutation.mutate();
            }}
            disabled={generateMutation.isPending}
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin mr-3" />
                Processando...
              </>
            ) : "Ativar Growth Engine"}
          </Button>
        </div>
      ) : generateMutation.isPending ? (
         <div className="p-20 text-center glass-card border-none rounded-3xl space-y-8 animate-pulse">
          <Loader2 className="w-20 h-20 animate-spin text-primary mx-auto" />
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-primary">Calibrando Estratégia...</h2>
            <p className="text-muted-foreground text-lg">Aplicando regras de negócio e benchmark de mercado.</p>
          </div>
        </div>
      ) : castInsights && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Resumo Executivo */}
            <section className="space-y-4">
              <h2 className="text-2xl font-black uppercase tracking-widest text-muted-foreground/50 text-sm">Diagnóstico Executivo</h2>
              <div className="glass-card p-8 rounded-3xl border-none">
                <p className="text-lg text-foreground/90 leading-relaxed font-medium italic">
                  "{castInsights.executive_summary}"
                </p>
              </div>
            </section>

            {/* Benchmark Section */}
            <section className="space-y-4">
              <h2 className="text-2xl font-black uppercase tracking-widest text-muted-foreground/50 text-sm">Benchmark de Mercado</h2>
              <div className="glass-card p-8 rounded-3xl border-none flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <BarChart className="w-5 h-5" /> 
                    Você está acima de {castInsights.benchmark?.percentile}% das empresas
                  </div>
                  <p className="text-muted-foreground">Comparação direta com a média do seu setor ({diagnostic.industry}).</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-muted-foreground">Média Setor</div>
                  <div className="text-3xl font-black">{castInsights.benchmark?.industry_avg} pts</div>
                </div>
              </div>
            </section>

            {/* Gráficos de Score */}
            <section className="space-y-4">
              <h2 className="text-2xl font-black uppercase tracking-widest text-muted-foreground/50 text-sm">Análise de Performance</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Autoridade', value: castInsights.scores?.authority || 0 },
                  { label: 'Conversão', value: castInsights.scores?.conversion || 0 },
                  { label: 'Credibilidade', value: castInsights.scores?.credibility || 0 },
                  { label: 'Presença', value: castInsights.scores?.presence || 0 },
                ].map((s) => (
                  <div key={s.label} className="glass-card p-4 rounded-2xl text-center">
                    <div className="text-xs font-bold text-muted-foreground uppercase mb-2">{s.label}</div>
                    <div className="text-2xl font-black text-primary">{s.value}%</div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full mt-3 overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${s.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Module 4: Simulator */}
            <section className="space-y-4">
              <h2 className="text-2xl font-black uppercase tracking-widest text-muted-foreground/50 text-sm">Projeção de Melhoria</h2>
              <ScoreSimulator 
                current={castInsights.simulation?.current_score ?? 0}
                projected={castInsights.simulation?.projected_score ?? 0}
                reasoning={castInsights.simulation?.reasoning ?? ''}
              />
            </section>

            {/* Module 1: Growth Plan */}
            <section className="space-y-6">
               <h2 className="text-2xl font-black uppercase tracking-widest text-muted-foreground/50 text-sm">Plano de Crescimento 30 Dias</h2>
               <GrowthPlan plan={castInsights.growth_plan} />
            </section>

             {/* Module 2: Money Leaks */}
            <section className="space-y-6">
               <h2 className="text-2xl font-black uppercase tracking-widest text-muted-foreground/50 text-sm">Detector de Dinheiro Perdido</h2>
               <MoneyLeaks opportunities={castInsights.lost_opportunities} />
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            {/* Module 6: Smart Checklist */}
            <section>
              <SmartChecklist 
                initialTasks={(tasks || []).map(t => ({ ...t, is_completed: !!t.is_completed, impact: t.impact || 'Médio' }))} 
                userId={profile!.id} 
              />
            </section>

             {/* Gargalos */}
             <section className="glass-card border-none rounded-3xl p-6 space-y-6 bg-red-500/5">
                <h3 className="text-lg font-black uppercase tracking-widest text-red-500/50 text-xs">Gargalos Críticos</h3>
                <div className="space-y-4">
                  {(castInsights.bottlenecks || []).sort((a, b) => a.order - b.order).map((b: any, idx: number) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 items-start">
                      <div className="text-xl font-black text-red-500/20">0{idx + 1}</div>
                      <div className="flex-1">
                        <p className="font-bold text-sm text-foreground">{b.problem}</p>
                        <p className="text-[11px] text-muted-foreground mt-1">{b.impact}</p>
                      </div>
                    </div>
                  ))}
                </div>
             </section>

             {/* Riscos Identificados */}
             <section className="glass-card border-none rounded-3xl p-6 space-y-6 bg-orange-500/5">
                <h3 className="text-lg font-black uppercase tracking-widest text-orange-500/50 text-xs">Riscos Identificados</h3>
                <div className="space-y-2">
                  {castInsights.risks?.map((risk, idx) => (
                    <div key={idx} className="flex gap-2 text-xs font-medium text-orange-200/70 items-center">
                      <AlertTriangle className="w-3 h-3 text-orange-500" /> {risk}
                    </div>
                  ))}
                </div>
             </section>

             {/* Module 3: Priority Absolute */}
             <section className="glass-card border-none rounded-3xl p-6 space-y-6">
                <h3 className="text-lg font-black uppercase tracking-widest text-primary/50 text-xs">Oportunidades Prioritárias</h3>
                <div className="space-y-4">
                  {(castInsights.priorities || []).map((p: any, idx: number) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 items-center hover:bg-white/10 transition-colors">
                      <div className="text-2xl font-black text-primary/20">#{idx + 1}</div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">{p.action}</p>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <span className="text-[9px] uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full w-fit">Impacto: {p.impact}</span>
                          <span className="text-[9px] uppercase font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full w-fit">Dif: {p.difficulty}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground">• {p.gain}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
             </section>
          </div>
        </div>
      )}

    </div>
  )
}
