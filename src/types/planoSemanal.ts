import { Timestamp } from 'firebase/firestore'

export type StatusPlano = 'gerado' | 'aprovado' | 'parcial'

export interface PostPlano {
  diaSemana: number
  ideia: string
  legenda: string
  hashtags: string[]
  horarioSugerido: string
  aprovado: boolean
}

export interface PlanoSemanal {
  id: string
  usuarioId: string
  semanaInicio: Timestamp
  postsPlano: PostPlano[]
  statusPlano: StatusPlano
  criadoEm: Timestamp
}
