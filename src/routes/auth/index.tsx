import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PulseScoreLogo } from '@/components/landing/PulseScoreLogo'
import { toast } from "sonner"
import { lovable } from '@/integrations/lovable'
import { LogIn, UserPlus, Mail, Lock, Chrome, Github, ArrowLeft, Loader2, Apple, Eye, EyeOff } from 'lucide-react'

export const Route = createFileRoute('/auth/')({
  component: AuthPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect: (search.redirect as string) || undefined,
    }
  },
})

function AuthPage() {
  const navigate = useNavigate();
  const searchParams = Route.useSearch() as { redirect?: string };
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        if (searchParams.redirect) {
          window.location.href = searchParams.redirect;
        } else {
          navigate({ to: '/dashboard' });
        }
      }
    });
  }, [navigate, searchParams.redirect]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success("Login realizado com sucesso!");
      if (searchParams.redirect) {
        window.location.href = searchParams.redirect;
      } else {
        navigate({ to: '/dashboard' });
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: window.location.origin + '/auth/callback',
        },
      });
      if (error) throw error;
      toast.success("Conta criada! Verifique seu e-mail para confirmar.");
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'apple' | 'microsoft') => {
    try {
      const { error } = await lovable.auth.signInWithOAuth(provider as any);
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || `Erro ao entrar com ${provider}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090A] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px]" />

      <div className="mb-8 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <PulseScoreLogo className="w-10 h-10 text-primary" />
          <span className="text-3xl font-black text-white tracking-tight">Pulse<span className="text-primary">Score</span></span>
        </div>
        <p className="text-muted-foreground font-medium">Sua jornada para a elite digital começa aqui.</p>
      </div>

      <Card className="w-full max-w-md glass-card border-white/5 relative z-10">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 p-1 rounded-t-xl">
            <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">Entrar</TabsTrigger>
            <TabsTrigger value="signup" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">Criar Conta</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="p-6 space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold text-white">Bem-vindo de volta</h2>
              <p className="text-sm text-muted-foreground">Escolha sua forma preferida de entrar.</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                className="glass border-white/10 hover:bg-white/5 h-12 rounded-xl p-0"
                onClick={() => handleOAuthLogin('google')}
                title="Entrar com Google"
              >
                <Chrome className="w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                className="glass border-white/10 hover:bg-white/5 h-12 rounded-xl p-0"
                onClick={() => handleOAuthLogin('apple')}
                title="Entrar com Apple"
              >
                <Apple className="w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                className="glass border-white/10 hover:bg-white/5 h-12 rounded-xl p-0"
                onClick={() => handleOAuthLogin('microsoft')}
                title="Entrar com Microsoft"
              >
                <LogIn className="w-5 h-5" />
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/5" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#18181B] px-2 text-muted-foreground">Ou use seu e-mail</span>
              </div>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-4">
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
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Senha</Label>
                  <button 
                    type="button" 
                    className="text-xs text-primary hover:underline"
                    onClick={() => navigate({ to: '/auth/reset-password' })}
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="bg-white/5 border-white/5 pl-10 pr-10 h-12 rounded-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white h-12 rounded-xl font-bold glow-primary" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar no Painel"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="p-6 space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold text-white">Criar sua conta</h2>
              <p className="text-sm text-muted-foreground">Comece a dominar o mercado local hoje.</p>
            </div>

            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Nome Completo</Label>
                <Input 
                  id="signup-name" 
                  placeholder="Seu Nome" 
                  className="bg-white/5 border-white/5 h-12 rounded-xl"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">E-mail</Label>
                <Input 
                  id="signup-email" 
                  type="email" 
                  placeholder="voce@exemplo.com" 
                  className="bg-white/5 border-white/5 h-12 rounded-xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Senha</Label>
                <div className="relative">
                  <Input 
                    id="signup-password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Mínimo 8 caracteres" 
                    className="bg-white/5 border-white/5 h-12 rounded-xl pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white h-12 rounded-xl font-bold glow-primary" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Criar Minha Conta"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/5" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#18181B] px-2 text-muted-foreground">Ou continue com</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                className="glass border-white/10 hover:bg-white/5 h-12 rounded-xl p-0"
                onClick={() => handleOAuthLogin('google')}
                title="Entrar com Google"
              >
                <Chrome className="w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                className="glass border-white/10 hover:bg-white/5 h-12 rounded-xl p-0"
                onClick={() => handleOAuthLogin('apple')}
                title="Entrar com Apple"
              >
                <Apple className="w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                className="glass border-white/10 hover:bg-white/5 h-12 rounded-xl p-0"
                onClick={() => handleOAuthLogin('microsoft')}
                title="Entrar com Microsoft"
              >
                <LogIn className="w-5 h-5" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      <button 
        onClick={() => navigate({ to: '/' })}
        className="mt-8 flex items-center gap-2 text-muted-foreground hover:text-white transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar para o início
      </button>
    </div>
  );
}
