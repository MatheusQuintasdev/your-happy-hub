import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, ArrowRight } from "lucide-react"

interface SimulationProps {
  current: number
  projected: number
  reasoning: string
}

export default function ScoreSimulator({ current, projected, reasoning }: SimulationProps) {
  return (
    <Card className="glass-card border-none overflow-hidden">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-6 w-full">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Projeção de Performance</span>
                <h3 className="text-2xl font-black">Seu Potencial de Crescimento</h3>
              </div>
              <div className="text-right">
                <span className="text-4xl font-black text-primary">+{projected - current} pts</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-muted-foreground">Score Atual: {current}</span>
                <span className="text-primary font-black">Meta: {projected}</span>
              </div>
              <div className="relative h-4 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-primary/20 transition-all duration-1000" 
                  style={{ width: `${current}%` }} 
                />
                <div 
                  className="absolute top-0 left-0 h-full bg-primary transition-all duration-1000 delay-500" 
                  style={{ width: `${projected}%` }} 
                />
              </div>

            </div>

            <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-primary/20 pl-4">
              "{reasoning}"
            </p>
          </div>

          <div className="flex items-center gap-6">
             <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-black text-muted-foreground">
                {current}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Atual</span>
            </div>
            
            <ArrowRight className="w-8 h-8 text-primary animate-pulse" />

            <div className="flex flex-col items-center gap-2">
              <div className="w-24 h-24 rounded-3xl bg-primary/20 border-2 border-primary/40 flex items-center justify-center text-4xl font-black text-primary glow-primary">
                {projected}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tighter text-primary">Projetado</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
