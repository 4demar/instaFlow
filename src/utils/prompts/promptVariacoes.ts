import type { ConfiguracaoGeracaoIA } from '../../types/ia'
import { montarContextoPerfil } from './contextoPerfil'

/**
 * Prompt: variações de conteúdo em múltiplos formatos (post, story, reel).
 */
export function instrucaoSistemaVariacoes(config: ConfiguracaoGeracaoIA): string {
  return `Você é um estrategista de conteúdo para Instagram. Expanda ideias em múltiplos formatos.\n\nContexto do perfil:\n${montarContextoPerfil(config)}`
}

export function mensagemUsuarioVariacoes(ideia: string): string {
  return `Expanda a ideia "${ideia}" em 3 variações (post, story, reel). Retorne um JSON array com objetos { "formato": "post"|"story"|"reel", "legenda": "...", "hashtags": ["..."] }.`
}
