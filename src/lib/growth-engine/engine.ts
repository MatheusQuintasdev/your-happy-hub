import { DiagnosticAnswers, GrowthEngineResult, RuleResult, GrowthTask } from './types';
import { CATEGORY_RULES, TASK_LIBRARY } from './rules';

export function runGrowthEngine(
  companyName: string,
  industry: string,
  score: number,
  answers: DiagnosticAnswers
): GrowthEngineResult {
  // 1. Map Opportunities based on rules
  const lost_opportunities: RuleResult[] = [];
  Object.keys(CATEGORY_RULES).forEach(key => {
    const result = CATEGORY_RULES[key](answers);
    if (result) lost_opportunities.push(result);
  });

  // 2. Identify Bottlenecks (Highest impact issues)
  const bottlenecks = lost_opportunities
    .filter(o => o.priority === 'Urgente' || o.priority === 'Alta')
    .slice(0, 3)
    .map((o, idx) => ({
      problem: o.situation,
      impact: o.consequence,
      order: idx + 1
    }));

  // 3. Define Priorities (Top 5 quick wins)
  const priorities = lost_opportunities
    .slice(0, 5)
    .map(o => ({
      action: o.solution,
      impact: o.impact,
      difficulty: 'Baixa',
      time: '20min',
      gain: 'Aumento imediato de confiança'
    }));

  // 4. Build 30-Day Growth Plan
  const allPossibleTasks: GrowthTask[] = [];
  if (answers['g1'] === 'Não' || answers['g2'] === 'Não') allPossibleTasks.push(...TASK_LIBRARY.google);
  if (answers['i1'] === 'Não' || answers['i2'] === 'Não') allPossibleTasks.push(...TASK_LIBRARY.instagram);
  if (answers['w1'] === 'Não') allPossibleTasks.push(...TASK_LIBRARY.whatsapp);
  allPossibleTasks.push(...TASK_LIBRARY.geral);

  const growth_plan = {
    week1: allPossibleTasks.slice(0, 3),
    week2: allPossibleTasks.slice(3, 6),
    week3: allPossibleTasks.slice(6, 9),
    week4: allPossibleTasks.slice(9, 12),
  };

  // 5. Calculate Sub-scores
  const calculateSubScore = (ids: string[]) => {
    const total = ids.length * 10;
    const current = ids.reduce((acc, id) => acc + (answers[id] === 'Sim' ? 10 : 0), 0);
    return Math.round((current / total) * 100) || 0;
  };

  const scores = {
    authority: calculateSubScore(['g1', 'g2']),
    conversion: calculateSubScore(['i2', 'w1']),
    credibility: calculateSubScore(['r1', 's1']),
    presence: calculateSubScore(['i1', 'seo1']),
    general: score
  };

  // 6. Generate Executive Summary
  const executive_summary = `Baseado na análise da ${companyName}, identificamos que sua presença digital possui um score de ${score}/100. O maior gargalo atual é ${bottlenecks[0]?.problem || 'a falta de consistência digital'}. Se corrigido, estimamos um salto para ${Math.min(100, score + 25)} pontos em 30 dias.`;

  // 7. Benchmark
  const industry_avg = 58; // Mocked avg for now, but following logic
  const percentile = score > industry_avg ? 70 + Math.round(score/10) : 30 + Math.round(score/10);

  return {
    executive_summary,
    lost_opportunities,
    bottlenecks,
    priorities,
    growth_plan,
    scores,
    simulation: {
      current_score: score,
      projected_score: Math.min(100, score + 25),
      reasoning: "Implementando as melhorias de Google e Instagram, sua visibilidade aumentará drasticamente."
    },
    risks: [
      "Perda de autoridade frente a novos concorrentes",
      "Dificuldade de conversão por falta de canais diretos",
      "Baixa retenção orgânica"
    ],
    next_steps: [
      "Atualizar link da Bio no Instagram",
      "Responder avaliações pendentes",
      "Configurar WhatsApp Business"
    ],
    benchmark: {
      user_score: score,
      industry_avg,
      percentile
    }
  };
}
