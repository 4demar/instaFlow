import { useEffect, useCallback } from 'react'
import { useConexao } from './useConexao'
import { listarChavesPendentes, obterDadosLocais, removerDadosLocais } from '../services/sincronizacaoService'
import { useAutenticacao } from './useAutenticacao'
import * as postService from '../services/postService'
import type { Post } from '../types/post'

/**
 * Hook que sincroniza dados offline com o Firestore ao reconectar.
 */
export function useSincronizacao() {
  const { online } = useConexao()
  const { usuario } = useAutenticacao()

  const sincronizar = useCallback(async () => {
    if (!usuario || !online) return
    const chaves = listarChavesPendentes()
    for (const chave of chaves) {
      try {
        if (chave.startsWith('post_atualizar_')) {
          const dados = obterDadosLocais<{ postId: string; campos: Partial<Post> }>(chave)
          if (dados) {
            await postService.atualizarPost(usuario.uid, dados.postId, dados.campos)
            removerDadosLocais(chave)
          }
        }
      } catch {
        // Mantém dados locais para próxima tentativa
      }
    }
  }, [online, usuario])

  useEffect(() => {
    if (online && usuario) {
      sincronizar()
    }
  }, [online, usuario, sincronizar])

  return { sincronizar }
}
