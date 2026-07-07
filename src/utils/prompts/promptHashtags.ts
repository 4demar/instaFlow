import type { ConfiguracaoGeracaoIA } from '../../types/ia'
import { montarContextoPerfil } from './contextoPerfil'

/**
 * Prompt: sugestão de hashtags categorizadas por relevância.
 */
export function instrucaoSistemaHashtags(config: ConfiguracaoGeracaoIA): string {
  return `Você é um especialista em hashtags para Instagram. Sugira hashtags categorizadas por relevância.\n\nContexto do perfil:\n${montarContextoPerfil(config)}`
}

export function mensagemUsuarioHashtags(conteudo: string): string {
  return `Sugira 15 hashtags para o conteúdo: "${conteudo}". Retorne um JSON array com objetos { "texto": "#hashtag", "relevancia": "alta"|"media"|"baixa" }.`
}
