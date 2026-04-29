import { useState, useCallback } from 'react'
import { useAutenticacao } from './useAutenticacao'
import * as metricaService from '../services/metricaService'
import type { Metrica } from '../types/metrica'

export function useMetricas() {
  const { usuario } = useAutenticacao()
  const [metricas, setMetricas] = useState<Metrica[]>([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const carregarPorPost = useCallback(async (postId: string) => {
    if (!usuario) return
    setCarregando(true)
    try {
      const lista = await metricaService.obterMetricasPorPost(usuario.uid, postId)
      setMetricas(lista)
    } catch {
      setErro('Erro ao carregar métricas.')
    } finally {
      setCarregando(false)
    }
  }, [usuario])

  const carregarTodas = useCallback(async () => {
    if (!usuario) return
    setCarregando(true)
    try {
      const lista = await metricaService.obterTodasMetricas(usuario.uid)
      setMetricas(lista)
    } catch {
      setErro('Erro ao carregar métricas.')
    } finally {
      setCarregando(false)
    }
  }, [usuario])

  const registrar = useCallback(async (dados: Omit<Metrica, 'id' | 'registradoEm'>) => {
    if (!usuario) return
    await metricaService.registrarMetrica(usuario.uid, dados)
  }, [usuario])

  const atualizar = useCallback(async (metricaId: string, dados: Partial<Omit<Metrica, 'id' | 'postId' | 'registradoEm'>>) => {
    if (!usuario) return
    await metricaService.atualizarMetrica(usuario.uid, metricaId, dados)
  }, [usuario])

  const resumo = metricaService.obterResumoMetricas(metricas)

  return { metricas, resumo, carregando, erro, carregarPorPost, carregarTodas, registrar, atualizar }
}
