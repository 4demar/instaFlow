import type {
  OpcoesGeracaoProvedor,
  ParteMultimodalProvedor,
  RespostaProvedor,
} from '../../types/provedorIA'
import { chamarOpenAICompativel } from './openAICompativel'

const ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'
const MODELO = 'meta-llama/llama-4-scout-17b-16e-instruct'

export function chamarGroq(
  instrucaoSistema: string,
  partes: ParteMultimodalProvedor[],
  opcoes: OpcoesGeracaoProvedor | undefined,
  chaveApi: string
): Promise<RespostaProvedor<string>> {
  return chamarOpenAICompativel(
    {
      endpoint: ENDPOINT,
      modelo: MODELO,
      chaveApi,
      nomeProvedor: 'Groq',
    },
    instrucaoSistema,
    partes,
    opcoes
  )
}
