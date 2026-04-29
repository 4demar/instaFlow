import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
} from 'firebase/firestore'
import { db } from '../database/configuracaoFirebase'
import type { Metrica } from '../types/metrica'

function colecaoMetricas(uid: string) {
  return collection(db, 'usuarios', uid, 'metricas')
}

/**
 * Registra uma nova métrica para um post publicado.
 */
export async function registrarMetrica(
  uid: string,
  dados: Omit<Metrica, 'id' | 'registradoEm'>
): Promise<string> {
  const ref = doc(colecaoMetricas(uid))
  await setDoc(ref, {
    ...dados,
    registradoEm: serverTimestamp(),
  })
  return ref.id
}

/**
 * Atualiza uma métrica existente.
 */
export async function atualizarMetrica(
  uid: string,
  metricaId: string,
  dados: Partial<Omit<Metrica, 'id' | 'postId' | 'registradoEm'>>
): Promise<void> {
  await updateDoc(doc(colecaoMetricas(uid), metricaId), dados)
}

/**
 * Obtém métricas de um post específico.
 */
export async function obterMetricasPorPost(uid: string, postId: string): Promise<Metrica[]> {
  const q = query(colecaoMetricas(uid), where('postId', '==', postId))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Metrica)
}

/**
 * Obtém todas as métricas do usuário.
 */
export async function obterTodasMetricas(uid: string): Promise<Metrica[]> {
  const snap = await getDocs(colecaoMetricas(uid))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Metrica)
}

interface ResumoMetricas {
  totalPosts: number
  mediaCurtidas: number
  mediaComentarios: number
  mediaAlcance: number
  mediaSalvamentos: number
}

/**
 * Calcula o resumo de métricas (médias de engajamento).
 */
export function obterResumoMetricas(metricas: Metrica[]): ResumoMetricas {
  if (metricas.length === 0) {
    return { totalPosts: 0, mediaCurtidas: 0, mediaComentarios: 0, mediaAlcance: 0, mediaSalvamentos: 0 }
  }
  const total = metricas.length
  return {
    totalPosts: total,
    mediaCurtidas: metricas.reduce((s, m) => s + m.curtidas, 0) / total,
    mediaComentarios: metricas.reduce((s, m) => s + m.comentarios, 0) / total,
    mediaAlcance: metricas.reduce((s, m) => s + m.alcance, 0) / total,
    mediaSalvamentos: metricas.reduce((s, m) => s + m.salvamentos, 0) / total,
  }
}
