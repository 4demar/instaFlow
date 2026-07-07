import type { ConfiguracaoGeracaoIA } from '../../types/ia'
import { montarContextoPerfil } from './contextoPerfil'

/**
 * Prompt: geração de ideias de posts.
 */
export function instrucaoSistemaIdeias(config: ConfiguracaoGeracaoIA): string {
  return `Você é um especialista em marketing para Instagram. Gere ideias de posts criativas e relevantes.\n\nContexto do perfil:\n${montarContextoPerfil(config)}`
}

export function mensagemUsuarioIdeias(): string {
  return 'Gere 5 ideias de posts para Instagram. Retorne um JSON array de strings, sem explicações adicionais.'
}
