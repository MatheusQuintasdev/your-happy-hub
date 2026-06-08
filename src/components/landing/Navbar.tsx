import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import LoginButton from "../auth/LoginButton";
import { Link } from "@tanstack/react-router";
import { PulseScoreLogo } from "./PulseScoreLogo";

export default function Navbar() {
  const { user, loading } = useAuth();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Navbar height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="border-b border-white/5 bg-background/60 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <PulseScoreLogo className="w-8 h-8 text-primary transition-transform group-hover:scale-110" />
          <span className="text-2xl font-bold text-foreground tracking-tight">Pulse<span className="text-primary">Score</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <button 
            onClick={() => scrollToSection('how-it-works')} 
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Como Funciona
          </button>
          <button 
            onClick={() => scrollToSection('features')} 
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Benefícios
          </button>
          <button 
            onClick={() => scrollToSection('faq')} 
            className="hover:text-primary transition-colors cursor-pointer"
          >
            FAQ
          </button>
          <button 
            onClick={() => scrollToSection('pricing')} 
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Preços
          </button>
        </div>

        <div className="flex items-center gap-4">
          {!loading && (
            <>
              {user ? (
                <Link to="/dashboard">
                  <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 glow-primary font-bold">
                    Painel de Controle
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/auth">
                    <Button variant="ghost" className="text-muted-foreground hover:text-primary font-bold">
                      Login
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 glow-primary font-bold">
                      Começar Agora
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
