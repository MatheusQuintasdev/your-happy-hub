import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Zap, Sparkles } from "lucide-react"
import { useAuth } from '@/hooks/useAuth'

export const Route = createFileRoute('/dashboard/subscription')({
  component: SubscriptionPage,
})

function SubscriptionPage() {
  const { isPro, user } = useAuth();
  const STRIPE_PAYMENT_LINK = `https://buy.stripe.com/test_14A5kwcoI4YG9qOanffUQ00?prefilled_email=${user?.email || ''}&client_reference_id=${user?.id || ''}`;


  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
          <Sparkles className="w-3 h-3" /> Upgrade de Inteligência
        </div>
        <h1 className="text-5xl font-black tracking-tight text-foreground">PulseScore <span className="text-primary">Pro</span></h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Desbloqueie todo o arsenal da PulseAI e transforme sua presença digital em uma máquina de vendas.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <Card className="glass-card border-none flex flex-col relative overflow-hidden group">
          <CardHeader className="p-8">
            <CardTitle className="text-2xl font-black">Free</CardTitle>
            <CardDescription className="text-muted-foreground">Para começar sua jornada digital</CardDescription>
            <div className="mt-6 text-5xl font-black text-foreground">R$ 0<span className="text-lg font-bold text-muted-foreground tracking-normal uppercase">/mês</span></div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4 p-8 pt-0">
            {[
              "3 Diagnósticos gratuitos",
              "Dashboard básico",
              "Dicas de otimização",
              "Suporte por e-mail"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="rounded-full bg-white/5 p-1">
                  <Check className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">{feature}</span>
              </div>
            ))}
            <Button disabled={!isPro} className="w-full mt-10 h-14 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-foreground transition-all">
              {!isPro ? 'Plano Atual' : 'Downgrade'}
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-card border-2 border-primary/40 shadow-[0_0_40px_rgba(139,92,246,0.15)] flex flex-col relative overflow-hidden scale-105">
          <div className="absolute top-0 right-0 bg-primary text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-bl-2xl">Elite</div>
          <CardHeader className="p-8">
            <CardTitle className="text-2xl font-black text-primary">PulseScore Pro</CardTitle>
            <CardDescription className="text-primary/70">A inteligência completa para escalar seu negócio</CardDescription>
            <div className="mt-6 text-5xl font-black text-foreground">R$ 29,90<span className="text-lg font-bold text-muted-foreground tracking-normal uppercase">/mês</span></div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4 p-8 pt-0">
            {[
              "Diagnósticos ilimitados",
              "PulseAI Growth Advisor (Plano 30 dias)",
              "Detector de Dinheiro Perdido",
              "Gerador de Conteúdo Estratégico AI",
              "Consultor Digital PulseAI ilimitado",
              "Projeções de Performance Local"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="rounded-full bg-primary/20 p-1">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-foreground font-bold">{feature}</span>
              </div>
            ))}
            <Button 
              onClick={() => window.open(STRIPE_PAYMENT_LINK, '_blank')}
              className="w-full mt-10 h-14 rounded-xl bg-primary hover:bg-primary/90 text-white font-black text-lg glow-primary shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
              disabled={isPro}
            >
              {isPro ? 'Plano Ativo' : 'Desbloquear Pro Agora'} <Zap className="w-5 h-5 ml-2 fill-current" />
            </Button>
            <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-widest">Cancelamento a qualquer momento</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
