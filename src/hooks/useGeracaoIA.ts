import { useState, useCallback } from 'react'
import type { ConfiguracaoGeracaoIA, RespostaIA } from '../services/iaService'
import * as iaService from '../services/iaService'
import type { Roteiro } from '../types/roteiro'
import type { HashtagSugerida } from '../types/hashtag'
import type { VariacaoConteudo, SugestaoMelhoria, HorarioSugerido } from '../types/ia'
import type { PostPlano } from '../types/planoSemanal'
import type { Metrica } from '../types/metrica'

export function useGeracaoIA() {
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function executar<T>(chamada: () => Promise<RespostaIA<T>>): Promise<T | null> {
    setCarregando(true)
    setErro(null)
    try {
      const resposta = await chamada()
      if (!resposta.sucesso) {
        setErro(resposta.erro ?? 'Erro desconhecido.')
        return null
      }
      return resposta.dados ?? null
    } catch {
      setErro('Erro ao se comunicar com a IA.')
      return null
    } finally {
      setCarregando(false)
    }
  }

  const gerarIdeias = useCallback((config: ConfiguracaoGeracaoIA) =>
    executar(() => iaService.gerarIdeias(config)), [])

  const gerarLegenda = useCallback((config: ConfiguracaoGeracaoIA, ideia: string) =>
    executar(() => iaService.gerarLegenda(config, ideia)), [])

  const gerarHashtags = useCallback((config: ConfiguracaoGeracaoIA, conteudo: string) =>
    executar<HashtagSugerida[]>(() => iaService.gerarHashtags(config, conteudo)), [])

  const gerarRoteiro = useCallback((config: ConfiguracaoGeracaoIA, ideia: string) =>
    executar<Roteiro>(() => iaService.gerarRoteiro(config, ideia)), [])

  const gerarVariacoes = useCallback((config: ConfiguracaoGeracaoIA, ideia: string) =>
    executar<VariacaoConteudo[]>(() => iaService.gerarVariacoes(config, ideia)), [])

  const gerarPlanoSemanal = useCallback((config: ConfiguracaoGeracaoIA) =>
    executar<PostPlano[]>(() => iaService.gerarPlanoSemanal(config)), [])

  const analisarDesempenho = useCallback((config: ConfiguracaoGeracaoIA, metricas: Metrica[]) =>
    executar<SugestaoMelhoria[]>(() => iaService.analisarDesempenho(config, metricas)), [])

  const sugerirHorarios = useCallback((config: ConfiguracaoGeracaoIA, metricas: Metrica[]) =>
    executar<HorarioSugerido[]>(() => iaService.sugerirHorarios(config, metricas)), [])

  const limparErro = useCallback(() => setErro(null), [])

  return {
    carregando, erro, limparErro,
    gerarIdeias, gerarLegenda, gerarHashtags, gerarRoteiro,
    gerarVariacoes, gerarPlanoSemanal, analisarDesempenho, sugerirHorarios,
  }
}
