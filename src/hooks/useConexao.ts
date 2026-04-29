import { useContext } from 'react'
import { ContextoConexao, type ContextoConexaoTipo } from '../contexts/ContextoConexao'

export function useConexao(): ContextoConexaoTipo {
  return useContext(ContextoConexao)
}
