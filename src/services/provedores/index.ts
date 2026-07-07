import type {
  FuncaoChamadaProvedor,
  IdProvedorIA,
  OpcoesGeracaoProvedor,
  ParteMultimodalProvedor,
  RespostaProvedor,
} from '../../types/provedorIA'
import { chamarGemini } from './geminiProvedor'
import { chamarGroq } from './groqProvedor'
import { chamarOpenRouter } from './openRouterProvedor'
import { chamarHuggingFace } from './huggingFaceProvedor'
import { chamarTransformers } from './transformersProvedor'

const REGISTRO: Record<IdProvedorIA, FuncaoChamadaProvedor> = {
  gemini: (i, p, o, c) => chamarGemini(i, p, o, c ?? ''),
  groq: (i, p, o, c) => chamarGroq(i, p, o, c ?? ''),
  openrouter: (i, p, o, c) => chamarOpenRouter(i, p, o, c ?? ''),
  huggingface: (i, p, o, c) => chamarHuggingFace(i, p, o, c ?? ''),
  transformers: (i, p, o) => chamarTransformers(i, p, o),
}

/**
 * Ponto único de entrada para chamar qualquer provedor.
 */
export function chamarProvedorIA(
  id: IdProvedorIA,
  instrucaoSistema: string,
  partes: ParteMultimodalProvedor[],
  opcoes?: OpcoesGeracaoProvedor,
  chaveApi?: string
): Promise<RespostaProvedor<string>> {
  const chamada = REGISTRO[id]
  if (!chamada) {
    return Promise.resolve({ sucesso: false, erro: `Provedor desconhecido: ${id}` })
  }
  return chamada(instrucaoSistema, partes, opcoes, chaveApi)
}
