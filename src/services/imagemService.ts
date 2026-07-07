import type { FormatoCriativo } from '../types/criativo'
import { montarPromptImagem } from '../utils/prompts/promptImagem'
import { chamarGeminiImagem } from './geminiService'

export interface RespostaImagem {
  sucesso: boolean
  urlImagem?: string
  erro?: string
}

/**
 * Gera uma imagem usando o modelo Gemini de geração de imagens.
 */
export async function gerarImagem(
  prompt: string,
  formato: FormatoCriativo
): Promise<RespostaImagem> {
  const resposta = await chamarGeminiImagem(montarPromptImagem(prompt, formato))
  if (!resposta.sucesso || !resposta.dados) {
    return { sucesso: false, erro: resposta.erro }
  }
  return { sucesso: true, urlImagem: resposta.dados }
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
