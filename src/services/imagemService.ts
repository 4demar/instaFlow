import type { FormatoCriativo } from '../types/criativo'

export interface RespostaImagem {
  sucesso: boolean
  urlImagem?: string
  erro?: string
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY || ''

const MAPA_FORMATOS: Record<FormatoCriativo, { size: '1024x1024' | '1024x1792' }> = {
  '1080x1080': { size: '1024x1024' },
  '1080x1920': { size: '1024x1792' },
}

/**
 * Gera uma imagem usando a API de geração de imagens do Gemini (Generative AI).
 */
export async function gerarImagem(
  prompt: string,
  formato: FormatoCriativo
): Promise<RespostaImagem> {
  try {
    if (!GEMINI_API_KEY) {
      return { sucesso: false, erro: 'Chave da API do Gemini não configurada.' }
    }

    const config = MAPA_FORMATOS[formato]
    const endpoint =
      'https://generativelanguage.googleapis.com/v1/images:generate?key=' + encodeURIComponent(GEMINI_API_KEY)

    const body = {
      model: 'image-bison-001',
      prompt,
      // tamanho na API pode variar; usamos um campo compatível com expectativas comuns
      // (ex.: "size" ou "imageSize") — deixamos "size" conforme mapeamento acima.
      size: config.size,
      // solicitar retorno em base64 para uso direto no frontend
      // alguns endpoints retornam "uri" ou "b64" — tratamos múltiplos formatos abaixo.
      // maxRetries / safetyOptions / other params podem ser adicionados conforme necessidade.
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const texto = await res.text().catch(() => '')
      throw new Error(`${res.status} ${res.statusText} ${texto}`)
    }

    const json = await res.json()

    // Tentativas de localizar a imagem retornada em respostas comuns:
    // - base64 em locais como json?.data[0]?.b64 || json?.artifacts[0]?.base64
    // - URI em json?.data[0]?.uri || json?.artifacts[0]?.uri
    const b64 =
      json?.data?.[0]?.b64 ||
      json?.artifacts?.[0]?.base64 ||
      json?.artifacts?.[0]?.b64 ||
      json?.output?.[0]?.b64

    const uri =
      json?.data?.[0]?.uri ||
      json?.artifacts?.[0]?.uri ||
      json?.output?.[0]?.uri ||
      json?.imageUrl ||
      json?.url

    if (b64) {
      return { sucesso: true, urlImagem: `data:image/png;base64,${b64}` }
    }
    if (uri) {
      return { sucesso: true, urlImagem: uri }
    }

    return { sucesso: false, erro: 'A IA não retornou uma imagem. Tente novamente.' }
  } catch (erro: unknown) {
    if (erro instanceof Error) {
      const msg = erro.message.toLowerCase()
      if (msg.includes('rate limit') || msg.includes('429')) {
        return { sucesso: false, erro: 'Limite de requisições atingido. Aguarde e tente novamente.' }
      }
      if (msg.includes('content_policy') || msg.includes('policy')) {
        return { sucesso: false, erro: 'O conteúdo solicitado viola as políticas. Tente outro prompt.' }
      }
    }
    return { sucesso: false, erro: 'Erro ao gerar imagem. Tente novamente mais tarde.' }
  }
}

/**
 * Retorna os formatos disponíveis para criativos.
 */
export function obterFormatos(): { valor: FormatoCriativo; rotulo: string }[] {
  return [
    { valor: '1080x1080', rotulo: 'Post quadrado (1080x1080)' },
    { valor: '1080x1920', rotulo: 'Story / Reel (1080x1920)' },
  ]
}
