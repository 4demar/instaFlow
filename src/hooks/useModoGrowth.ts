import { useState, useCallback } from 'react'
import type { PostPlano } from '../types/planoSemanal'
import type { ConfiguracaoGeracaoIA } from '../services/iaService'
import { useGeracaoIA } from './useGeracaoIA'
import { usePosts } from './usePosts'
import type { FormatoPost } from '../types/post'

export function useModoGrowth() {
  const [plano, setPlano] = useState<PostPlano[]>([])
  const { gerarPlanoSemanal, carregando, erro } = useGeracaoIA()
  const { criar } = usePosts()

  const gerar = useCallback(async (config: ConfiguracaoGeracaoIA) => {
    const resultado = await gerarPlanoSemanal(config)
    if (resultado) {
      setPlano(resultado)
    }
  }, [gerarPlanoSemanal])

  const aprovarPost = useCallback((diaSemana: number) => {
    setPlano((prev) =>
      prev.map((p) => (p.diaSemana === diaSemana ? { ...p, aprovado: true } : p))
    )
  }, [])

  const rejeitarPost = useCallback((diaSemana: number) => {
    setPlano((prev) =>
      prev.map((p) => (p.diaSemana === diaSemana ? { ...p, aprovado: false } : p))
    )
  }, [])

  const aprovarPlano = useCallback(async () => {
    const aprovados = plano.filter((p) => p.aprovado)
    const hoje = new Date()
    const domingoAtual = new Date(hoje)
    domingoAtual.setDate(hoje.getDate() - hoje.getDay())

    for (const postPlano of aprovados) {
      const dataPost = new Date(domingoAtual)
      dataPost.setDate(domingoAtual.getDate() + postPlano.diaSemana)

      await criar({
        ideia: postPlano.ideia,
        legenda: postPlano.legenda,
        hashtags: postPlano.hashtags,
        formato: 'post' as FormatoPost,
        urlImagem: null,
        dataAgendamento: null,
      })
    }
  }, [plano, criar])

  return { plano, carregando, erro, gerar, aprovarPost, rejeitarPost, aprovarPlano }
}
