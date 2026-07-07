import type { Roteiro } from '../types/roteiro'
import type { HashtagSugerida } from '../types/hashtag'
import type {
  VariacaoConteudo,
  SugestaoMelhoria,
  HorarioSugerido,
  ConfiguracaoGeracaoIA,
} from '../types/ia'
import type { PostPlano } from '../types/planoSemanal'
import type { Metrica } from '../types/metrica'
import type { FrameVideo, RoteiroFramesVideo } from '../types/frameVideo'
import type { IdProvedorIA } from '../types/provedorIA'
import {
  chamarGeminiTexto,
  extrairJSON,
  type ParteMultimodal,
  type RespostaGemini,
} from './geminiService'
import { chamarProvedorIA } from './provedores'

export type { ConfiguracaoGeracaoIA }
import { instrucaoSistemaIdeias, mensagemUsuarioIdeias } from '../utils/prompts/promptIdeias'
import { instrucaoSistemaLegenda, mensagemUsuarioLegenda } from '../utils/prompts/promptLegenda'
import { instrucaoSistemaHashtags, mensagemUsuarioHashtags } from '../utils/prompts/promptHashtags'
import { instrucaoSistemaRoteiro, mensagemUsuarioRoteiro } from '../utils/prompts/promptRoteiro'
import { instrucaoSistemaVariacoes, mensagemUsuarioVariacoes } from '../utils/prompts/promptVariacoes'
import { instrucaoSistemaPlanoSemanal, mensagemUsuarioPlanoSemanal } from '../utils/prompts/promptPlanoSemanal'
import {
  instrucaoSistemaAnaliseDesempenho,
  mensagemUsuarioAnaliseDesempenho,
} from '../utils/prompts/promptAnaliseDesempenho'
import { instrucaoSistemaHorarios, mensagemUsuarioHorarios } from '../utils/prompts/promptHorarios'
import { instrucaoSistemaFramesVideo, mensagemUsuarioFramesVideo } from '../utils/prompts/promptFramesVideo'
import { MAX_IMAGENS_FRAMES, TAMANHO_LOTE_FRAMES } from '../utils/configFramesVideo'

export type RespostaIA<T> = RespostaGemini<T>

function mapearResposta<T>(
  resposta: RespostaGemini<string>,
  transformar: (texto: string) => T
): RespostaIA<T> {
  if (!resposta.sucesso || !resposta.dados) {
    return { sucesso: false, erro: resposta.erro }
  }
  try {
    return { sucesso: true, dados: transformar(resposta.dados) }
  } catch {
    return { sucesso: false, erro: 'Não foi possível interpretar a resposta da IA.' }
  }
}

/**
 * Gera ideias de posts com base no perfil do usuário.
 */
export async function gerarIdeias(config: ConfiguracaoGeracaoIA): Promise<RespostaIA<string[]>> {
  const resposta = await chamarGeminiTexto(instrucaoSistemaIdeias(config), mensagemUsuarioIdeias())
  return mapearResposta<string[]>(resposta, (texto) => JSON.parse(extrairJSON(texto)))
}

/**
 * Gera uma legenda otimizada para conversão.
 */
export async function gerarLegenda(
  config: ConfiguracaoGeracaoIA,
  ideia: string
): Promise<RespostaIA<string>> {
  const resposta = await chamarGeminiTexto(instrucaoSistemaLegenda(config), mensagemUsuarioLegenda(ideia))
  return mapearResposta<string>(resposta, (texto) => texto.trim())
}

/**
 * Gera hashtags relevantes categorizadas por relevância.
 */
export async function gerarHashtags(
  config: ConfiguracaoGeracaoIA,
  conteudo: string
): Promise<RespostaIA<HashtagSugerida[]>> {
  const resposta = await chamarGeminiTexto(
    instrucaoSistemaHashtags(config),
    mensagemUsuarioHashtags(conteudo)
  )
  return mapearResposta<HashtagSugerida[]>(resposta, (texto) => JSON.parse(extrairJSON(texto)))
}

/**
 * Gera um roteiro estruturado para reels.
 */
export async function gerarRoteiro(
  config: ConfiguracaoGeracaoIA,
  ideia: string
): Promise<RespostaIA<Roteiro>> {
  const resposta = await chamarGeminiTexto(
    instrucaoSistemaRoteiro(config),
    mensagemUsuarioRoteiro(ideia)
  )
  return mapearResposta<Roteiro>(resposta, (texto) => {
    const parsed = JSON.parse(extrairJSON(texto))
    return { id: '', postId: '', atualizadoEm: null, ...parsed } as unknown as Roteiro
  })
}

/**
 * Gera variações de conteúdo em múltiplos formatos a partir de uma ideia.
 */
export async function gerarVariacoes(
  config: ConfiguracaoGeracaoIA,
  ideia: string
): Promise<RespostaIA<VariacaoConteudo[]>> {
  const resposta = await chamarGeminiTexto(
    instrucaoSistemaVariacoes(config),
    mensagemUsuarioVariacoes(ideia)
  )
  return mapearResposta<VariacaoConteudo[]>(resposta, (texto) => JSON.parse(extrairJSON(texto)))
}

/**
 * Gera um plano semanal completo com 7 posts.
 */
export async function gerarPlanoSemanal(
  config: ConfiguracaoGeracaoIA
): Promise<RespostaIA<PostPlano[]>> {
  const resposta = await chamarGeminiTexto(
    instrucaoSistemaPlanoSemanal(config),
    mensagemUsuarioPlanoSemanal()
  )
  return mapearResposta<PostPlano[]>(resposta, (texto) => JSON.parse(extrairJSON(texto)))
}

/**
 * Analisa métricas e gera sugestões de melhoria.
 */
export async function analisarDesempenho(
  config: ConfiguracaoGeracaoIA,
  metricas: Metrica[]
): Promise<RespostaIA<SugestaoMelhoria[]>> {
  const resposta = await chamarGeminiTexto(
    instrucaoSistemaAnaliseDesempenho(config),
    mensagemUsuarioAnaliseDesempenho(metricas)
  )
  return mapearResposta<SugestaoMelhoria[]>(resposta, (texto) => JSON.parse(extrairJSON(texto)))
}

/**
 * Sugere melhores horários de postagem com base em métricas.
 */
export async function sugerirHorarios(
  config: ConfiguracaoGeracaoIA,
  metricas: Metrica[]
): Promise<RespostaIA<HorarioSugerido[]>> {
  const resposta = await chamarGeminiTexto(
    instrucaoSistemaHorarios(config),
    mensagemUsuarioHorarios(config, metricas)
  )
  return mapearResposta<HorarioSugerido[]>(resposta, (texto) => JSON.parse(extrairJSON(texto)))
}

export interface ConfiguracaoProvedorFrames {
  provedor: IdProvedorIA
  chaveApi?: string
}

interface ImagemFrame {
  nome: string
  tipoMime: string
  dadosBase64: string
}

function frameMinimoDeDescricao(descricao: string, ordem: number, nomeArquivo: string): FrameVideo {
  return {
    ordem,
    nomeArquivo,
    descricao,
    elementosPrincipais: [],
    cores: [],
    atmosfera: '',
    duracaoSugeridaSegundos: 3,
  }
}

async function gerarFramesLote(
  config: ConfiguracaoProvedorFrames,
  lote: ImagemFrame[],
  deslocamento: number,
  total: number
): Promise<RespostaIA<FrameVideo[]>> {
  // Transformers.js só analisa uma imagem por vez e não emite JSON;
  // então geramos frame a frame e montamos o objeto no cliente.
  if (config.provedor === 'transformers') {
    const frames: FrameVideo[] = []
    for (let i = 0; i < lote.length; i++) {
      const imagem = lote[i]
      const resposta = await chamarProvedorIA(
        'transformers',
        instrucaoSistemaFramesVideo(),
        [{ imagemInline: { tipoMime: imagem.tipoMime, dadosBase64: imagem.dadosBase64 } }]
      )
      if (!resposta.sucesso || !resposta.dados) {
        return { sucesso: false, erro: resposta.erro ?? 'Falha ao processar imagem local.' }
      }
      frames.push(frameMinimoDeDescricao(resposta.dados, deslocamento + i + 1, imagem.nome))
    }
    return { sucesso: true, dados: frames }
  }

  const partes: ParteMultimodal[] = [
    {
      texto: mensagemUsuarioFramesVideo(
        lote.map((img) => img.nome),
        { deslocamento, total }
      ),
    },
    ...lote.map((img) => ({
      imagemInline: { tipoMime: img.tipoMime, dadosBase64: img.dadosBase64 },
    })),
  ]

  const resposta = await chamarProvedorIA(
    config.provedor,
    instrucaoSistemaFramesVideo(),
    partes,
    { temperatura: 0.4, maxTokens: 4096 },
    config.chaveApi
  )

  if (!resposta.sucesso || !resposta.dados) {
    return { sucesso: false, erro: resposta.erro }
  }

  try {
    const parcial = JSON.parse(extrairJSON(resposta.dados)) as RoteiroFramesVideo
    const framesAjustados = parcial.frames.map((frame, indiceLote) => ({
      ...frame,
      ordem: deslocamento + indiceLote + 1,
      nomeArquivo: lote[indiceLote]?.nome ?? frame.nomeArquivo,
    }))
    return { sucesso: true, dados: framesAjustados }
  } catch {
    return { sucesso: false, erro: 'Não foi possível interpretar o JSON retornado pela IA.' }
  }
}

/**
 * Gera um roteiro de frames de vídeo a partir de uma lista ordenada de imagens.
 * Divide a lista em lotes e delega ao provedor escolhido.
 */
export async function gerarFramesVideo(
  imagens: ImagemFrame[],
  config: ConfiguracaoProvedorFrames
): Promise<RespostaIA<RoteiroFramesVideo>> {
  if (imagens.length === 0) {
    return { sucesso: false, erro: 'Nenhuma imagem enviada.' }
  }
  if (imagens.length > MAX_IMAGENS_FRAMES) {
    return {
      sucesso: false,
      erro: `O máximo permitido é ${MAX_IMAGENS_FRAMES} imagens por geração.`,
    }
  }

  const framesConsolidados: FrameVideo[] = []

  for (let inicio = 0; inicio < imagens.length; inicio += TAMANHO_LOTE_FRAMES) {
    const lote = imagens.slice(inicio, inicio + TAMANHO_LOTE_FRAMES)
    const parcial = await gerarFramesLote(config, lote, inicio, imagens.length)
    if (!parcial.sucesso || !parcial.dados) {
      return { sucesso: false, erro: parcial.erro ?? 'Falha ao gerar um dos lotes.' }
    }
    framesConsolidados.push(...parcial.dados)
  }

  return {
    sucesso: true,
    dados: {
      totalFrames: framesConsolidados.length,
      frames: framesConsolidados,
    },
  }
}
