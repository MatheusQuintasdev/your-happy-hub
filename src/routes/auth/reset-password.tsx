import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PulseScoreLogo } from '@/components/landing/PulseScoreLogo'
import { toast } from "sonner"
import { Mail, ArrowLeft, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/auth/reset-password')({
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth/update-password',
      });
      if (error) throw error;
      toast.success("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar e-mail de recuperação");
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
          <CardTitle className="text-2xl font-bold text-white">Recuperar Senha</CardTitle>
          <CardDescription>Insira seu e-mail para receber um link de recuperação.</CardDescription>
        </CardHeader>

        <form onSubmit={handleReset} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                id="email" 
                type="email" 
                placeholder="voce@exemplo.com" 
                className="bg-white/5 border-white/5 pl-10 h-12 rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <Button className="w-full bg-primary hover:bg-primary/90 text-white h-12 rounded-xl font-bold glow-primary" disabled={loading}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enviar Link de Recuperação"}
          </Button>
        </form>

        <button 
          onClick={() => navigate({ to: '/auth' })}
          className="mt-6 flex items-center justify-center gap-2 text-muted-foreground hover:text-white transition-colors text-sm font-medium w-full"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para o Login
        </button>
      </Card>
    </div>
  );
}
