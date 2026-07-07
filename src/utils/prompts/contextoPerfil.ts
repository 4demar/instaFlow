import type { ConfiguracaoGeracaoIA } from '../../types/ia'

/**
 * Monta o bloco de contexto do perfil de marketing usado como base em todos os prompts.
 */
export function montarContextoPerfil(config: ConfiguracaoGeracaoIA): string {
  return `Nicho: ${config.nicho}\nPúblico-alvo: ${config.publicoAlvo}\nObjetivo: ${config.objetivo}\nTom de comunicação: ${config.tomComunicacao}`
}
