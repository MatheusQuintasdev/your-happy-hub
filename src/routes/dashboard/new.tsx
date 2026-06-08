import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { CheckCircle2, ArrowRight, Loader2, Rocket, Building2, Globe } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/dashboard/new')({
  component: NewDiagnosticPage,
})

const CATEGORIES = [
  { id: 'google', name: 'Google Meu Negócio', questions: [
    { id: 'g1', text: 'Sua empresa aparece no Google Maps?', options: ['Sim', 'Não'], points: { 'Sim': 10, 'Não': 0 } },
    { id: 'g2', text: 'Você tem mais de 20 avaliações?', options: ['Sim', 'Não'], points: { 'Sim': 10, 'Não': 0 } }
  ]},
  { id: 'instagram', name: 'Instagram', questions: [
    { id: 'i1', text: 'Você posta pelo menos 3 vezes por semana?', options: ['Sim', 'Não'], points: { 'Sim': 10, 'Não': 0 } },
    { id: 'i2', text: 'Sua bio tem link para o WhatsApp?', options: ['Sim', 'Não'], points: { 'Sim': 10, 'Não': 0 } }
  ]},
  { id: 'site', name: 'Site', questions: [
    { id: 's1', text: 'Você possui um site próprio?', options: ['Sim', 'Não'], points: { 'Sim': 20, 'Não': 0 } }
  ]},
  { id: 'whatsapp', name: 'WhatsApp', questions: [
    { id: 'w1', text: 'Você usa WhatsApp Business?', options: ['Sim', 'Não'], points: { 'Sim': 10, 'Não': 0 } }
  ]},
  { id: 'seo', name: 'SEO', questions: [
    { id: 'seo1', text: 'Sua empresa aparece na primeira página quando busca pelo seu serviço?', options: ['Sim', 'Não'], points: { 'Sim': 20, 'Não': 0 } }
  ]},
  { id: 'reviews', name: 'Avaliações', questions: [
    { id: 'r1', text: 'Você responde todas as avaliações que recebe?', options: ['Sim', 'Não'], points: { 'Sim': 10, 'Não': 0 } }
  ]}
];

function NewDiagnosticPage() {
  const { user, profile, isPro } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const canPerformDiagnostic = isPro || (profile?.free_diagnostics_left && profile.free_diagnostics_left > 0);

  const handleNextStep = () => {
    if (step === 0) {
      if (!companyName) {
        toast.error("Por favor, informe o nome da empresa");
        return;
      }
      if (!canPerformDiagnostic) {
        toast.error("Você atingiu seu limite de diagnósticos gratuitos.");
        return;
      }
      setStep(1);
    } else if (step === 1) {
      handleSubmit();
    }
  };

  const calculateScore = () => {
    let totalScore = 0;
    const catScores: Record<string, number> = {};

    CATEGORIES.forEach(cat => {
      let catScore = 0;
      cat.questions.forEach(q => {
        const answer = answers[q.id];
        if (answer) {
          catScore += q.points[answer as keyof typeof q.points] || 0;
        }
      });
      catScores[cat.id] = catScore;
      totalScore += catScore;
    });

    return { totalScore, catScores };
  };

  const getStatus = (score: number) => {
    if (score <= 40) return 'Crítico';
    if (score <= 60) return 'Precisa Melhorar';
    if (score <= 80) return 'Bom';
    return 'Excelente';
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);

    const { totalScore, catScores } = calculateScore();

    try {
      const { data: diagnostic, error: diagError } = await supabase.from('diagnostics').insert({
        user_id: user.id,
        company_name: companyName,
        website_url: website,
        category_scores: catScores,
        score: totalScore,
        responses: answers,
        industry: 'Geral'
      }).select().single();

      if (diagError) throw diagError;

      if (!isPro && profile) {
        await supabase.from('profiles').update({
          free_diagnostics_left: Math.max(0, (profile.free_diagnostics_left || 0) - 1)
        }).eq('id', user.id);
      }

      toast.success("Diagnóstico concluído com sucesso!");
      console.log('Navegando para advisor com id:', diagnostic.id);
      navigate({ 
        to: '/dashboard/advisor', 
        search: { diagnosticId: diagnostic.id } 
      });
    } catch (error: any) {
      toast.error("Erro ao salvar diagnóstico: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
          <Rocket className="w-3 h-3" /> Motor Growth Engine
        </div>
        <h1 className="text-4xl font-black tracking-tight text-foreground">Novo Diagnóstico</h1>
        <p className="text-muted-foreground text-lg">Inicie sua jornada para a excelência digital.</p>
      </div>


      <Card className="glass-card border-none overflow-hidden rounded-3xl">
        <CardContent className="p-8 space-y-8">
          {step === 0 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest">
                <Building2 className="w-4 h-4" /> Etapa 1: Identificação
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="company" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Nome da Empresa</Label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input 
                      id="company" 
                      placeholder="Ex: Pulse Agency" 
                      className="bg-white/5 border-white/5 h-14 pl-12 rounded-xl focus:ring-primary"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="website" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Website (Opcional)</Label>
                   <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input 
                      id="website" 
                      placeholder="www.suaempresa.com" 
                      className="bg-white/5 border-white/5 h-14 pl-12 rounded-xl focus:ring-primary"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              {!canPerformDiagnostic && (
                <div className="p-6 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-2xl text-sm font-medium">
                  Você atingiu o limite de diagnósticos gratuitos. 
                  <Button variant="link" className="text-orange-500 font-black p-0 ml-2" onClick={() => navigate({to: '/dashboard/subscription'})}>
                    Faça o upgrade para Pro agora.
                  </Button>
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest">
                <Rocket className="w-4 h-4" /> Etapa 2: Análise de Presença
              </div>

              <div className="grid gap-10">
                {CATEGORIES.map((cat) => (
                  <div key={cat.id} className="space-y-6 p-6 rounded-2xl bg-white/5 border border-white/5">
                    <h3 className="text-lg font-black text-primary uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-primary rounded-full" /> {cat.name}
                    </h3>
                    <div className="grid gap-6">
                      {cat.questions.map((q) => (
                        <div key={q.id} className="space-y-4">
                          <p className="font-bold text-foreground leading-relaxed">{q.text}</p>
                          <div className="flex gap-4">
                            {q.options.map((opt) => (
                              <Button
                                key={opt}
                                variant={answers[q.id] === opt ? "default" : "outline"}
                                className={`h-12 px-8 rounded-xl font-bold transition-all ${
                                  answers[q.id] === opt 
                                    ? "bg-primary text-white shadow-lg glow-primary" 
                                    : "bg-white/5 border-white/5 hover:bg-white/10"
                                }`}
                                onClick={() => setAnswers({...answers, [q.id]: opt})}
                              >
                                {opt}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-8 border-t border-white/5">
            <Button 
              variant="ghost" 
              className="h-14 px-8 rounded-xl text-muted-foreground hover:text-foreground font-bold"
              onClick={() => step > 0 && setStep(step - 1)}
              disabled={step === 0 || loading}
            >
              Voltar
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90 text-white px-10 h-14 rounded-xl font-black glow-primary"
              onClick={handleNextStep}
              disabled={loading || (step === 0 && !canPerformDiagnostic)}
            >
              {loading ? (
                <>Processando Inteligência <Loader2 className="ml-2 w-5 h-5 animate-spin" /></>
              ) : step === 1 ? (
                <>Finalizar Diagnóstico <CheckCircle2 className="ml-2 w-5 h-5" /></>
              ) : (
                <>Próxima Etapa <ArrowRight className="ml-2 w-5 h-5" /></>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
