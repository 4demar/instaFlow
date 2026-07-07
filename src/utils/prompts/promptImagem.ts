import type { FormatoCriativo } from '../../types/criativo'

interface DescricaoFormato {
  aspecto: string
  descricao: string
}

const MAPA_FORMATOS: Record<FormatoCriativo, DescricaoFormato> = {
  '1080x1080': { aspecto: '1:1', descricao: 'formato quadrado para post (proporção 1:1)' },
  '1080x1920': { aspecto: '9:16', descricao: 'formato vertical para story/reel (proporção 9:16)' },
}

/**
 * Retorna a descrição do formato usada para orientar a IA de geração de imagens.
 */
export function descricaoFormatoImagem(formato: FormatoCriativo): DescricaoFormato {
  return MAPA_FORMATOS[formato]
}

/**
 * Prompt: geração de imagem a partir de um prompt textual e formato desejado.
 */
export function montarPromptImagem(prompt: string, formato: FormatoCriativo): string {
  const config = descricaoFormatoImagem(formato)
  return `${prompt}\n\nGere a imagem no ${config.descricao}.`
}
