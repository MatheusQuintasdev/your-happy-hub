import { Link } from "@tanstack/react-router";
import { PulseScoreLogo } from "../landing/PulseScoreLogo";
import { LayoutDashboard, FilePlus, History, FileText, CreditCard, Settings, LogOut, Rocket, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FilePlus, label: "Novo Diagnóstico", href: "/dashboard/new" },
  { icon: History, label: "Histórico", href: "/dashboard/history" },
  { icon: Rocket, label: "Growth Engine", href: "/dashboard/advisor" },
  { icon: CreditCard, label: "Assinatura", href: "/dashboard/subscription" },
  { icon: Settings, label: "Configurações", href: "/dashboard/settings" },
];

export default function Sidebar({ currentPath }: { currentPath: string }) {
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Sessão encerrada");
      // Use window.location to force a clean state
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/";
    }
  };

  return (
    <aside className="w-64 border-r border-white/5 bg-background h-screen flex flex-col sticky top-0">
      <div className="p-6 border-b border-white/5">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <PulseScoreLogo className="w-8 h-8 text-primary transition-transform group-hover:scale-110" />
          <span className="text-xl font-bold text-foreground tracking-tight">Pulse<span className="text-primary">Score</span></span>
        </Link>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
              currentPath === item.href
                ? "bg-primary/10 text-primary shadow-[inset_0_0_12px_rgba(139,92,246,0.1)] border border-primary/20"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
            )}
          >
            <item.icon className={cn("w-5 h-5", currentPath === item.href ? "text-primary" : "text-muted-foreground")} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 w-full transition-colors group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Sair
        </button>
      </div>
    </aside>
  );
}
