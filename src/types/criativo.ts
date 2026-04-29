import { Timestamp } from 'firebase/firestore'

export type FormatoCriativo = '1080x1080' | '1080x1920'

export interface Criativo {
  id: string
  postId: string
  urlImagem: string
  formato: FormatoCriativo
  templateId: string | null
  textos: Record<string, string>
  criadoEm: Timestamp
}
