// Tipos para as mensagens do Slack
interface SlackMessage {
  text: string;
  attachments?: Array<{
    color: string;
    fields?: Array<{
      title: string;
      value: string;
      short?: boolean;
    }>;
    footer?: string;
    ts?: number;
  }>;
  blocks?: Array<any>;
}

/*
      ============================================
      OPÇÕES DE CORES E FORMATAÇÃO NO SLACK
      ============================================
      
      1. CORES PREDEFINIDAS:
         - "good" (verde) - para sucessos
         - "warning" (amarelo) - para avisos
         - "danger" (vermelho) - para erros
      
      2. CORES PERSONALIZADAS:
         - Use códigos hex como "#36a64f", "#9c27b0", etc.
      
      3. FORMATAÇÃO DE TEXTO:
         - *negrito* - texto em negrito
         - _itálico_ - texto em itálico
         - ~riscado~ - texto riscado
         - `código` - texto monoespaçado
         - ```bloco de código``` - bloco de código
      
      4. EMOJIS:
         - Use emojis para tornar as mensagens mais visuais
         - Ex: 🎉, ⚠️, ❌, ✅, 💳, 🕒
      
      5. ESCOLHA DA ABORDAGEM:
         - Attachments: Melhor para campos estruturados
         - Block Kit: Mais moderno e flexível
         - Markdown simples: Mais direto e rápido
      */

// Cores disponíveis no Slack
export const SLACK_COLORS = {
  SUCCESS: "good", // Verde - para sucessos
  WARNING: "warning", // Amarelo - para avisos
  DANGER: "danger", // Vermelho - para erros
  INFO: "#36a64f", // Verde customizado - para informações
  PURPLE: "#9c27b0", // Roxo - para produtos premium
  BLUE: "#2196f3", // Azul - para informações gerais
  ORANGE: "#ff9800", // Laranja - para ações pendentes
  GRAY: "#9e9e9e", // Cinza - para informações neutras
} as const;

export function createColoredMessage(
  title: string,
  color: string,
  fields: Array<{ title: string; value: string; short?: boolean }>,
  footer?: string
): SlackMessage {
  return {
    text: title,
    attachments: [
      {
        color,
        fields,
        footer: footer || "Sistema de Vendas",
        ts: Math.floor(Date.now() / 1000),
      },
    ],
  };
}
