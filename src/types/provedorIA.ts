export type IdProvedorIA = 'gemini' | 'groq' | 'openrouter' | 'huggingface' | 'transformers'

export interface DefinicaoProvedor {
  id: IdProvedorIA
  nome: string
  descricao: string
  requerChaveApi: boolean
  urlObterChave?: string
  chaveEnv?: string
}

export interface ParteMultimodalProvedor {
  texto?: string
  imagemInline?: {
    tipoMime: string
    dadosBase64: string
  }
}

export interface OpcoesGeracaoProvedor {
  temperatura?: number
  maxTokens?: number
}

export interface RespostaProvedor<T> {
  sucesso: boolean
  dados?: T
  erro?: string
}

export type FuncaoChamadaProvedor = (
  instrucaoSistema: string,
  partes: ParteMultimodalProvedor[],
  opcoes?: OpcoesGeracaoProvedor,
  chaveApi?: string
) => Promise<RespostaProvedor<string>>

export const PROVEDORES_IA: DefinicaoProvedor[] = [
  {
    id: 'gemini',
    nome: 'Gemini API',
    descricao: 'Google Gemini 2.0 Flash. Free tier com limites baixos.',
    requerChaveApi: true,
    urlObterChave: 'https://aistudio.google.com/apikey',
    chaveEnv: 'VITE_GEMINI_API_KEY',
  },
  {
    id: 'groq',
    nome: 'Groq (API cloud)',
    descricao: 'Llama vision via Groq. Free tier generoso e inferência rápida.',
    requerChaveApi: true,
    urlObterChave: 'https://console.groq.com/keys',
    chaveEnv: 'VITE_GROQ_API_KEY',
  },
  {
    id: 'openrouter',
    nome: 'OpenRouter (modelos free)',
    descricao: 'Roteador para múltiplos modelos gratuitos com uma única chave.',
    requerChaveApi: true,
    urlObterChave: 'https://openrouter.ai/keys',
    chaveEnv: 'VITE_OPENROUTER_API_KEY',
  },
  {
    id: 'huggingface',
    nome: 'Hugging Face Inference API',
    descricao: 'Modelos vision via HF Router. Free tier limitado por horário.',
    requerChaveApi: true,
    urlObterChave: 'https://huggingface.co/settings/tokens',
    chaveEnv: 'VITE_HUGGINGFACE_API_KEY',
  },
  {
    id: 'transformers',
    nome: 'Transformers.js (offline no navegador)',
    descricao: 'Roda um modelo pequeno de captioning direto no seu browser. Zero API, primeira carga baixa ~300MB.',
    requerChaveApi: false,
  },
]

export function obterDefinicaoProvedor(id: IdProvedorIA): DefinicaoProvedor {
  const def = PROVEDORES_IA.find((p) => p.id === id)
  if (!def) throw new Error(`Provedor de IA desconhecido: ${id}`)
  return def
}
