import type { ConfiguracaoGeracaoIA } from '../../types/ia'
import { montarContextoPerfil } from './contextoPerfil'

/**
 * Prompt: plano semanal com 7 posts (um por dia).
 */
export function instrucaoSistemaPlanoSemanal(config: ConfiguracaoGeracaoIA): string {
  return `Você é um estrategista de marketing para Instagram. Crie planos semanais completos.\n\nContexto do perfil:\n${montarContextoPerfil(config)}`
}

export function mensagemUsuarioPlanoSemanal(): string {
  return `Gere um plano semanal com 7 posts (um por dia, domingo=0 a sábado=6). Retorne um JSON array com objetos { "diaSemana": 0-6, "ideia": "...", "legenda": "...", "hashtags": ["..."], "horarioSugerido": "HH:MM", "aprovado": false }.`
}
