import { Timestamp } from 'firebase/firestore'

export interface Usuario {
  uid: string
  email: string
  nomeExibicao: string
  criadoEm: Timestamp
}
