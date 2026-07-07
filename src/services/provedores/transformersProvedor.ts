import type {
  OpcoesGeracaoProvedor,
  ParteMultimodalProvedor,
  RespostaProvedor,
} from '../../types/provedorIA'

type Pipeline = (input: string) => Promise<Array<{ generated_text: string }>>

let pipelinePromessa: Promise<Pipeline> | null = null

async function obterPipeline(): Promise<Pipeline> {
  if (pipelinePromessa) return pipelinePromessa

  pipelinePromessa = (async () => {
    // Import dinâmico para não pesar o bundle nem obrigar quem não usa a instalar a lib.
    // Requer: npm install @xenova/transformers
    const mod = await import(
      /* @vite-ignore */ '@xenova/transformers'
    ).catch(() => null)

    if (!mod) {
      throw new Error(
        'A biblioteca @xenova/transformers não está instalada. Rode: npm install @xenova/transformers'
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const criarPipeline = (mod as any).pipeline
    return (await criarPipeline('image-to-text', 'Xenova/vit-gpt2-image-captioning')) as Pipeline
  })()

  return pipelinePromessa
}

/**
 * Extrai a primeira imagem inline como data URL para consumo do Transformers.js.
 */
function extrairPrimeiraImagem(partes: ParteMultimodalProvedor[]): string | null {
  const parte = partes.find((p) => p.imagemInline)
  if (!parte?.imagemInline) return null
  return `data:${parte.imagemInline.tipoMime};base64,${parte.imagemInline.dadosBase64}`
}

/**
 * Provedor offline usando Transformers.js. Devolve uma descrição simples da imagem.
 * Ideal quando não há chave de API disponível.
 */
export async function chamarTransformers(
  _instrucaoSistema: string,
  partes: ParteMultimodalProvedor[],
  _opcoes?: OpcoesGeracaoProvedor
): Promise<RespostaProvedor<string>> {
  try {
    const dataUrl = extrairPrimeiraImagem(partes)
    if (!dataUrl) {
      return { sucesso: false, erro: 'Nenhuma imagem encontrada para descrever.' }
    }

    const pipe = await obterPipeline()
    const resultado = await pipe(dataUrl)
    const descricao = resultado?.[0]?.generated_text?.trim() || 'imagem não descrita'

    return { sucesso: true, dados: descricao }
  } catch (erro) {
    const mensagem = erro instanceof Error ? erro.message : 'Erro desconhecido.'
    return { sucesso: false, erro: `Falha no Transformers.js: ${mensagem}` }
  }
}
