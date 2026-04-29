import { createContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { Post, StatusPost } from '../types/post'
import * as postService from '../services/postService'
import { useAutenticacao } from '../hooks/useAutenticacao'

export interface ContextoPostsTipo {
  posts: Post[]
  carregando: boolean
  erro: string | null
  criar: (dados: Omit<Post, 'id' | 'usuarioId' | 'status' | 'criadoEm' | 'atualizadoEm' | 'dataPublicacao'>) => Promise<string>
  atualizar: (postId: string, dados: Partial<Omit<Post, 'id' | 'usuarioId' | 'criadoEm'>>) => Promise<void>
  excluir: (postId: string) => Promise<void>
  alterarStatus: (postId: string, status: StatusPost, dataAgendamento?: Date) => Promise<void>
  recarregar: () => Promise<void>
  filtrarPorStatus: (status: StatusPost) => Post[]
}

export const ContextoPosts = createContext<ContextoPostsTipo | null>(null)

export function ProvedorPosts({ children }: { children: ReactNode }) {
  const { usuario } = useAutenticacao()
  const [posts, setPosts] = useState<Post[]>([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    if (!usuario) return
    setCarregando(true)
    try {
      const lista = await postService.listarPosts(usuario.uid)
      setPosts(lista)
      setErro(null)
    } catch {
      setErro('Erro ao carregar posts.')
    } finally {
      setCarregando(false)
    }
  }, [usuario])

  useEffect(() => {
    if (usuario) carregar()
    else setPosts([])
  }, [usuario, carregar])

  const criar = useCallback(async (dados: Omit<Post, 'id' | 'usuarioId' | 'status' | 'criadoEm' | 'atualizadoEm' | 'dataPublicacao'>) => {
    if (!usuario) throw new Error('Usuário não autenticado.')
    const id = await postService.criarPost(usuario.uid, dados)
    await carregar()
    return id
  }, [usuario, carregar])

  const atualizar = useCallback(async (postId: string, dados: Partial<Omit<Post, 'id' | 'usuarioId' | 'criadoEm'>>) => {
    if (!usuario) return
    await postService.atualizarPost(usuario.uid, postId, dados)
    await carregar()
  }, [usuario, carregar])

  const excluir = useCallback(async (postId: string) => {
    if (!usuario) return
    await postService.excluirPost(usuario.uid, postId)
    await carregar()
  }, [usuario, carregar])

  const alterarStatusHandler = useCallback(async (postId: string, status: StatusPost, dataAgendamento?: Date) => {
    if (!usuario) return
    await postService.alterarStatus(usuario.uid, postId, status, dataAgendamento)
    await carregar()
  }, [usuario, carregar])

  const filtrarPorStatus = useCallback((status: StatusPost) => {
    return postService.filtrarPostsPorStatus(posts, status)
  }, [posts])

  return (
    <ContextoPosts.Provider
      value={{
        posts,
        carregando,
        erro,
        criar,
        atualizar,
        excluir,
        alterarStatus: alterarStatusHandler,
        recarregar: carregar,
        filtrarPorStatus,
      }}
    >
      {children}
    </ContextoPosts.Provider>
  )
}
