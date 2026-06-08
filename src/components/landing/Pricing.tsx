import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";

const plans = [
  {
    name: "Free",
    price: "R$0",
    description: "Para quem está começando a organizar a casa.",
    features: [
      "3 Diagnósticos Grátis",
      "Score Digital Básico",
      "Análise de Google Meu Negócio",
      "Sugestões Práticas (Limitadas)",
    ],
    buttonText: "Começar Grátis",
    highlight: false
  },
  {
    name: "Pro",
    price: "R$29,90",
    period: "/mês",
    description: "A consultoria digital completa para escalar seu negócio.",
    features: [
      "Diagnósticos Ilimitados",
      "PulseAI Growth Advisor (30 dias)",
      "Detector de Dinheiro Perdido",
      "Gerador de Conteúdo p/ Instagram",
      "Análise de SEO e Autoridade",
      "Suporte Prioritário",
    ],
    buttonText: "Assinar Agora",
    highlight: true
  }
];

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAction = () => {
    if (user) {
      navigate({ to: "/dashboard/subscription" });
    } else {
      // Use standard handleStart from Hero logic (simplified here)
      const element = document.getElementById('hero');
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="pricing" className="py-24 px-4 md:px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tight">
            O melhor investimento para seu <span className="text-primary">crescimento</span>.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tenha uma consultoria estratégica de elite pelo preço de um café.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`relative p-8 md:p-12 rounded-[2rem] border transition-all duration-300 hover:scale-[1.02] ${
                plan.highlight 
                  ? "bg-gradient-to-b from-primary/20 to-accent/20 border-primary/30 shadow-[0_0_50px_-12px_rgba(139,92,246,0.3)]" 
                  : "bg-white/[0.02] border-white/5"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
                  Mais Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground font-medium">{plan.period}</span>}
                </div>
                <p className="text-muted-foreground mt-4 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="space-y-4 mb-10">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/20 p-1">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground/80 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                onClick={handleAction}
                className={`w-full py-8 text-xl rounded-2xl font-bold transition-all ${
                  plan.highlight 
                    ? "bg-primary hover:bg-primary/90 text-white glow-primary" 
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
