import { DiagnosticAnswers, RuleResult, GrowthTask } from './types';

export const CATEGORY_RULES: Record<string, (answers: DiagnosticAnswers) => RuleResult | null> = {
  g1: (answers) => answers['g1'] === 'Não' ? {
    category: 'Google Meu Negócio',
    situation: 'Empresa não visível no Google Maps.',
    impact: 'Crítico',
    consequence: 'Perda total de tráfego local e clientes próximos.',
    solution: 'Criar e verificar imediatamente sua ficha no Google Meu Negócio.',
    priority: 'Urgente'
  } : null,
  
  g2: (answers) => answers['g2'] === 'Não' ? {
    category: 'Google Meu Negócio',
    situation: 'Menos de 20 avaliações no perfil.',
    impact: 'Alto',
    consequence: 'Baixa prova social comparado aos concorrentes.',
    solution: 'Implementar processo de solicitação de avaliações após cada venda.',
    priority: 'Alta'
  } : null,

  i1: (answers) => answers['i1'] === 'Não' ? {
    category: 'Instagram',
    situation: 'Frequência de postagem baixa (menos de 3x/semana).',
    impact: 'Médio',
    consequence: 'Perda de relevância no algoritmo e esquecimento pelos seguidores.',
    solution: 'Estabelecer calendário editorial com pelo menos 3 posts semanais.',
    priority: 'Média'
  } : null,

  i2: (answers) => answers['i2'] === 'Não' ? {
    category: 'Instagram',
    situation: 'Falta de link direto para WhatsApp na Bio.',
    impact: 'Crítico',
    consequence: 'Dificulta o contato do cliente, reduzindo conversões.',
    solution: 'Adicionar link do WhatsApp ou árvore de links na Bio hoje mesmo.',
    priority: 'Urgente'
  } : null,

  s1: (answers) => answers['s1'] === 'Não' ? {
    category: 'Site',
    situation: 'Não possui site próprio.',
    impact: 'Alto',
    consequence: 'Dependência total de redes sociais e falta de autoridade profissional.',
    solution: 'Desenvolver uma Landing Page focada em conversão.',
    priority: 'Alta'
  } : null,

  w1: (answers) => answers['w1'] === 'Não' ? {
    category: 'WhatsApp',
    situation: 'Uso de WhatsApp pessoal para negócios.',
    impact: 'Médio',
    consequence: 'Falta de recursos profissionais (catálogo, mensagens automáticas).',
    solution: 'Migrar para WhatsApp Business e configurar perfil comercial.',
    priority: 'Média'
  } : null,

  seo1: (answers) => answers['seo1'] === 'Não' ? {
    category: 'SEO',
    situation: 'Não aparece na primeira página para serviços chave.',
    impact: 'Alto',
    consequence: 'Clientes encontram o concorrente antes de você.',
    solution: 'Otimizar ficha do Google e palavras-chave do site/redes.',
    priority: 'Alta'
  } : null,

  r1: (answers) => answers['r1'] === 'Não' ? {
    category: 'Avaliações',
    situation: 'Avaliações não respondidas.',
    impact: 'Médio',
    consequence: 'Passa imagem de desatenção ao cliente e descaso.',
    solution: 'Responder todas as avaliações (boas e ruins) em até 24h.',
    priority: 'Média'
  } : null,
};

export const TASK_LIBRARY: Record<string, GrowthTask[]> = {
  google: [
    { title: 'Verificar ficha GMB', description: 'Garantir que a empresa está verificada no Google.', impact: 'Alto', difficulty: 'Baixa', time: '10min' },
    { title: 'Otimizar fotos GMB', description: 'Adicionar 5 fotos reais e recentes do local/serviço.', impact: 'Médio', difficulty: 'Baixa', time: '15min' },
    { title: 'Solicitar 5 avaliações', description: 'Enviar link para 5 clientes fiéis hoje.', impact: 'Alto', difficulty: 'Baixa', time: '15min' }
  ],
  instagram: [
    { title: 'Ajustar Bio', description: 'Colocar promessa clara e link de contato.', impact: 'Alto', difficulty: 'Baixa', time: '10min' },
    { title: 'Criar 3 destaques', description: 'Sobre nós, Serviços e Clientes.', impact: 'Médio', difficulty: 'Média', time: '30min' },
    { title: 'Post de Prova Social', description: 'Compartilhar um depoimento de cliente nos stories/feed.', impact: 'Alto', difficulty: 'Baixa', time: '15min' }
  ],
  whatsapp: [
    { title: 'Mensagem de Saudação', description: 'Configurar resposta automática no Business.', impact: 'Médio', difficulty: 'Baixa', time: '5min' },
    { title: 'Catálogo de Produtos', description: 'Cadastrar seus 3 principais serviços/produtos.', impact: 'Alto', difficulty: 'Média', time: '20min' }
  ],
  geral: [
    { title: 'Portfólio em PDF', description: 'Criar apresentação simples dos serviços.', impact: 'Médio', difficulty: 'Média', time: '45min' },
    { title: 'Definir ICP', description: 'Listar 3 características do seu cliente ideal.', impact: 'Alto', difficulty: 'Baixa', time: '20min' }
  ]
};
