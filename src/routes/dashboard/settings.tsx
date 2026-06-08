import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { useState } from "react"


export const Route = createFileRoute('/dashboard/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const { user, profile } = useAuth();
  const [name, setName] = useState(profile?.full_name || user?.user_metadata?.full_name || "");
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: name })
        .eq('id', user.id);
      
      if (error) throw error;
      toast.success("Perfil atualizado!");
    } catch (error: any) {
      toast.error("Erro ao atualizar: " + error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-foreground">Configurações</h1>
        <p className="text-muted-foreground mt-2 text-lg font-medium">Gerencie sua conta e preferências.</p>
      </div>

      <div className="space-y-6">
        <Card className="glass-card border-none overflow-hidden relative group">
          <CardHeader className="p-8 pb-0">
            <CardTitle className="text-2xl font-bold">Perfil</CardTitle>
            <CardDescription className="text-muted-foreground">Suas informações básicas de usuário.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" disabled value={user?.email || ""} className="bg-white/5 border-white/5 h-12 rounded-xl text-muted-foreground" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Nome Completo</Label>
              <Input 
                id="name" 
                placeholder="Seu nome" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-primary"
              />
            </div>
            <Button 
              className="bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl glow-primary"
              onClick={handleUpdateProfile}
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>

          </CardContent>
        </Card>

        <Card className="glass-card border-none overflow-hidden relative group border-l-4 border-l-red-500/50">
          <CardHeader className="p-8 pb-0">
            <CardTitle className="text-2xl font-bold text-red-500">Zona de Perigo</CardTitle>
            <CardDescription className="text-muted-foreground">Ações irreversíveis na sua conta.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Button variant="destructive" className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 h-12 rounded-xl font-bold">Excluir Minha Conta</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
