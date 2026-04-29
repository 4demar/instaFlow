import OpenAI from 'openai'
import type { ObjetivoMarketing, TomComunicacao } from '../types/perfilMarketing'
import type { Roteiro } from '../types/roteiro'
import type { HashtagSugerida } from '../types/hashtag'
import type { VariacaoConteudo, SugestaoMelhoria, HorarioSugerido } from '../types/ia'
import type { PostPlano } from '../types/planoSemanal'
import type { Metrica } from '../types/metrica'

export interface ConfiguracaoGeracaoIA {
  nicho: string
  publicoAlvo: string
  objetivo: ObjetivoMarketing
  tomComunicacao: TomComunicacao
}

export interface RespostaIA<T> {
  sucesso: boolean
  dados?: T
  erro?: string
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

function montarContextoPerfil(config: ConfiguracaoGeracaoIA): string {
  return `Nicho: ${config.nicho}\nPúblico-alvo: ${config.publicoAlvo}\nObjetivo: ${config.objetivo}\nTom de comunicação: ${config.tomComunicacao}`
}

async function chamarOpenAI<T>(
  mensagemSistema: string,
  mensagemUsuario: string,
  parsear: (texto: string) => T
): Promise<RespostaIA<T>> {
  try {
    const resposta = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: mensagemSistema },
        { role: 'user', content: mensagemUsuario },
      ],
      temperature: 0.8,
    })
    const conteudo = resposta.choices[0]?.message?.content
    if (!conteudo) {
      return { sucesso: false, erro: 'A IA não retornou conteúdo. Tente novamente.' }
    }
    const dados = parsear(conteudo)
    return { sucesso: true, dados }
  } catch (erro: unknown) {
    return { sucesso: false, erro: tratarErroOpenAI(erro) }
  }
}

function tratarErroOpenAI(erro: unknown): string {
  if (erro instanceof Error) {
    const mensagem = erro.message.toLowerCase()
    if (mensagem.includes('rate limit') || mensagem.includes('429')) {
      return 'Limite de requisições atingido. Aguarde alguns minutos e tente novamente.'
    }
    if (mensagem.includes('timeout') || mensagem.includes('timed out')) {
      return 'A requisição demorou demais. Verifique sua conexão e tente novamente.'
    }
    if (mensagem.includes('network') || mensagem.includes('fetch')) {
      return 'Erro de conexão. Verifique sua internet e tente novamente.'
    }
    if (mensagem.includes('401') || mensagem.includes('unauthorized')) {
      return 'Chave de API inválida. Verifique suas configurações.'
    }
  }
  return 'Erro ao se comunicar com a IA. Tente novamente mais tarde.'
}

function extrairJSON(texto: string): string {
  const match = texto.match(/```(?:json)?\s*([\s\S]*?)```/)
  return match ? match[1].trim() : texto.trim()
}

/**
 * Gera ideias de posts com base no perfil do usuário.
 */
export async function gerarIdeias(config: ConfiguracaoGeracaoIA): Promise<RespostaIA<string[]>> {
  const contexto = montarContextoPerfil(config)
  return chamarOpenAI<string[]>(
    `Você é um especialista em marketing para Instagram. Gere ideias de posts criativas e relevantes.\n\nContexto do perfil:\n${contexto}`,
    'Gere 5 ideias de posts para Instagram. Retorne um JSON array de strings, sem explicações adicionais.',
    (texto) => JSON.parse(extrairJSON(texto))
  )
}

/**
 * Gera uma legenda otimizada para conversão.
 */
export async function gerarLegenda(
  config: ConfiguracaoGeracaoIA,
  ideia: string
): Promise<RespostaIA<string>> {
  const contexto = montarContextoPerfil(config)
  return chamarOpenAI<string>(
    `Você é um copywriter especialista em Instagram. Crie legendas com foco em conversão, incluindo CTAs relevantes.\n\nContexto do perfil:\n${contexto}`,
    `Crie uma legenda para o seguinte post: "${ideia}". Retorne apenas o texto da legenda, sem JSON.`,
    (texto) => texto.trim()
  )
}

/**
 * Gera hashtags relevantes categorizadas por relevância.
 */
export async function gerarHashtags(
  config: ConfiguracaoGeracaoIA,
  conteudo: string
): Promise<RespostaIA<HashtagSugerida[]>> {
  const contexto = montarContextoPerfil(config)
  return chamarOpenAI<HashtagSugerida[]>(
    `Você é um especialista em hashtags para Instagram. Sugira hashtags categorizadas por relevância.\n\nContexto do perfil:\n${contexto}`,
    `Sugira 15 hashtags para o conteúdo: "${conteudo}". Retorne um JSON array com objetos { "texto": "#hashtag", "relevancia": "alta"|"media"|"baixa" }.`,
    (texto) => JSON.parse(extrairJSON(texto))
  )
}

/**
 * Gera um roteiro estruturado para reels.
 */
export async function gerarRoteiro(
  config: ConfiguracaoGeracaoIA,
  ideia: string
): Promise<RespostaIA<Roteiro>> {
  const contexto = montarContextoPerfil(config)
  return chamarOpenAI<Roteiro>(
    `Você é um roteirista de reels para Instagram. Crie roteiros estruturados com gancho, desenvolvimento e CTA.\n\nContexto do perfil:\n${contexto}`,
    `Crie um roteiro para reel sobre: "${ideia}". Retorne um JSON com { "gancho": "...", "desenvolvimento": "...", "chamadaAcao": "..." }.`,
    (texto) => {
      const parsed = JSON.parse(extrairJSON(texto))
      return { id: '', postId: '', atualizadoEm: null, ...parsed } as unknown as Roteiro
    }
  )
}

/**
 * Gera variações de conteúdo em múltiplos formatos a partir de uma ideia.
 */
export async function gerarVariacoes(
  config: ConfiguracaoGeracaoIA,
  ideia: string
): Promise<RespostaIA<VariacaoConteudo[]>> {
  const contexto = montarContextoPerfil(config)
  return chamarOpenAI<VariacaoConteudo[]>(
    `Você é um estrategista de conteúdo para Instagram. Expanda ideias em múltiplos formatos.\n\nContexto do perfil:\n${contexto}`,
    `Expanda a ideia "${ideia}" em 3 variações (post, story, reel). Retorne um JSON array com objetos { "formato": "post"|"story"|"reel", "legenda": "...", "hashtags": ["..."] }.`,
    (texto) => JSON.parse(extrairJSON(texto))
  )
}

/**
 * Gera um plano semanal completo com 7 posts.
 */
export async function gerarPlanoSemanal(
  config: ConfiguracaoGeracaoIA
): Promise<RespostaIA<PostPlano[]>> {
  const contexto = montarContextoPerfil(config)
  return chamarOpenAI<PostPlano[]>(
    `Você é um estrategista de marketing para Instagram. Crie planos semanais completos.\n\nContexto do perfil:\n${contexto}`,
    `Gere um plano semanal com 7 posts (um por dia, domingo=0 a sábado=6). Retorne um JSON array com objetos { "diaSemana": 0-6, "ideia": "...", "legenda": "...", "hashtags": ["..."], "horarioSugerido": "HH:MM", "aprovado": false }.`,
    (texto) => JSON.parse(extrairJSON(texto))
  )
}

/**
 * Analisa métricas e gera sugestões de melhoria.
 */
export async function analisarDesempenho(
  config: ConfiguracaoGeracaoIA,
  metricas: Metrica[]
): Promise<RespostaIA<SugestaoMelhoria[]>> {
  const contexto = montarContextoPerfil(config)
  const dadosMetricas = metricas.map((m) => ({
    curtidas: m.curtidas,
    comentarios: m.comentarios,
    alcance: m.alcance,
    salvamentos: m.salvamentos,
  }))
  return chamarOpenAI<SugestaoMelhoria[]>(
    `Você é um analista de marketing para Instagram. Analise métricas e sugira melhorias.\n\nContexto do perfil:\n${contexto}`,
    `Analise estas métricas e sugira melhorias: ${JSON.stringify(dadosMetricas)}. Retorne um JSON array com objetos { "categoria": "...", "descricao": "...", "prioridade": "alta"|"media"|"baixa" }.`,
    (texto) => JSON.parse(extrairJSON(texto))
  )
}

/**
 * Sugere melhores horários de postagem com base em métricas.
 */
export async function sugerirHorarios(
  config: ConfiguracaoGeracaoIA,
  metricas: Metrica[]
): Promise<RespostaIA<HorarioSugerido[]>> {
  const contexto = montarContextoPerfil(config)
  const temMetricas = metricas.length > 0
  const prompt = temMetricas
    ? `Com base nestas métricas: ${JSON.stringify(metricas.map((m) => ({ curtidas: m.curtidas, comentarios: m.comentarios })))}, sugira os melhores horários de postagem.`
    : `Não há métricas registradas. Sugira horários padrão baseados em boas práticas para o nicho "${config.nicho}".`

  return chamarOpenAI<HorarioSugerido[]>(
    `Você é um especialista em engajamento no Instagram. Sugira horários ideais de postagem.\n\nContexto do perfil:\n${contexto}`,
    `${prompt} Retorne um JSON array com objetos { "diaSemana": 0-6, "horario": "HH:MM", "confianca": 0.0-1.0 }.`,
    (texto) => JSON.parse(extrairJSON(texto))
  )
}
