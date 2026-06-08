import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { lovable } from "@/integrations/lovable";
import { LogIn } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export default function LoginButton() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate({ to: '/auth' });
  };

  if (loading) return null;

  return (
    <Button onClick={handleLogin} className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 glow-primary font-bold">
      <LogIn className="w-4 h-4 mr-2" />
      Entrar com Google
    </Button>
  );
}
