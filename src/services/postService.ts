import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../database/configuracaoFirebase'
import type { Post, StatusPost } from '../types/post'

function colecaoPosts(uid: string) {
  return collection(db, 'usuarios', uid, 'posts')
}

function docPost(uid: string, postId: string) {
  return doc(db, 'usuarios', uid, 'posts', postId)
}

/**
 * Cria um novo post com status inicial 'rascunho'.
 */
export async function criarPost(
  uid: string,
  dados: Omit<Post, 'id' | 'usuarioId' | 'status' | 'criadoEm' | 'atualizadoEm' | 'dataPublicacao'>
): Promise<string> {
  const ref = doc(colecaoPosts(uid))
  const novoPost = {
    ...dados,
    usuarioId: uid,
    status: 'rascunho' as StatusPost,
    dataPublicacao: null,
    criadoEm: serverTimestamp(),
    atualizadoEm: serverTimestamp(),
  }
  await setDoc(ref, novoPost)
  return ref.id
}

/**
 * Atualiza campos de um post existente.
 */
export async function atualizarPost(
  uid: string,
  postId: string,
  dados: Partial<Omit<Post, 'id' | 'usuarioId' | 'criadoEm'>>
): Promise<void> {
  await updateDoc(docPost(uid, postId), {
    ...dados,
    atualizadoEm: serverTimestamp(),
  })
}

/**
 * Lista todos os posts do usuário ordenados por data de criação.
 */
export async function listarPosts(uid: string): Promise<Post[]> {
  const q = query(colecaoPosts(uid), orderBy('criadoEm', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Post)
}

/**
 * Obtém um post específico.
 */
export async function obterPost(uid: string, postId: string): Promise<Post | null> {
  const snap = await getDoc(docPost(uid, postId))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Post
}

/**
 * Exclui um post.
 */
export async function excluirPost(uid: string, postId: string): Promise<void> {
  await deleteDoc(docPost(uid, postId))
}

/**
 * Altera o status de um post respeitando a máquina de estados.
 * rascunho → agendado (ao definir data) | rascunho → publicado
 * agendado → publicado | agendado → rascunho
 * publicado → (sem transição de volta)
 */
export async function alterarStatus(
  uid: string,
  postId: string,
  novoStatus: StatusPost,
  dataAgendamento?: Date
): Promise<void> {
  const atualizacao: Record<string, unknown> = {
    status: novoStatus,
    atualizadoEm: serverTimestamp(),
  }
  if (novoStatus === 'agendado' && dataAgendamento) {
    atualizacao.dataAgendamento = Timestamp.fromDate(dataAgendamento)
  }
  if (novoStatus === 'publicado') {
    atualizacao.dataPublicacao = serverTimestamp()
  }
  await updateDoc(docPost(uid, postId), atualizacao)
}

/**
 * Filtra posts por status (função pura, sem acesso ao Firestore).
 */
export function filtrarPostsPorStatus(posts: Post[], status: StatusPost): Post[] {
  return posts.filter((p) => p.status === status)
}
