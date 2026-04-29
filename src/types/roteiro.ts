import { Timestamp } from 'firebase/firestore'

export interface Roteiro {
  id: string
  postId: string
  gancho: string
  desenvolvimento: string
  chamadaAcao: string
  atualizadoEm: Timestamp
}
