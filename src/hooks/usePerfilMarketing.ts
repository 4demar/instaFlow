import { useContext } from 'react'
import { ContextoPerfil, type ContextoPerfilTipo } from '../contexts/ContextoPerfil'

export function usePerfilMarketing(): ContextoPerfilTipo {
  const contexto = useContext(ContextoPerfil)
  if (!contexto) {
    throw new Error('usePerfilMarketing deve ser usado dentro de um ProvedorPerfil')
  }
  return contexto
}
