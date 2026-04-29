import { Timestamp } from 'firebase/firestore'

export interface Metrica {
  id: string
  postId: string
  curtidas: number
  comentarios: number
  alcance: number
  salvamentos: number
  registradoEm: Timestamp
}
