import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Zap } from "lucide-react"

interface Task {
  title: string
  description: string
  difficulty: string
  impact: string
  time: string
}

interface GrowthPlanProps {
  plan: {
    week1: Task[]
    week2: Task[]
    week3: Task[]
    week4: Task[]
  }
}

export default function GrowthPlan({ plan }: GrowthPlanProps) {
  const weeks = [
    { id: 'week1', label: 'Semana 1', tasks: plan.week1 },
    { id: 'week2', label: 'Semana 2', tasks: plan.week2 },
    { id: 'week3', label: 'Semana 3', tasks: plan.week3 },
    { id: 'week4', label: 'Semana 4', tasks: plan.week4 },
  ]

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {weeks.map((week) => (
          <div key={week.id} className="space-y-4">
            <h3 className="text-xl font-black flex items-center gap-2 px-2">
              <Calendar className="w-5 h-5 text-primary" /> {week.label}
            </h3>
            <div className="space-y-4">
              {week.tasks.map((task, idx) => (
                <Card key={idx} className="glass-card border-none hover:border-primary/20 transition-all group">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-foreground leading-tight">{task.title}</h4>
                      <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] uppercase whitespace-nowrap">
                        {task.impact}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{task.description}</p>
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground pt-1 border-t border-white/5">
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-yellow-500" /> {task.difficulty}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {task.time}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
