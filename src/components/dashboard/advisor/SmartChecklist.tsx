import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { CheckCircle2, Circle } from "lucide-react"

interface Task {
  id: string
  title: string
  is_completed: boolean
  impact: string
}

export default function SmartChecklist({ initialTasks, userId }: { initialTasks: Task[], userId: string }) {
  const [tasks, setTasks] = useState(initialTasks)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const completed = tasks.filter(t => t.is_completed).length
    setProgress(tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0)
  }, [tasks])

  const toggleTask = async (taskId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('user_tasks')
      .update({ is_completed: !currentStatus, completed_at: !currentStatus ? new Date().toISOString() : null })
      .eq('id', taskId)

    if (error) {
      toast.error("Erro ao atualizar tarefa")
      return
    }

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, is_completed: !currentStatus } : t))
    if (!currentStatus) toast.success("Tarefa concluída!")
  }

  return (
    <Card className="glass-card border-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xl font-black">Progresso de Execução</CardTitle>
          <p className="text-xs text-muted-foreground">Complete as tarefas para subir seu score.</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-black text-primary">{progress}%</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                task.is_completed ? 'bg-primary/5 border-primary/20 opacity-70' : 'bg-white/5 border-white/5 hover:border-white/10'
              }`}
              onClick={() => toggleTask(task.id, task.is_completed)}
            >
              {task.is_completed ? (
                <CheckCircle2 className="w-5 h-5 text-primary" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
              <div className="flex-1">
                <p className={`text-sm font-bold ${task.is_completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {task.title}
                </p>
                <span className="text-[10px] uppercase font-bold tracking-tighter text-primary/70">{task.impact} Impacto</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
