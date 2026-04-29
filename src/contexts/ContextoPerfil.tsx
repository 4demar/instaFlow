import { createContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { PerfilMarketing } from '../types/perfilMarketing'
import { obterPerfil, salvarPerfil, atualizarPerfil } from '../services/perfilService'
import { useAutenticacao } from '../hooks/useAutenticacao'

export interface ContextoPerfilTipo {
  perfil: PerfilMarketing | null
  carregando: boolean
  erro: string | null
  salvar: (dados: Omit<PerfilMarketing, 'id' | 'usuarioId' | 'atualizadoEm'>) => Promise<void>
  atualizar: (dados: Partial<Omit<PerfilMarketing, 'id' | 'usuarioId' | 'atualizadoEm'>>) => Promise<void>
}

export const ContextoPerfil = createContext<ContextoPerfilTipo | null>(null)

export function ProvedorPerfil({ children }: { children: ReactNode }) {
  const { usuario } = useAutenticacao()
  const [perfil, setPerfil] = useState<PerfilMarketing | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    if (!usuario) {
      setPerfil(null)
      return
    }
    setCarregando(true)
    obterPerfil(usuario.uid)
      .then(setPerfil)
      .catch(() => setErro('Erro ao carregar perfil.'))
      .finally(() => setCarregando(false))
  }, [usuario])

  const salvar = useCallback(async (dados: Omit<PerfilMarketing, 'id' | 'usuarioId' | 'atualizadoEm'>) => {
    if (!usuario) return
    try {
      setErro(null)
      await salvarPerfil(usuario.uid, dados)
      const atualizado = await obterPerfil(usuario.uid)
      setPerfil(atualizado)
    } catch {
      setErro('Erro ao salvar perfil.')
    }
  }, [usuario])

  const atualizar = useCallback(async (dados: Partial<Omit<PerfilMarketing, 'id' | 'usuarioId' | 'atualizadoEm'>>) => {
    if (!usuario) return
    try {
      setErro(null)
      await atualizarPerfil(usuario.uid, dados)
      const atualizado = await obterPerfil(usuario.uid)
      setPerfil(atualizado)
    } catch {
      setErro('Erro ao atualizar perfil.')
    }
  }, [usuario])

  return (
    <ContextoPerfil.Provider value={{ perfil, carregando, erro, salvar, atualizar }}>
      {children}
    </ContextoPerfil.Provider>
  )
}
