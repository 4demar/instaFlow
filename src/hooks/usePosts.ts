import { useContext } from 'react'
import { ContextoPosts, type ContextoPostsTipo } from '../contexts/ContextoPosts'

export function usePosts(): ContextoPostsTipo {
  const contexto = useContext(ContextoPosts)
  if (!contexto) {
    throw new Error('usePosts deve ser usado dentro de um ProvedorPosts')
  }
  return contexto
}
