import { useContext } from 'react'
import { ContextoAutenticacao, type ContextoAutenticacaoTipo } from '../contexts/ContextoAutenticacao'

/**
 * Hook para consumir o contexto de autenticação.
 * Deve ser utilizado dentro de um ProvedorAutenticacao.
 */
export function useAutenticacao(): ContextoAutenticacaoTipo {
  const contexto = useContext(ContextoAutenticacao)
  if (!contexto) {
    throw new Error('useAutenticacao deve ser usado dentro de um ProvedorAutenticacao')
  }
  return contexto
}
