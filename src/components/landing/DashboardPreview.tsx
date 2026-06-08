import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, TrendingUp, History, CreditCard } from "lucide-react";

export default function DashboardPreview() {
  return (
    <section id="demo" className="py-24 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
            Seu novo <span className="text-primary">Centro de Comando</span>.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Uma interface pensada para quem não tem tempo a perder e quer resultados reais.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto group">
          {/* Decorative glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-accent/50 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative bg-black rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
            {/* Mock Dashboard Header */}
            <div className="border-b border-white/5 p-8 flex items-center justify-between">
              <div>
                <div className="h-6 w-32 bg-white/10 rounded mb-2"></div>
                <div className="h-4 w-48 bg-white/5 rounded"></div>
              </div>
              <div className="h-10 w-40 bg-primary/20 rounded-xl"></div>
            </div>

            {/* Mock Dashboard Content */}
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-32 bg-white/[0.03] rounded-2xl border border-white/5 p-4 space-y-4">
                    <div className="h-3 w-12 bg-white/10 rounded"></div>
                    <div className="h-8 w-20 bg-white/20 rounded"></div>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="h-64 bg-white/[0.03] rounded-3xl border border-white/5 p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-primary w-5 h-5" />
                    <div className="h-5 w-40 bg-white/10 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-white/5 rounded"></div>
                    <div className="h-4 w-[90%] bg-white/5 rounded"></div>
                    <div className="h-4 w-[80%] bg-white/5 rounded"></div>
                  </div>
                  <div className="h-12 w-full bg-white/10 rounded-xl mt-8"></div>
                </div>
                
                <div className="h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl border border-primary/10 p-6 flex flex-col justify-between">
                  <div className="h-6 w-32 bg-white/10 rounded"></div>
                  <div className="space-y-4">
                    <div className="h-4 w-full bg-white/5 rounded"></div>
                    <div className="h-12 w-full bg-primary/40 rounded-xl"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Overlay to make it feel like a preview */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
              <div className="bg-white text-black px-8 py-4 rounded-full font-black text-xl shadow-2xl scale-110 animate-pulse">
                PREVIEW REAL
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
