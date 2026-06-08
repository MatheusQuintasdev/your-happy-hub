import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PulseScoreLogo } from '@/components/landing/PulseScoreLogo'
import { toast } from "sonner"
import { Lock, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/auth/update-password')({
  component: UpdatePasswordPage,
})

function UpdatePasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      if (error) throw error;
      toast.success("Senha atualizada com sucesso!");
      navigate({ to: '/dashboard' });
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar senha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090A] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px]" />

      <Card className="w-full max-w-md glass-card border-white/5 relative z-10 p-6">
        <CardHeader className="text-center space-y-2 pb-8">
          <div className="flex justify-center mb-4">
            <PulseScoreLogo className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Nova Senha</CardTitle>
          <CardDescription>Digite sua nova senha abaixo.</CardDescription>
        </CardHeader>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password">Nova Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                id="password" 
                type="password" 
                placeholder="Mínimo 8 caracteres" 
                className="bg-white/5 border-white/5 pl-10 h-12 rounded-xl"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
          </div>
          
          <Button className="w-full bg-primary hover:bg-primary/90 text-white h-12 rounded-xl font-bold glow-primary" disabled={loading}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Atualizar Senha"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
