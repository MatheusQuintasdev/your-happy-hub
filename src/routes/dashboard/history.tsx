import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Loader2, ArrowRight, Building2, Briefcase } from 'lucide-react'

export const Route = createFileRoute('/dashboard/history')({
  component: HistoryPage,
})

function HistoryPage() {
  const navigate = useNavigate();
  const { data: history, isLoading } = useQuery({
    queryKey: ['diagnostics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('diagnostics')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleViewDetails = (id: string) => {
    // Navigate to advisor for this diagnostic
    navigate({ to: `/dashboard/advisor`, search: { diagnosticId: id } });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-foreground">Histórico de Diagnósticos</h1>
        <p className="text-muted-foreground mt-2 text-lg">Acompanhe a evolução da sua inteligência digital.</p>
      </div>

      <Card className="glass-card border-none overflow-hidden rounded-2xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="p-6 font-bold uppercase tracking-wider text-xs text-muted-foreground">Data</th>
                  <th className="p-6 font-bold uppercase tracking-wider text-xs text-muted-foreground">Empresa</th>
                  <th className="p-6 font-bold uppercase tracking-wider text-xs text-muted-foreground">Indústria</th>
                  <th className="p-6 font-bold uppercase tracking-wider text-xs text-muted-foreground">Score</th>
                  <th className="p-6 font-bold uppercase tracking-wider text-xs text-muted-foreground text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center">
                      <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary" />
                    </td>
                  </tr>
                ) : history?.map((item) => (
                  <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="p-6 text-sm text-muted-foreground">
                      {format(new Date(item.created_at), "dd 'de' MMM, yyyy", { locale: ptBR })}
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3 font-bold text-foreground">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Building2 className="w-4 h-4 text-primary" />
                        </div>
                        {item.company_name}
                      </div>
                    </td>
                    <td className="p-6 text-sm text-muted-foreground">
                       <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        {item.industry}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className={`inline-flex px-3 py-1 rounded-full text-xs font-black ring-1 ring-inset ${
                        item.score > 80 ? 'bg-green-500/10 text-green-500 ring-green-500/20' : 
                        item.score > 60 ? 'bg-primary/10 text-primary ring-primary/20' : 
                        item.score > 40 ? 'bg-yellow-500/10 text-yellow-500 ring-yellow-500/20' :
                        'bg-red-500/10 text-red-500 ring-red-500/20'
                      }`}>
                        {item.score}/100
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-primary hover:text-primary hover:bg-primary/10 font-bold group"
                        onClick={() => handleViewDetails(item.id)}
                      >
                        Ver Detalhes <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {!isLoading && history?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-muted-foreground">
                      Nenhum diagnóstico encontrado. Comece seu primeiro agora!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
