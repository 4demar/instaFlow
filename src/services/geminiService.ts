export interface RespostaGemini<T> {
  sucesso: boolean
  dados?: T
  erro?: string
}

export interface ParteMultimodal {
  texto?: string
  imagemInline?: {
    tipoMime: string
    dadosBase64: string
  }
}

export interface OpcoesGeracao {
  temperatura?: number
  maxTokens?: number
  candidatos?: number
}

interface RespostaGeminiTexto {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> }
  }>
}

interface ParteGeminiImagem {
  text?: string
  inlineData?: { mimeType?: string; data?: string }
}

interface RespostaGeminiImagem {
  candidates?: Array<{
    content?: { parts?: ParteGeminiImagem[] }
  }>
}

interface OpcoesRequisicao {
  cachear?: boolean
  ttlCacheMs?: number
}

interface EntradaCache {
  valor: unknown
  expiraEm: number
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models'

export const MODELO_TEXTO = 'gemini-2.0-flash'
export const MODELO_IMAGEM = 'gemini-2.5-flash-image-preview'

const MAX_TENTATIVAS = 4
const ATRASO_INICIAL_MS = 1000
const FATOR_BACKOFF = 2
const TTL_CACHE_PADRAO_MS = 5 * 60 * 1000
const TAMANHO_MAXIMO_CACHE_BYTES = 200 * 1024

const cacheRespostas = new Map<string, EntradaCache>()
const requisicoesEmVoo = new Map<string, Promise<unknown>>()

function montarEndpoint(modelo: string): string {
  return `${GEMINI_BASE_URL}/${modelo}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`
}

function montarConfigGeracao(opcoes?: OpcoesGeracao) {
  return {
    temperature: opcoes?.temperatura ?? 0.8,
    maxOutputTokens: opcoes?.maxTokens ?? 1024,
    candidateCount: opcoes?.candidatos ?? 1,
  }
}

function esperar(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

function calcularAtrasoBackoff(tentativa: number): number {
  const base = ATRASO_INICIAL_MS * FATOR_BACKOFF ** tentativa
  const jitter = Math.floor(Math.random() * 300)
  return base + jitter
}

function tratarErroGemini(erro: unknown): string {
  if (erro instanceof Error) {
    const mensagem = erro.message.toLowerCase()
    if (mensagem.includes('rate limit') || mensagem.includes('429') || mensagem.includes('quota')) {
      return 'Limite de requisições atingido. Aguarde alguns minutos e tente novamente.'
    }
    if (mensagem.includes('timeout') || mensagem.includes('timed out')) {
      return 'A requisição demorou demais. Verifique sua conexão e tente novamente.'
    }
    if (mensagem.includes('safety') || mensagem.includes('policy') || mensagem.includes('blocked')) {
      return 'O conteúdo solicitado viola as políticas. Tente outro prompt.'
    }
    if (mensagem.includes('network') || mensagem.includes('fetch')) {
      return 'Erro de conexão. Verifique sua internet e tente novamente.'
    }
    if (
      mensagem.includes('401') ||
      mensagem.includes('403') ||
      mensagem.includes('unauthorized') ||
      mensagem.includes('forbidden') ||
      mensagem.includes('api key')
    ) {
      return 'Chave de API inválida ou sem permissão. Verifique suas configurações.'
    }
  }
  return 'Erro ao se comunicar com a IA. Tente novamente mais tarde.'
}

/**
 * Extrai um bloco JSON de uma resposta que pode vir cercada por marcadores markdown.
 */
export function extrairJSON(texto: string): string {
  const match = texto.match(/```(?:json)?\s*([\s\S]*?)```/)
  return match ? match[1].trim() : texto.trim()
}

function obterDoCache<T>(chave: string): T | null {
  const entrada = cacheRespostas.get(chave)
  if (!entrada) return null
  if (Date.now() > entrada.expiraEm) {
    cacheRespostas.delete(chave)
    return null
  }
  return entrada.valor as T
}

function salvarNoCache(chave: string, valor: unknown, ttlMs: number): void {
  cacheRespostas.set(chave, { valor, expiraEm: Date.now() + ttlMs })
}

/**
 * Realiza uma requisição POST ao Gemini com retry, dedup e cache opcional.
 */
async function executarRequisicao<TCorpo, TResposta>(
  endpoint: string,
  corpo: TCorpo,
  opcoes?: OpcoesRequisicao
): Promise<TResposta> {
  const corpoSerializado = JSON.stringify(corpo)
  const podeCachear =
    (opcoes?.cachear ?? false) && corpoSerializado.length <= TAMANHO_MAXIMO_CACHE_BYTES
  const chave = `${endpoint}::${corpoSerializado}`

  if (podeCachear) {
    const cacheado = obterDoCache<TResposta>(chave)
    if (cacheado) return cacheado
  }

  const emVoo = requisicoesEmVoo.get(chave)
  if (emVoo) return emVoo as Promise<TResposta>

  const promessa = (async () => {
    let ultimoErro: unknown = null
    for (let tentativa = 0; tentativa < MAX_TENTATIVAS; tentativa++) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: corpoSerializado,
        })

        if (res.status === 429 || res.status === 503) {
          const retryAfter = res.headers.get('retry-after')
          const atraso = retryAfter
            ? Math.max(Number(retryAfter) * 1000, ATRASO_INICIAL_MS)
            : calcularAtrasoBackoff(tentativa)
          if (tentativa < MAX_TENTATIVAS - 1) {
            await esperar(atraso)
            continue
          }
          const texto = await res.text().catch(() => '')
          throw new Error(`${res.status} ${res.statusText} ${texto}`)
        }

        if (!res.ok) {
          const texto = await res.text().catch(() => '')
          throw new Error(`${res.status} ${res.statusText} ${texto}`)
        }

        const json = (await res.json()) as TResposta
        if (podeCachear) {
          salvarNoCache(chave, json, opcoes?.ttlCacheMs ?? TTL_CACHE_PADRAO_MS)
        }
        return json
      } catch (erro) {
        ultimoErro = erro
        if (tentativa >= MAX_TENTATIVAS - 1) break
        // erros de rede também recebem retry com backoff
        if (erro instanceof TypeError) {
          await esperar(calcularAtrasoBackoff(tentativa))
          continue
        }
        break
      }
    }
    throw ultimoErro instanceof Error ? ultimoErro : new Error('Falha na requisição.')
  })()

  requisicoesEmVoo.set(chave, promessa)
  try {
    return await promessa
  } finally {
    requisicoesEmVoo.delete(chave)
  }
}

/**
 * Chama o Gemini enviando uma instrução de sistema e uma mensagem do usuário em texto.
 * Usa cache com TTL para prompts idênticos.
 */
export async function chamarGeminiTexto(
  instrucaoSistema: string,
  mensagemUsuario: string,
  opcoes?: OpcoesGeracao
): Promise<RespostaGemini<string>> {
  try {
    if (!GEMINI_API_KEY) {
      return { sucesso: false, erro: 'Chave da API do Gemini não configurada.' }
    }

    const corpo = {
      systemInstruction: { parts: [{ text: instrucaoSistema }] },
      contents: [{ role: 'user', parts: [{ text: mensagemUsuario }] }],
      generationConfig: montarConfigGeracao(opcoes),
    }

    const json = await executarRequisicao<typeof corpo, RespostaGeminiTexto>(
      montarEndpoint(MODELO_TEXTO),
      corpo,
      { cachear: true }
    )
    const conteudo = json?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || ''

    if (!conteudo) {
      return { sucesso: false, erro: 'A IA não retornou conteúdo. Tente novamente.' }
    }
    return { sucesso: true, dados: conteudo }
  } catch (erro: unknown) {
    return { sucesso: false, erro: tratarErroGemini(erro) }
  }
}

/**
 * Chama o Gemini enviando uma sequência de partes multimodais (texto + imagens inline).
 * Usa apenas deduplicação (sem cache) por causa do tamanho do payload.
 */
export async function chamarGeminiMultimodal(
  instrucaoSistema: string,
  partes: ParteMultimodal[],
  opcoes?: OpcoesGeracao
): Promise<RespostaGemini<string>> {
  try {
    if (!GEMINI_API_KEY) {
      return { sucesso: false, erro: 'Chave da API do Gemini não configurada.' }
    }

    if (partes.length === 0) {
      return { sucesso: false, erro: 'Nenhum conteúdo enviado à IA.' }
    }

    const partesFormatadas = partes.map((parte) => {
      if (parte.imagemInline) {
        return {
          inlineData: {
            mimeType: parte.imagemInline.tipoMime,
            data: parte.imagemInline.dadosBase64,
          },
        }
      }
      return { text: parte.texto ?? '' }
    })

    const corpo = {
      systemInstruction: { parts: [{ text: instrucaoSistema }] },
      contents: [{ role: 'user', parts: partesFormatadas }],
      generationConfig: montarConfigGeracao(opcoes),
    }

    const json = await executarRequisicao<typeof corpo, RespostaGeminiTexto>(
      montarEndpoint(MODELO_TEXTO),
      corpo
    )
    const conteudo = json?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || ''

    if (!conteudo) {
      return { sucesso: false, erro: 'A IA não retornou conteúdo. Tente novamente.' }
    }
    return { sucesso: true, dados: conteudo }
  } catch (erro: unknown) {
    return { sucesso: false, erro: tratarErroGemini(erro) }
  }
}

/**
 * Chama o Gemini pedindo a geração de uma imagem. Retorna a data URL da imagem.
 */
export async function chamarGeminiImagem(prompt: string): Promise<RespostaGemini<string>> {
  try {
    if (!GEMINI_API_KEY) {
      return { sucesso: false, erro: 'Chave da API do Gemini não configurada.' }
    }

    const corpo = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['IMAGE'] },
    }

    const json = await executarRequisicao<typeof corpo, RespostaGeminiImagem>(
      montarEndpoint(MODELO_IMAGEM),
      corpo
    )

    const partes = json?.candidates?.[0]?.content?.parts || []
    const parteImagem = partes.find((p) => p.inlineData?.data)

    if (parteImagem?.inlineData?.data) {
      const mime = parteImagem.inlineData.mimeType || 'image/png'
      return { sucesso: true, dados: `data:${mime};base64,${parteImagem.inlineData.data}` }
    }

    return { sucesso: false, erro: 'A IA não retornou uma imagem. Tente novamente.' }
  } catch (erro: unknown) {
    return { sucesso: false, erro: tratarErroGemini(erro) }
  }
}

/**
 * Limpa manualmente o cache de respostas.
 */
export function limparCacheGemini(): void {
  cacheRespostas.clear()
}
