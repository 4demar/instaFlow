import { Timestamp } from 'firebase/firestore'

export type StatusPost = 'rascunho' | 'agendado' | 'publicado'
export type FormatoPost = 'post' | 'story' | 'reel'

export interface Post {
  id: string
  usuarioId: string
  ideia: string
  legenda: string
  hashtags: string[]
  status: StatusPost
  formato: FormatoPost
  urlImagem: string | null
  dataAgendamento: Timestamp | null
  dataPublicacao: Timestamp | null
  criadoEm: Timestamp
  atualizadoEm: Timestamp
}
