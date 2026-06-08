import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, TrendingDown, Lightbulb } from "lucide-react"

interface Opportunity {
  category: string
  situation: string
  impact: string
  consequence: string
  solution: string
  priority: string
}

export default function MoneyLeaks({ opportunities }: { opportunities: Opportunity[] }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {opportunities.map((item, idx) => (
        <Card key={idx} className="glass-card border-none overflow-hidden group">
          <div className={`h-1 w-full bg-gradient-to-r opacity-50 ${
            item.priority === 'Alta' ? 'from-red-500 to-red-600' : 
            item.priority === 'Média' ? 'from-yellow-500 to-yellow-600' : 
            'from-blue-500 to-blue-600'
          }`} />
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-start gap-2">
              <span className="text-[10px] font-black uppercase tracking-tighter text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {item.category}
              </span>
              <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full ${
                item.priority === 'Alta' ? 'bg-red-500/20 text-red-500' : 'bg-muted text-muted-foreground'
              }`}>
                {item.priority}
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase text-muted-foreground/60">Situação Atual</div>
              <p className="text-sm font-bold text-foreground">{item.situation}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase text-muted-foreground/60">Impacto</div>
                <p className="text-[11px] text-muted-foreground leading-tight">{item.impact}</p>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase text-muted-foreground/60">Consequência</div>
                <p className="text-[11px] text-red-500/70 leading-tight font-medium">{item.consequence}</p>
              </div>
            </div>

            <div className="p-3 bg-primary/5 rounded-xl border border-primary/10 space-y-1 group-hover:bg-primary/10 transition-colors">
              <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest">
                <Lightbulb className="w-3 h-3" /> Recomendação
              </div>
              <p className="text-xs font-bold text-foreground">{item.solution}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
