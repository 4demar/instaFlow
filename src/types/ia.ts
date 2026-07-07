import type { FormatoPost } from './post'

export interface VariacaoConteudo {
  formato: FormatoPost
  legenda: string
  hashtags: string[]
}

export interface SugestaoMelhoria {
  categoria: string
  descricao: string
  prioridade: 'alta' | 'media' | 'baixa'
}

export interface HorarioSugerido {
  diaSemana: number
  horario: string
  confianca: number
}

import type { ObjetivoMarketing, TomComunicacao } from './perfilMarketing'

export interface ConfiguracaoGeracaoIA {
  nicho: string
  publicoAlvo: string
  objetivo: ObjetivoMarketing
  tomComunicacao: TomComunicacao
}
