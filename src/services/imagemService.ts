import OpenAI from 'openai'
import type { FormatoCriativo } from '../types/criativo'

export interface RespostaImagem {
  sucesso: boolean
  urlImagem?: string
  erro?: string
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

const MAPA_FORMATOS: Record<FormatoCriativo, { size: '1024x1024' | '1024x1792' }> = {
  '1080x1080': { size: '1024x1024' },
  '1080x1920': { size: '1024x1792' },
}

/**
 * Gera uma imagem usando DALL-E com base no prompt e formato.
 */
export async function gerarImagem(
  prompt: string,
  formato: FormatoCriativo
): Promise<RespostaImagem> {
  try {
    const config = MAPA_FORMATOS[formato]
    const resposta = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: config.size,
    })
    const url = resposta.data?.[0]?.url
    if (!url) {
      return { sucesso: false, erro: 'A IA não retornou uma imagem. Tente novamente.' }
    }
    return { sucesso: true, urlImagem: url }
  } catch (erro: unknown) {
    if (erro instanceof Error) {
      const msg = erro.message.toLowerCase()
      if (msg.includes('rate limit') || msg.includes('429')) {
        return { sucesso: false, erro: 'Limite de requisições atingido. Aguarde e tente novamente.' }
      }
      if (msg.includes('content_policy')) {
        return { sucesso: false, erro: 'O conteúdo solicitado viola as políticas. Tente outro prompt.' }
      }
    }
    return { sucesso: false, erro: 'Erro ao gerar imagem. Tente novamente mais tarde.' }
  }
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
