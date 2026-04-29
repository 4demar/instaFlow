export type RelevanciaHashtag = 'alta' | 'media' | 'baixa'

export interface HashtagSugerida {
  texto: string
  relevancia: RelevanciaHashtag
}
