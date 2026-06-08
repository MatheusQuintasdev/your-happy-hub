import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

export default function Hero() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleStart = async () => {
    if (loading) return;
    
    if (user) {
      navigate({ to: "/dashboard/new" });
    } else {
      navigate({ to: "/auth" });
    }
  };

  const handleSeeExample = () => {
    const element = document.getElementById('demo');
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      toast.success("Veja como seu painel será!", {
        description: "O PulseScore analisa Google, Instagram e muito mais.",
      });
    }
  };

  return (
    <section className="relative py-24 md:py-32 px-4 md:px-6 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Inteligência Digital de Elite
        </div>

        <h1 className="text-5xl md:text-8xl font-black tracking-tight text-foreground mb-8 max-w-5xl leading-[1.1]">
          Sua empresa está <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">perdendo clientes</span> online?
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl leading-relaxed">
          O PulseScore analisa sua presença digital em tempo real e entrega o roteiro exato para dominar seu mercado local em apenas 3 minutos.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white px-10 py-8 text-xl rounded-2xl glow-primary transition-all hover:scale-105 active:scale-95"
            onClick={handleStart}
            disabled={loading}
          >
            Começar Agora Grátis <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="glass border-white/10 hover:bg-white/5 text-foreground px-10 py-8 text-xl rounded-2xl transition-all hover:scale-105 active:scale-95"
            onClick={handleSeeExample}
          >
            <Play className="mr-2 w-5 h-5 fill-current" /> Ver Exemplo
          </Button>
        </div>
        
        {!loading && !user && (
          <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-1000 delay-300">
            <button 
              onClick={() => navigate({ to: "/auth" })}
              className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium group"
            >
              Já é membro? <span className="text-primary font-bold group-hover:underline">Entrar no Painel</span>
            </button>
          </div>
        )}

        {/* Stats / Social Proof */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 border-t border-white/5 pt-12">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-foreground">3min</span>
            <span className="text-sm text-muted-foreground uppercase tracking-widest">Diagnóstico</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-foreground">+500</span>
            <span className="text-sm text-muted-foreground uppercase tracking-widest">Empresas</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-foreground">98%</span>
            <span className="text-sm text-muted-foreground uppercase tracking-widest">Precisão</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-foreground">PulseAI</span>
            <span className="text-sm text-muted-foreground uppercase tracking-widest">Consultoria</span>
          </div>
        </div>
      </div>
    </section>
  );
}
