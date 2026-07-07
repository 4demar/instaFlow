import type {
  OpcoesGeracaoProvedor,
  ParteMultimodalProvedor,
  RespostaProvedor,
} from '../../types/provedorIA'

interface RespostaChatCompletion {
  choices?: Array<{ message?: { content?: string } }>
  error?: { message?: string }
}

interface ConteudoTexto {
  type: 'text'
  text: string
}

interface ConteudoImagem {
  type: 'image_url'
  image_url: { url: string }
}

type ItemConteudo = ConteudoTexto | ConteudoImagem

export interface ConfigOpenAICompativel {
  endpoint: string
  modelo: string
  chaveApi: string
  cabecalhosExtra?: Record<string, string>
  nomeProvedor: string
}

function montarConteudoUsuario(partes: ParteMultimodalProvedor[]): ItemConteudo[] {
  return partes.map((parte) => {
    if (parte.imagemInline) {
      const url = `data:${parte.imagemInline.tipoMime};base64,${parte.imagemInline.dadosBase64}`
      return { type: 'image_url', image_url: { url } } satisfies ConteudoImagem
    }
    return { type: 'text', text: parte.texto ?? '' } satisfies ConteudoTexto
  })
}

/**
 * Chama uma API no padrão OpenAI Chat Completions.
 * Serve para Groq, OpenRouter, Hugging Face Router e outros.
 */
export async function chamarOpenAICompativel(
  config: ConfigOpenAICompativel,
  instrucaoSistema: string,
  partes: ParteMultimodalProvedor[],
  opcoes?: OpcoesGeracaoProvedor
): Promise<RespostaProvedor<string>> {
  if (!config.chaveApi) {
    return {
      sucesso: false,
      erro: `Chave da API do ${config.nomeProvedor} não configurada.`,
    }
  }

  const corpo = {
    model: config.modelo,
    messages: [
      { role: 'system', content: instrucaoSistema },
      { role: 'user', content: montarConteudoUsuario(partes) },
    ],
    temperature: opcoes?.temperatura ?? 0.4,
    max_tokens: opcoes?.maxTokens ?? 4096,
  }

  try {
    const res = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.chaveApi}`,
        ...(config.cabecalhosExtra ?? {}),
      },
      body: JSON.stringify(corpo),
    })

    if (!res.ok) {
      const texto = await res.text().catch(() => '')
      return { sucesso: false, erro: `${res.status} ${res.statusText} ${texto}`.trim() }
    }

    const json = (await res.json()) as RespostaChatCompletion
    if (json.error?.message) {
      return { sucesso: false, erro: json.error.message }
    }
    const conteudo = json.choices?.[0]?.message?.content?.trim() ?? ''
    if (!conteudo) {
      return { sucesso: false, erro: 'A IA não retornou conteúdo. Tente novamente.' }
    }
    return { sucesso: true, dados: conteudo }
  } catch (erro) {
    const mensagem = erro instanceof Error ? erro.message : 'Erro desconhecido.'
    return { sucesso: false, erro: `Falha ao chamar ${config.nomeProvedor}: ${mensagem}` }
  }
}
