export interface DiagnosticAnswers {
  [key: string]: string;
}

export interface RuleResult {
  category: string;
  situation: string;
  impact: 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
  consequence: string;
  solution: string;
  priority: 'Baixa' | 'Média' | 'Alta' | 'Urgente';
}

export interface GrowthTask {
  title: string;
  description: string;
  impact: 'Baixo' | 'Médio' | 'Alto';
  difficulty: 'Baixa' | 'Média' | 'Alta';
  time: string;
}

export interface GrowthPlan {
  week1: GrowthTask[];
  week2: GrowthTask[];
  week3: GrowthTask[];
  week4: GrowthTask[];
}

export interface GrowthEngineResult {
  executive_summary: string;
  lost_opportunities: RuleResult[];
  bottlenecks: { problem: string; impact: string; order: number }[];
  priorities: { action: string; impact: string; difficulty: string; time: string; gain: string }[];
  growth_plan: GrowthPlan;
  scores: {
    authority: number;
    conversion: number;
    credibility: number;
    presence: number;
    general: number;
  };
  simulation: {
    current_score: number;
    projected_score: number;
    reasoning: string;
  };
  risks: string[];
  next_steps: string[];
  benchmark: {
    user_score: number;
    industry_avg: number;
    percentile: number;
  };
}
