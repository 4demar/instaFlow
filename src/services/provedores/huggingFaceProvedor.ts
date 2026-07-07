import type {
  OpcoesGeracaoProvedor,
  ParteMultimodalProvedor,
  RespostaProvedor,
} from '../../types/provedorIA'
import { chamarOpenAICompativel } from './openAICompativel'

const ENDPOINT = 'https://router.huggingface.co/v1/chat/completions'
const MODELO = 'meta-llama/Llama-3.2-11B-Vision-Instruct'

export function chamarHuggingFace(
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
      nomeProvedor: 'Hugging Face',
    },
    instrucaoSistema,
    partes,
    opcoes
  )
}
