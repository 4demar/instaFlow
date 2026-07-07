import type { ConfiguracaoGeracaoIA } from '../../types/ia'
import type { Metrica } from '../../types/metrica'
import { montarContextoPerfil } from './contextoPerfil'

/**
 * Prompt: análise de métricas e sugestões de melhoria.
 */
export function instrucaoSistemaAnaliseDesempenho(config: ConfiguracaoGeracaoIA): string {
  return `Você é um analista de marketing para Instagram. Analise métricas e sugira melhorias.\n\nContexto do perfil:\n${montarContextoPerfil(config)}`
}

export function mensagemUsuarioAnaliseDesempenho(metricas: Metrica[]): string {
  const dadosMetricas = metricas.map((m) => ({
    curtidas: m.curtidas,
    comentarios: m.comentarios,
    alcance: m.alcance,
    salvamentos: m.salvamentos,
  }))
  return `Analise estas métricas e sugira melhorias: ${JSON.stringify(dadosMetricas)}. Retorne um JSON array com objetos { "categoria": "...", "descricao": "...", "prioridade": "alta"|"media"|"baixa" }.`
}
