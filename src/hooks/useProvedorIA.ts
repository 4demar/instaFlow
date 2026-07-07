import { useCallback, useEffect, useState } from 'react'
import type { IdProvedorIA } from '../types/provedorIA'
import { PROVEDORES_IA, obterDefinicaoProvedor } from '../types/provedorIA'

const CHAVE_STORAGE_PROVEDOR = 'instaflow:provedorIA'
const PREFIXO_CHAVE_API = 'instaflow:chaveApi:'

function obterChaveDoAmbiente(id: IdProvedorIA): string {
  const definicao = obterDefinicaoProvedor(id)
  if (!definicao.chaveEnv) return ''
  const env = import.meta.env as Record<string, string | undefined>
  const valor = env[definicao.chaveEnv] ?? ''
  // Ignora placeholders comuns
  if (!valor || valor.length <= 5 || valor === '...' || valor.startsWith('sua-chave')) return ''
  return valor
}

function lerProvedorSalvo(): IdProvedorIA {
  const salvo = localStorage.getItem(CHAVE_STORAGE_PROVEDOR) as IdProvedorIA | null
  if (salvo && PROVEDORES_IA.some((p) => p.id === salvo)) return salvo
  return 'gemini'
}

function lerChaveApiSalva(id: IdProvedorIA): string {
  return localStorage.getItem(`${PREFIXO_CHAVE_API}${id}`) ?? obterChaveDoAmbiente(id)
}

export function useProvedorIA() {
  const [provedor, definirProvedorEstado] = useState<IdProvedorIA>(() => lerProvedorSalvo())
  const [chaveApi, definirChaveApiEstado] = useState<string>(() => lerChaveApiSalva(lerProvedorSalvo()))

  useEffect(() => {
    localStorage.setItem(CHAVE_STORAGE_PROVEDOR, provedor)
  }, [provedor])

  const definirProvedor = useCallback((id: IdProvedorIA) => {
    definirProvedorEstado(id)
    definirChaveApiEstado(lerChaveApiSalva(id))
  }, [])

  const definirChaveApi = useCallback(
    (valor: string) => {
      definirChaveApiEstado(valor)
      if (valor) {
        localStorage.setItem(`${PREFIXO_CHAVE_API}${provedor}`, valor)
      } else {
        localStorage.removeItem(`${PREFIXO_CHAVE_API}${provedor}`)
      }
    },
    [provedor]
  )

  const definicao = obterDefinicaoProvedor(provedor)
  const configurado = !definicao.requerChaveApi || chaveApi.trim().length > 0

  return {
    provedor,
    definirProvedor,
    chaveApi,
    definirChaveApi,
    definicao,
    configurado,
    provedoresDisponiveis: PROVEDORES_IA,
  }
}
