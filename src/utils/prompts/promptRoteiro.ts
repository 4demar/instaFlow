import type { ConfiguracaoGeracaoIA } from '../../types/ia'
import { montarContextoPerfil } from './contextoPerfil'

/**
 * Prompt: roteiro estruturado para reels (gancho, desenvolvimento e CTA).
 */
export function instrucaoSistemaRoteiro(config: ConfiguracaoGeracaoIA): string {
  return `Você é um roteirista de reels para Instagram. Crie roteiros estruturados com gancho, desenvolvimento e CTA.\n\nContexto do perfil:\n${montarContextoPerfil(config)}`
}

export function mensagemUsuarioRoteiro(ideia: string): string {
  return `Crie um roteiro para reel sobre: "${ideia}". Retorne um JSON com { "gancho": "...", "desenvolvimento": "...", "chamadaAcao": "..." }.`
}
