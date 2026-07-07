import type {
  OpcoesGeracaoProvedor,
  ParteMultimodalProvedor,
  RespostaProvedor,
} from '../../types/provedorIA'
import { chamarOpenAICompativel } from './openAICompativel'

const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions'
const MODELO = 'meta-llama/llama-3.2-11b-vision-instruct:free'

export function chamarOpenRouter(
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
      cabecalhosExtra: {
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
        'X-Title': 'InstaFlow',
      },
      nomeProvedor: 'OpenRouter',
    },
    instrucaoSistema,
    partes,
    opcoes
  )
}
