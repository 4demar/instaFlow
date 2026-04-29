import { useEffect, useRef, useState, useCallback } from 'react'

interface OpcoesSalvamento<T> {
  dados: T
  aoSalvar: (dados: T) => Promise<void>
  intervaloMs?: number
  habilitado?: boolean
}

export function useSalvamentoAutomatico<T>({
  dados,
  aoSalvar,
  intervaloMs = 2000,
  habilitado = true,
}: OpcoesSalvamento<T>) {
  const [salvando, setSalvando] = useState(false)
  const [salvoEm, setSalvoEm] = useState<Date | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dadosRef = useRef(dados)
  const primeiraRenderizacao = useRef(true)

  dadosRef.current = dados

  const salvarAgora = useCallback(async () => {
    setSalvando(true)
    try {
      await aoSalvar(dadosRef.current)
      setSalvoEm(new Date())
    } catch {
      // Erro silencioso — o indicador visual não mostra "salvo"
    } finally {
      setSalvando(false)
    }
  }, [aoSalvar])

  useEffect(() => {
    if (primeiraRenderizacao.current) {
      primeiraRenderizacao.current = false
      return
    }
    if (!habilitado) return

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(salvarAgora, intervaloMs)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [dados, habilitado, intervaloMs, salvarAgora])

  return { salvando, salvoEm }
}
