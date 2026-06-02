import type { FormatoCriativo } from '../types/criativo'

export interface RespostaImagem {
  sucesso: boolean
  urlImagem?: string
  erro?: string
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const GEMINI_MODELO_IMAGEM = 'gemini-2.5-flash-image-preview'
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models'

const MAPA_FORMATOS: Record<FormatoCriativo, { aspecto: string; descricao: string }> = {
  '1080x1080': { aspecto: '1:1', descricao: 'formato quadrado para post (proporção 1:1)' },
  '1080x1920': { aspecto: '9:16', descricao: 'formato vertical para story/reel (proporção 9:16)' },
}

interface ParteGemini {
  text?: string
  inlineData?: { mimeType?: string; data?: string }
}

interface RespostaGeminiImagem {
  candidates?: Array<{
    content?: { parts?: ParteGemini[] }
  }>
}

/**
 * Gera uma imagem usando o modelo Gemini de geração de imagens.
 */
export async function gerarImagem(
  prompt: string,
  formato: FormatoCriativo
): Promise<RespostaImagem> {
  try {
    if (!GEMINI_API_KEY) {
      return { sucesso: false, erro: 'Chave da API do Gemini não configurada.' }
    }

    const config = MAPA_FORMATOS[formato]
    const endpoint = `${GEMINI_BASE_URL}/${GEMINI_MODELO_IMAGEM}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`

    const promptCompleto = `${prompt}\n\nGere a imagem no ${config.descricao}.`

    const corpo = {
      contents: [
        {
          role: 'user',
          parts: [{ text: promptCompleto }],
        },
      ],
      generationConfig: {
        responseModalities: ['IMAGE'],
      },
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
    })

    if (!res.ok) {
      const texto = await res.text().catch(() => '')
      throw new Error(`${res.status} ${res.statusText} ${texto}`)
    }

    const json = (await res.json()) as RespostaGeminiImagem
    const partes = json?.candidates?.[0]?.content?.parts || []
    const parteImagem = partes.find((p) => p.inlineData?.data)

    if (parteImagem?.inlineData?.data) {
      const mime = parteImagem.inlineData.mimeType || 'image/png'
      return { sucesso: true, urlImagem: `data:${mime};base64,${parteImagem.inlineData.data}` }
    }

    return { sucesso: false, erro: 'A IA não retornou uma imagem. Tente novamente.' }
  } catch (erro: unknown) {
    return { sucesso: false, erro: tratarErroImagem(erro) }
  }
}

function tratarErroImagem(erro: unknown): string {
  if (erro instanceof Error) {
    const msg = erro.message.toLowerCase()
    if (msg.includes('rate limit') || msg.includes('429') || msg.includes('quota')) {
      return 'Limite de requisições atingido. Aguarde e tente novamente.'
    }
    if (msg.includes('safety') || msg.includes('policy') || msg.includes('blocked')) {
      return 'O conteúdo solicitado viola as políticas. Tente outro prompt.'
    }
    if (msg.includes('401') || msg.includes('403') || msg.includes('api key')) {
      return 'Chave de API inválida ou sem permissão. Verifique suas configurações.'
    }
    if (msg.includes('network') || msg.includes('fetch')) {
      return 'Erro de conexão. Verifique sua internet e tente novamente.'
    }
  }
  return 'Erro ao gerar imagem. Tente novamente mais tarde.'
}

/**
 * Retorna os formatos disponíveis para criativos.
 */
export function obterFormatos(): { valor: FormatoCriativo; rotulo: string }[] {
  return [
    { valor: '1080x1080', rotulo: 'Post quadrado (1080x1080)' },
    { valor: '1080x1920', rotulo: 'Story / Reel (1080x1920)' },
  ]
}
