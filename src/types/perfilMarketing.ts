import { Timestamp } from 'firebase/firestore'

export type ObjetivoMarketing = 'vendas' | 'engajamento' | 'leads'
export type TomComunicacao = 'formal' | 'vendas' | 'descontrado'

export interface PerfilMarketing {
  id: string
  usuarioId: string
  nicho: string
  publicoAlvo: string
  objetivo: ObjetivoMarketing
  tomComunicacao: TomComunicacao
  atualizadoEm: Timestamp
}
