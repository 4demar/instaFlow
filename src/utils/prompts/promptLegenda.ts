import type { ConfiguracaoGeracaoIA } from '../../types/ia'
import { montarContextoPerfil } from './contextoPerfil'

/**
 * Prompt: geração de legenda com foco em conversão.
 */
export function instrucaoSistemaLegenda(config: ConfiguracaoGeracaoIA): string {
  return `Você é um copywriter especialista em Instagram. Crie legendas com foco em conversão, incluindo CTAs relevantes.\n\nContexto do perfil:\n${montarContextoPerfil(config)}`
}

export function mensagemUsuarioLegenda(ideia: string): string {
  return `Crie uma legenda para o seguinte post: "${ideia}". Retorne apenas o texto da legenda, sem JSON.`
}
