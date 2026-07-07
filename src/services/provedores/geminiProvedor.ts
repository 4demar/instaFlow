import type {
  OpcoesGeracaoProvedor,
  ParteMultimodalProvedor,
  RespostaProvedor,
} from '../../types/provedorIA'

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models'
const MODELO = 'gemini-2.0-flash'

interface RespostaGemini {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
}

export async function chamarGemini(
  instrucaoSistema: string,
  partes: ParteMultimodalProvedor[],
  opcoes: OpcoesGeracaoProvedor | undefined,
  chaveApi: string
): Promise<RespostaProvedor<string>> {
  if (!chaveApi) {
    return { sucesso: false, erro: 'Chave da API do Gemini não configurada.' }
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
    generationConfig: {
      temperature: opcoes?.temperatura ?? 0.4,
      maxOutputTokens: opcoes?.maxTokens ?? 4096,
      candidateCount: 1,
    },
  }

  try {
    const res = await fetch(
      `${BASE_URL}/${MODELO}:generateContent?key=${encodeURIComponent(chaveApi)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpo),
      }
    )

    if (!res.ok) {
      const texto = await res.text().catch(() => '')
      return { sucesso: false, erro: `${res.status} ${res.statusText} ${texto}`.trim() }
    }

    const json = (await res.json()) as RespostaGemini
    const conteudo = json?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') ?? ''
    if (!conteudo) {
      return { sucesso: false, erro: 'A IA não retornou conteúdo. Tente novamente.' }
    }
    return { sucesso: true, dados: conteudo }
  } catch (erro) {
    const mensagem = erro instanceof Error ? erro.message : 'Erro desconhecido.'
    return { sucesso: false, erro: `Falha ao chamar Gemini: ${mensagem}` }
  }
}
