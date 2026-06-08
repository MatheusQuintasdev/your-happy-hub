import { Zap, ShieldCheck, TrendingUp, Users, Search, Target, Award, BarChart3, Clock, Rocket, CheckCircle, HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const features = [
  { icon: Zap, title: "Mais Conversões", desc: "Identifique exatamente onde você está deixando dinheiro na mesa e como recuperar.", color: "text-primary" },
  { icon: ShieldCheck, title: "Mais Autoridade", desc: "Construa uma presença digital que inspira confiança imediata e domina o mercado.", color: "text-accent" },
  { icon: TrendingUp, title: "Crescimento Acelerado", desc: "Receba um roteiro estratégico personalizado pela PulseAI para escalar seu faturamento.", color: "text-green-500" },
  { icon: Users, title: "Atração Magnética", desc: "Transforme sua presença online em um imã de clientes qualificados todos os dias.", color: "text-orange-500" },
];

const steps = [
  { icon: Search, title: "Escaneamento", desc: "Nossa IA faz uma auditoria completa da sua presença no Google, Instagram e Web em segundos." },
  { icon: Target, title: "Diagnóstico", desc: "Identificamos falhas de credibilidade, lacunas de prova social e erros técnicos invisíveis." },
  { icon: BarChart3, title: "Plano de Ação", desc: "Você recebe um roteiro de 30 dias com tarefas práticas para subir seu score e atrair clientes." },
];

const faqs = [
  { q: "Quanto tempo leva o diagnóstico?", a: "O escaneamento inicial leva menos de 3 minutos. Após isso, você já tem acesso ao seu score e recomendações básicas." },
  { q: "Preciso de conhecimentos técnicos?", a: "Não. O PulseScore foi feito para donos de negócios. As tarefas são explicadas de forma simples e direta." },
  { q: "Como o PulseAI Advisor ajuda meu negócio?", a: "Ele age como um consultor digital 24/7, gerando posts, legendas e estratégias baseadas nos dados reais da sua empresa." },
  { q: "Posso cancelar a assinatura Pro?", a: "Sim, o cancelamento é livre a qualquer momento diretamente pelo seu painel de controle." },
];

export default function Features() {
  return (
    <div className="space-y-32 pb-32">
      {/* Features Section (Benefícios) */}
      <section id="features" className="py-24 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 blur-[120px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tight">
              A Inteligência por trás do <span className="text-primary">sucesso</span>.
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Não entregamos apenas dados. Entregamos o caminho exato para a liderança digital.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="group p-8 rounded-3xl glass-card border-none hover:bg-white/[0.05] transition-all hover:scale-105 duration-300">
                <div className={`p-4 rounded-2xl bg-white/5 w-fit mb-8 group-hover:scale-110 transition-transform ${f.color}`}>
                  <f.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-foreground mb-4">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 px-4 md:px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tight">
              Como <span className="text-primary">Funciona</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Três passos simples para transformar sua presença online.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((s, i) => (
              <div key={i} className="relative flex flex-col items-center text-center space-y-6">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-[2px] bg-gradient-to-r from-primary/50 to-transparent -z-10" />
                )}
                <div className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary glow-primary">
                  <s.icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-foreground">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-black text-foreground tracking-tight flex items-center justify-center gap-4">
              <HelpCircle className="text-primary w-10 h-10" /> Dúvidas Frequentes
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="glass-card border-none rounded-2xl px-6">
                <AccordionTrigger className="text-lg font-bold hover:no-underline py-6">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base pb-6 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
