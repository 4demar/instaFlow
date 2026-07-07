import type { ConfiguracaoGeracaoIA } from '../../types/ia'
import type { Metrica } from '../../types/metrica'
import { montarContextoPerfil } from './contextoPerfil'

/**
 * Prompt: sugestão de melhores horários de postagem.
 */
export function instrucaoSistemaHorarios(config: ConfiguracaoGeracaoIA): string {
  return `Você é um especialista em engajamento no Instagram. Sugira horários ideais de postagem.\n\nContexto do perfil:\n${montarContextoPerfil(config)}`
}

export function mensagemUsuarioHorarios(config: ConfiguracaoGeracaoIA, metricas: Metrica[]): string {
  const temMetricas = metricas.length > 0
  const base = temMetricas
    ? `Com base nestas métricas: ${JSON.stringify(
        metricas.map((m) => ({ curtidas: m.curtidas, comentarios: m.comentarios }))
      )}, sugira os melhores horários de postagem.`
    : `Não há métricas registradas. Sugira horários padrão baseados em boas práticas para o nicho "${config.nicho}".`

  return `${base} Retorne um JSON array com objetos { "diaSemana": 0-6, "horario": "HH:MM", "confianca": 0.0-1.0 }.`
}
