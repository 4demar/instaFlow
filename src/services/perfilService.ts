import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../database/configuracaoFirebase'
import type { PerfilMarketing } from '../types/perfilMarketing'

const COLECAO_PERFIL = 'perfil'

function caminhoPerfilDoc(uid: string) {
  return doc(db, 'usuarios', uid, COLECAO_PERFIL, 'dados')
}

/**
 * Obtém o perfil de marketing do usuário.
 */
export async function obterPerfil(uid: string): Promise<PerfilMarketing | null> {
  const snap = await getDoc(caminhoPerfilDoc(uid))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as PerfilMarketing
}

/**
 * Cria ou sobrescreve o perfil de marketing do usuário.
 */
export async function salvarPerfil(
  uid: string,
  dados: Omit<PerfilMarketing, 'id' | 'usuarioId' | 'atualizadoEm'>
): Promise<void> {
  await setDoc(caminhoPerfilDoc(uid), {
    ...dados,
    usuarioId: uid,
    atualizadoEm: serverTimestamp(),
  })
}

/**
 * Atualiza campos específicos do perfil de marketing.
 */
export async function atualizarPerfil(
  uid: string,
  dados: Partial<Omit<PerfilMarketing, 'id' | 'usuarioId' | 'atualizadoEm'>>
): Promise<void> {
  await updateDoc(caminhoPerfilDoc(uid), {
    ...dados,
    atualizadoEm: serverTimestamp(),
  })
}
