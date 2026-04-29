import { useState, useCallback, useMemo } from 'react'
import type { Post } from '../types/post'

export function useCalendario(posts: Post[]) {
  const [mesAtual, setMesAtual] = useState(new Date())

  const avancarMes = useCallback(() => {
    setMesAtual((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }, [])

  const voltarMes = useCallback(() => {
    setMesAtual((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }, [])

  const diasDoMes = useMemo(() => {
    const ano = mesAtual.getFullYear()
    const mes = mesAtual.getMonth()
    const primeiroDia = new Date(ano, mes, 1)
    const ultimoDia = new Date(ano, mes + 1, 0)
    const dias: Date[] = []
    for (let d = 1; d <= ultimoDia.getDate(); d++) {
      dias.push(new Date(ano, mes, d))
    }
    return { dias, primeiroDiaSemana: primeiroDia.getDay(), totalDias: ultimoDia.getDate() }
  }, [mesAtual])

  const postsPorDia = useMemo(() => {
    const mapa: Record<string, Post[]> = {}
    posts.forEach((post) => {
      if (post.dataAgendamento) {
        const data = post.dataAgendamento.toDate()
        if (data.getMonth() === mesAtual.getMonth() && data.getFullYear() === mesAtual.getFullYear()) {
          const chave = data.getDate().toString()
          if (!mapa[chave]) mapa[chave] = []
          mapa[chave].push(post)
        }
      }
    })
    return mapa
  }, [posts, mesAtual])

  return { mesAtual, avancarMes, voltarMes, diasDoMes, postsPorDia }
}
